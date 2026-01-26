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
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Initialize Gemini client (via Replit AI Integrations - no API key needed)
const gemini = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

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

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get("/api/metrics", async (req, res) => {
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

// Serve static assets from 'dist' in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // In development, handle fallback for SPA if not handled by Vite
  // Note: Vite usually handles this, but if index.js is the entry point, we need it.
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: "API not found" });
    res.status(404).send("Cannot GET " + req.path + ". If you're in development, ensure Vite is running and proxying requests.");
  });
}

// Serve static assets from 'dist' in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // In development, handle fallback for SPA if not handled by Vite
  // Note: Vite usually handles this, but if index.js is the entry point, we need it.
  app.get('/*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: "API not found" });
    res.status(404).send("Cannot GET " + req.path + ". If you're in development, ensure Vite is running and proxying requests.");
  });
}

app.listen(3001, '0.0.0.0', () => console.log("Backend running on port 3001"));
