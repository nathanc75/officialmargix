import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize OpenAI client (via Replit AI Integrations - no API key needed)
let openai = null;
if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

// Initialize Gemini client (via Replit AI Integrations - no API key needed)
let gemini = null;
if (process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
  gemini = new GoogleGenAI({
    apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
    httpOptions: {
      apiVersion: "",
      baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
    },
  });
}

app.use(cors());
app.use(express.json());

// Object storage setup
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

async function signObjectURL({ bucketName, objectName, method, ttlSec }) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to sign object URL: ${response.status}`);
  }
  const { signed_url } = await response.json();
  return signed_url;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// File upload endpoint - returns presigned URL
app.post("/api/uploads/request-url", async (req, res) => {
  try {
    const { name, size, contentType } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Missing required field: name" });
    }

    const privateDir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!privateDir) {
      return res.status(500).json({ error: "Object storage not configured" });
    }

    const objectId = randomUUID();
    const extension = name.split('.').pop() || '';
    const objectName = `uploads/${objectId}.${extension}`;
    
    // Parse the private dir to get bucket name
    const parts = privateDir.startsWith('/') ? privateDir.slice(1).split('/') : privateDir.split('/');
    const bucketName = parts[0];
    const fullObjectName = parts.slice(1).join('/') + '/' + objectName;

    const uploadURL = await signObjectURL({
      bucketName,
      objectName: fullObjectName,
      method: "PUT",
      ttlSec: 900,
    });

    res.json({
      uploadURL,
      objectPath: `/objects/${objectName}`,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// List uploaded files (for demo purposes, stores in memory)
const uploadedFiles = [];

app.post("/api/uploads/complete", (req, res) => {
  const { name, objectPath, size, contentType } = req.body;
  uploadedFiles.push({
    id: randomUUID(),
    name,
    objectPath,
    size,
    contentType,
    uploadedAt: new Date().toISOString(),
  });
  res.json({ success: true, file: uploadedFiles[uploadedFiles.length - 1] });
});

app.get("/api/uploads", (req, res) => {
  res.json(uploadedFiles);
});

let supabase = null;
if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

app.get("/api/metrics", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Database not configured" });
  const { restaurant_id } = req.query;
  if (!restaurant_id) return res.status(400).json({ error: "restaurant_id required" });

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("restaurant_id", restaurant_id);

  if (error) return res.status(500).json({ error: error.message });

  let totals = {
    orders: orders.length,
    revenue: 0,
    fees: 0,
    promos: 0,
    refunds: 0,
    net_profit: 0
  };

  for (const o of orders) {
    totals.revenue += o.item_subtotal_cents;
    totals.fees += o.fees_cents;
    totals.promos += o.promos_cents;
    totals.refunds += o.refunds_cents;
    totals.net_profit +=
      o.item_subtotal_cents - o.fees_cents - o.promos_cents - o.refunds_cents;
  }

  res.json({
    restaurant_id,
    totals_cents: totals,
    totals_dollars: {
      revenue: totals.revenue / 100,
      fees: totals.fees / 100,
      promos: totals.promos / 100,
      refunds: totals.refunds / 100,
      net_profit: totals.net_profit / 100
    }
  });
});

// AI Analysis endpoint for delivery reports (OpenAI GPT-4o-mini)
app.post("/api/analyze/report", async (req, res) => {
  try {
    const { reportContent, reportType } = req.body;
    
    if (!reportContent) {
      return res.status(400).json({ error: "Report content is required" });
    }

    const systemPrompt = `You are an expert delivery analytics assistant for restaurants. Analyze delivery platform reports and extract key financial data.

Your task is to:
1. Identify revenue, fees, promotions, refunds, and net profit
2. Flag any pricing errors or discrepancies
3. Highlight missed refund opportunities
4. Calculate estimated profit margins

IMPORTANT: All extracted values are ESTIMATES unless they come from verified platform data. Mark estimated values clearly.

