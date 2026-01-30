import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, imageMimeType, fileName, textContent } = await req.json();

    if (!imageBase64 && !textContent) {
      return new Response(
        JSON.stringify({ error: "Image data or text content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Detect Office documents that can't be processed as images
    const isExcelFile = imageMimeType?.includes("spreadsheet") || 
                        imageMimeType?.includes("excel") ||
                        fileName?.toLowerCase().endsWith(".xls") ||
                        fileName?.toLowerCase().endsWith(".xlsx") ||
                        fileName?.toLowerCase().endsWith(".csv");
    
    const isWordFile = imageMimeType?.includes("word") ||
                       fileName?.toLowerCase().endsWith(".doc") ||
                       fileName?.toLowerCase().endsWith(".docx");

    // For Excel/CSV files, we need text content instead of image
    if (isExcelFile && !textContent) {
      return new Response(
        JSON.stringify({ 
          error: "Excel and CSV files should be read as text. Please use the text content extraction method.",
          requiresTextExtraction: true,
          fileType: "spreadsheet"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For Word files without text content
    if (isWordFile && !textContent) {
      return new Response(
        JSON.stringify({ 
          error: "Word documents should be read as text. Please use the text content extraction method.",
          requiresTextExtraction: true,
          fileType: "document"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isOfficeDoc = isExcelFile || isWordFile;

    // If we have text content (for spreadsheets/documents), analyze it directly
    if (textContent) {
      const textPrompt = `You are a document data extraction specialist. Analyze this ${isExcelFile ? 'spreadsheet' : 'document'} content and extract all structured data.

Extract the following:
1. All text content, preserving structure
2. Any tables present (as structured data with headers and rows)
3. Key financial figures: amounts, totals, dates, account numbers, transaction IDs
4. Document metadata: type, any visible headers

Content:
${textContent}

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
  "documentType": "spreadsheet | document | invoice | receipt | pricing_list | financial_report | other",
  "confidence": 0.95
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5-mini",
          messages: [{ role: "user", content: textPrompt }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error("AI gateway error");
      }

      const aiResponse = await response.json();
      const text = aiResponse.choices[0].message.content || "";

      let ocrResult;
      try {
        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
        ocrResult = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text);
      } catch {
        ocrResult = { rawText: text, confidence: 0.5, parseError: true };
      }

      return new Response(
        JSON.stringify({
          success: true,
          ocrResult,
          fileName,
          model: "gpt-5-mini",
          processedAt: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For images, use vision model
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageMimeType || "image/jpeg"};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const text = aiResponse.choices[0].message.content || "";

    let ocrResult;
    try {
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      ocrResult = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text);
    } catch {
      ocrResult = { rawText: text, confidence: 0.5, parseError: true };
    }

    return new Response(
      JSON.stringify({
        success: true,
        ocrResult,
        fileName,
        model: "gemini-3-flash-preview",
        processedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in OCR extraction:", error);
    return new Response(
      JSON.stringify({ error: "Failed to extract document content", details: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