Respond in JSON format with this structure:
{
  "summary": {
    "totalRevenue": { "value": number, "isEstimate": boolean },
    "totalFees": { "value": number, "isEstimate": boolean },
    "totalPromos": { "value": number, "isEstimate": boolean },
    "totalRefunds": { "value": number, "isEstimate": boolean },
    "netProfit": { "value": number, "isEstimate": boolean }
  },
  "issues": [
    { "type": "pricing_error" | "missed_refund" | "fee_discrepancy" | "promo_loss", "description": string, "potentialRecovery": number }
  ],
  "items": [
    { "name": string, "quantity": number, "revenue": number, "profit": number, "isEstimate": boolean }
  ],
  "recommendations": [string]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this ${reportType || 'delivery'} report:\n\n${reportContent}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    
    res.json({
      success: true,
      analysis,
      model: "gpt-4o-mini",
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing report:", error);
    res.status(500).json({ error: "Failed to analyze report", details: error.message });
  }
});

// AI Analysis endpoint for menu images (Gemini Vision)
app.post("/api/analyze/menu", async (req, res) => {
  try {
    const { imageBase64, imageMimeType } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const prompt = `You are analyzing a restaurant menu screenshot from a delivery platform (like Uber Eats, DoorDash, or Grubhub).

Extract all menu items with their prices. For each item, provide:
- Item name
- Listed price
- Any modifiers or add-ons with their prices

IMPORTANT: These prices are what customers see on the delivery platform. They may differ from in-store prices.

Respond in JSON format:
{
  "platform": "detected platform name or 'Unknown'",
  "menuItems": [
    {
      "name": "Item Name",
      "price": 12.99,
      "description": "optional description",
      "modifiers": [
        { "name": "Modifier Name", "price": 1.50 }
      ]
    }
  ],
  "notes": "any observations about pricing patterns or potential issues"
}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageMimeType || "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const text = response.text || "";
    
    // Try to parse as JSON, handle markdown code blocks
    let menuData;
    try {
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      menuData = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text);
    } catch {
      menuData = { raw: text, parseError: true };
    }

    res.json({
      success: true,
      menuData,
      model: "gemini-2.5-flash",
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing menu:", error);
    res.status(500).json({ error: "Failed to analyze menu image", details: error.message });
  }
});

// ============ OCR & Document Extraction Endpoint (Gemini Vision) ============
app.post("/api/analyze/ocr", async (req, res) => {
  try {
    const { imageBase64, imageMimeType, fileName } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required" });
    }

    if (!gemini) {
      return res.status(503).json({ error: "Gemini AI service not available" });
    }

    const prompt = `You are a document OCR and data extraction specialist. Analyze this document image and extract all text and structured data.

Extract the following:
1. All raw text content, preserving formatting where possible
2. Any tables present (as structured data)
3. Key financial figures: amounts, totals, dates, account numbers, transaction IDs
4. Document metadata: type, date, issuer/sender

Respond in JSON format:
{
  "rawText": "full extracted text content",
  "tables": [
    {
      "headers": ["Column1", "Column2"],
      "rows": [["val1", "val2"], ["val3", "val4"]]
    }
  ],
  "extractedData": {
    "amounts": [{ "value": 123.45, "description": "Total amount" }],
    "dates": ["2024-01-15", "2024-01-20"],
    "accountNumbers": ["****1234"],
    "transactionIds": ["TXN-12345"]
  },
  "documentType": "bank_statement | invoice | receipt | payment_report | other",
  "confidence": 0.95
}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageMimeType || "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const text = response.text || "";
    
    let ocrResult;
    try {
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      ocrResult = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text);
    } catch {
      ocrResult = { rawText: text, confidence: 0.5, parseError: true };
    }

    res.json({
      success: true,
      ocrResult,
      fileName,
      model: "gemini-2.5-flash",
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in OCR extraction:", error);
    res.status(500).json({ error: "Failed to extract document content", details: error.message });
  }
});

// ============ Smart Document Categorization Endpoint (GPT) ============
app.post("/api/analyze/categorize", async (req, res) => {
  try {
    const { textContent, fileName } = req.body;
    
    if (!textContent) {
      return res.status(400).json({ error: "Text content is required" });
    }

    if (!openai) {
      return res.status(503).json({ error: "OpenAI service not available" });
    }

    const systemPrompt = `You are a document classification expert. Analyze the provided text and classify the document type.

Classify into one of these categories:
- payment_report: Stripe, PayPal, Square, delivery platform payouts
- bank_statement: Bank transactions, account statements
- invoice: Vendor invoices, bills
- receipt: Purchase receipts, order confirmations
- pricing_list: Menu, product catalog, price list
- refund_record: Refund documentation, chargeback records
- other: Unclassified documents

Provide a confidence score (0-1) and explain your reasoning.

Respond in JSON:
{
  "category": "payment_report",
  "confidence": 0.92,
  "reasoning": "Contains Stripe payout references, transaction IDs, and fee breakdowns",
  "suggestedSection": "payments"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Classify this document:\n\nFilename: ${fileName}\n\nContent:\n${textContent.slice(0, 4000)}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0].message.content);

    res.json({
      success: true,
      classification: result,
      fileName,
      model: "gpt-4o-mini",
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error categorizing document:", error);
    res.status(500).json({ error: "Failed to categorize document", details: error.message });
  }
});

// ============ Document Chat Assistant Endpoint (Streaming) ============
app.post("/api/chat/document", async (req, res) => {
  try {
    const { message, context, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!openai) {
      return res.status(503).json({ error: "OpenAI service not available" });
    }

    const systemPrompt = `You are MARGIX, an AI assistant specialized in helping businesses understand their financial documents and analysis results.

${context ? `
DOCUMENT CONTEXT:
- Files analyzed: ${context.fileNames?.join(', ') || 'None'}
- Categories: ${JSON.stringify(context.categories || {})}
${context.analysisResults ? `
- Analysis Results:
  - Total leaks found: ${context.analysisResults.totalLeaks}
  - Total recoverable: $${context.analysisResults.totalRecoverable}
  - Summary: ${context.analysisResults.summary}
` : ''}
` : 'No document context available yet.'}

Guidelines:
1. Be helpful and specific about the documents analyzed
2. Reference actual findings when available
3. Provide actionable recommendations
4. If asked about data not in context, say so clearly
5. Keep responses concise but informative`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: message }
    ];

    // Set up streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Error in document chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process chat message", details: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

// ============ Enhanced Multi-Model Leak Detection Endpoint ============
app.post("/api/analyze/leaks", async (req, res) => {
  try {
    const { fileContent, fileNames, categories, ocrResults } = req.body;
    
    if (!fileContent) {
      return res.status(400).json({ error: "File content is required" });
    }

    if (!openai || !gemini) {
      return res.status(503).json({ error: "AI services not fully available" });
    }

    // STEP 1: Gemini Pattern Detection
    const geminiPrompt = `You are a financial pattern detection AI. Analyze these documents for patterns that might indicate revenue leaks:

1. Recurring charges on specific dates
2. Duplicate amounts across transactions
3. Unusual fee patterns
4. Subscription patterns
5. Refund patterns

Documents analyzed: ${fileNames.join(', ')}

Content:
${fileContent}

Respond in JSON:
{
  "patterns": [
    { "type": "duplicate_pattern", "description": "Found $49.99 charges on the 3rd of each month", "confidence": 0.9, "amounts": [49.99] },
    { "type": "fee_pattern", "description": "Processing fees averaging 3.2%, higher than industry standard", "confidence": 0.85 }
  ],
  "anomalies": [
    { "description": "Unusual spike in refunds on March 15", "severity": "medium" }
  ],
  "summary": "Brief pattern summary"
}`;

    const geminiResponse = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: geminiPrompt }] }],
    });

    let geminiFindings;
    try {
      const geminiText = geminiResponse.text || "";
      const jsonMatch = geminiText.match(/```json\n?([\s\S]*?)\n?```/) || geminiText.match(/\{[\s\S]*\}/);
      geminiFindings = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : geminiText);
    } catch {
      geminiFindings = { patterns: [], anomalies: [], summary: "Unable to parse Gemini response" };
    }

    // STEP 2: GPT Deep Reasoning Analysis
    const gptSystemPrompt = `You are an expert financial analyst specializing in detecting revenue leaks. You have received pattern analysis from a first-pass AI. Now provide deep reasoning and actionable recommendations.

Pattern Analysis Results:
${JSON.stringify(geminiFindings, null, 2)}

Your task:
1. Validate and enhance the pattern findings with deeper reasoning
2. Identify additional leaks that pattern matching might miss
3. Provide specific, actionable recommendations
4. Calculate potential recovery amounts
5. Cross-validate findings for accuracy

Look for these leak types:
- MISSING PAYMENTS - Expected income that never arrived
- DUPLICATE CHARGES - Being charged twice for same service
- UNUSED SUBSCRIPTIONS - Paying for unused services
- FAILED PAYMENTS - Transactions that failed but weren't retried
- PRICING INEFFICIENCIES - Overcharges vs market rates
- BILLING ERRORS - Incorrect amounts, math errors

Respond in JSON:
{
  "totalLeaks": number,
  "totalRecoverable": number,
  "leaks": [
    {
      "id": "leak-1",
      "type": "duplicate_charge",
      "description": "Clear description",
      "amount": 49.99,
      "date": "2024-01-15",
      "severity": "high",
      "recommendation": "Specific action to take",
      "confidence": 0.92,
      "crossValidated": true,
      "modelSource": "both"
    }
  ],
  "summary": "Executive summary",
  "confidence": {
    "overallScore": 0.92,
    "crossValidated": 4,
    "needsReview": 1
  },
  "modelContributions": {
    "gemini": ["Pattern findings"],
    "gpt": ["Deep reasoning findings"]
  }
}`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: gptSystemPrompt },
        { role: "user", content: `Analyze these financial documents:\n\nFiles: ${fileNames.join(', ')}\n\n${fileContent}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const analysis = JSON.parse(gptResponse.choices[0].message.content);
    analysis.analyzedAt = new Date().toISOString();
    analysis.multiModelAnalysis = true;
    
    res.json({
      success: true,
      analysis,
      models: ["gemini-2.5-flash", "gpt-4o-mini"],
      geminiFindings: geminiFindings,
    });
  } catch (error) {
    console.error("Error analyzing for leaks:", error);
    res.status(500).json({ error: "Failed to analyze documents", details: error.message });
  }
});

// Combined analysis endpoint - compares report data with menu prices
app.post("/api/analyze/compare", async (req, res) => {
  try {
    const { reportAnalysis, menuData } = req.body;
    
    if (!reportAnalysis || !menuData) {
      return res.status(400).json({ error: "Both report analysis and menu data are required" });
    }

    const systemPrompt = `You are a restaurant profit analyst. Compare delivery report data with menu prices to identify discrepancies.

Look for:
1. Items in reports that don't match menu prices (price errors)
2. Missing items that should have been charged
3. Overcharges to customers
4. Undercharges that hurt restaurant profit

Provide actionable insights for recovering lost revenue.

Respond in JSON format:
{
  "discrepancies": [
    {
      "itemName": string,
      "menuPrice": number,
      "chargedPrice": number,
      "difference": number,
      "type": "undercharge" | "overcharge" | "missing",
      "estimatedLoss": number,
      "isEstimate": true
    }
  ],
  "totalEstimatedRecovery": number,
  "priorityActions": [string],
  "summary": string
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Compare this report analysis:\n${JSON.stringify(reportAnalysis)}\n\nWith this menu data:\n${JSON.stringify(menuData)}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const comparison = JSON.parse(response.choices[0].message.content);
    
    res.json({
      success: true,
      comparison,
      model: "gpt-4o-mini",
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error comparing data:", error);
    res.status(500).json({ error: "Failed to compare data", details: error.message });
  }
});


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    } else {
      next();
    }
  });
}

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 5000) : 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
