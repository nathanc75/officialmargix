import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are MARGIX Universal Business Data Extractor. Your job is to convert any user-uploaded business file content into structured JSON data.

## FILE CLASSIFICATION
Classify into one of:
- pos_item_level: POS export with individual item rows
- pos_summary: POS summary with totals only
- delivery_statement: DoorDash, Uber Eats, Grubhub etc. payout statements
- bank_statement: Bank transactions
- expense_ledger: Expense tracking spreadsheet
- invoice_receipt_export: Invoices or receipts
- custom_spreadsheet: Owner-made spreadsheet
- menu_image_text: Menu with prices (reference only)
- unknown: Cannot classify

Determine grain:
- item_level: Has individual item rows
- summary_only: Only period totals
- transaction_level: Bank-like line items

## SYNONYM RECOGNITION (DO NOT REQUIRE EXACT WORDS)

SALES TOTALS:
- gross_sales: total sales, sales, revenue, gross, subtotal, merchandise total, order total
- net_sales: net sales, sales net, net revenue
- order_count: orders, tickets, transactions count

PAYOUTS/DEPOSITS:
- net_payout: payout, deposit, net, settlement, transfer, amount paid, remittance, paid out

FEES:
- fees_total: fee, fees, commission, service fee, platform fee, marketplace fee, processing fee, credit card fee, merchant fee

PROMOS/DISCOUNTS/REFUNDS:
- discounts_total/promotions_total: discount, promo, promotion, coupon, marketing, markdown, credit
- refunds_total: refund, refunded, adjustment, dispute, chargeback, error correction

TAX/TIPS:
- taxes_collected: tax, sales tax, VAT, GST
- tips_collected: tips, gratuity

ITEM-LEVEL:
- item_name: item, product, menu item, description
- quantity: qty, quantity, count, units
- price/sales: price, amount, line total, sales, extended price

EXPENSE-LEVEL:
- vendor/payee: payee, vendor, merchant, supplier
- description: memo, note, details
- amount: amount, debit, credit (detect sign)

## EXTRACTION RULES
1. Prefer deterministic mapping from headers before inference
2. Use sample rows to infer meaning if headers are vague
3. Separate money flows: revenue/sales, fees/commissions, refunds/adjustments, expenses
4. Never guess required fields - set needs_user_mapping=true if ambiguous
5. Extract both item-level and summary totals if both exist
6. For menu images, treat as item_name + list_price reference only

## VALIDATION
- Ensure monetary values are numeric
- Ensure dates are valid
- If gross_sales, net_payout, fees_total exist, check: gross_sales - fees_total - promotions_total - refunds_total ≈ net_payout
- Never force math to pass by changing values, only flag

## EXPENSE CATEGORIES
Normalize to: cogs | labor | occupancy | marketing | utilities | supplies | software | shipping | taxes_fees | payment_processing | platform_fees | other

## OUTPUT REQUIREMENTS
Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "file_kind": "string",
  "classification_confidence": 0.0,
  "grain": "item_level|summary_only|transaction_level",
  "period": {"start": null, "end": null},
  "needs_user_mapping": false,
  "mapping_suggestions": {},
  "sales_summary": {
    "gross_sales": null,
    "net_sales": null,
    "taxes_collected": null,
    "tips_collected": null,
    "discounts_total": null,
    "promotions_total": null,
    "refunds_total": null,
    "chargebacks_total": null,
    "fees_total": null,
    "net_payout": null,
    "order_count": null
  },
  "items": [],
  "expenses": [],
  "confidence": {
    "sales_summary": {},
    "items": {},
    "expenses": {}
  },
  "validation": {
    "math_check_passed": null,
    "notes": ""
  },
  "notes_for_user": ""
}

CRITICAL:
- Output JSON ONLY
- Do not fabricate values
- If data not present, keep null/empty
- If ambiguous, set needs_user_mapping=true with mapping_suggestions`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { textContent, fileName, fileType } = await req.json();

    if (!textContent) {
      return new Response(
        JSON.stringify({ error: "Text content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing file: ${fileName}, type: ${fileType}`);
    console.log(`Content length: ${textContent.length} chars`);

    // Truncate content if too long (keep first 15000 chars for context)
    const truncatedContent = textContent.length > 15000 
      ? textContent.slice(0, 15000) + "\n...[content truncated]..."
      : textContent;

    const userPrompt = `Analyze and extract structured data from this business document.

Filename: ${fileName}
File type: ${fileType || "unknown"}

Document content:
${truncatedContent}

Extract all available data following the canonical model. Return ONLY valid JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
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
    const rawContent = aiResponse.choices[0].message.content || "";
    
    console.log("Raw AI response length:", rawContent.length);

    // Parse JSON from response (handle potential markdown wrapping)
    let extractedData;
    try {
      // Try to find JSON in the response
      const jsonMatch = rawContent.match(/```json\n?([\s\S]*?)\n?```/) || rawContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawContent;
      extractedData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Return a fallback structure
      extractedData = {
        file_kind: "unknown",
        classification_confidence: 0.3,
        grain: "summary_only",
        period: { start: null, end: null },
        needs_user_mapping: true,
        mapping_suggestions: {},
        sales_summary: {
          gross_sales: null,
          net_sales: null,
          taxes_collected: null,
          tips_collected: null,
          discounts_total: null,
          promotions_total: null,
          refunds_total: null,
          chargebacks_total: null,
          fees_total: null,
          net_payout: null,
          order_count: null
        },
        items: [],
        expenses: [],
        confidence: { sales_summary: {}, items: {}, expenses: {} },
        validation: { math_check_passed: null, notes: "Failed to parse extraction response" },
        notes_for_user: "The document format was not recognized. Please verify the file content."
      };
    }

    // Validate and ensure required structure
    const validatedData = {
      file_kind: extractedData.file_kind || "unknown",
      classification_confidence: extractedData.classification_confidence || 0,
      grain: extractedData.grain || "summary_only",
      period: extractedData.period || { start: null, end: null },
      needs_user_mapping: extractedData.needs_user_mapping ?? false,
      mapping_suggestions: extractedData.mapping_suggestions || {},
      sales_summary: {
        gross_sales: extractedData.sales_summary?.gross_sales ?? null,
        net_sales: extractedData.sales_summary?.net_sales ?? null,
        taxes_collected: extractedData.sales_summary?.taxes_collected ?? null,
        tips_collected: extractedData.sales_summary?.tips_collected ?? null,
        discounts_total: extractedData.sales_summary?.discounts_total ?? null,
        promotions_total: extractedData.sales_summary?.promotions_total ?? null,
        refunds_total: extractedData.sales_summary?.refunds_total ?? null,
        chargebacks_total: extractedData.sales_summary?.chargebacks_total ?? null,
        fees_total: extractedData.sales_summary?.fees_total ?? null,
        net_payout: extractedData.sales_summary?.net_payout ?? null,
        order_count: extractedData.sales_summary?.order_count ?? null,
      },
      items: Array.isArray(extractedData.items) ? extractedData.items : [],
      expenses: Array.isArray(extractedData.expenses) ? extractedData.expenses : [],
      confidence: extractedData.confidence || { sales_summary: {}, items: {}, expenses: {} },
      validation: extractedData.validation || { math_check_passed: null, notes: "" },
      notes_for_user: extractedData.notes_for_user || "",
    };

    console.log(`Extraction complete: ${validatedData.file_kind}, confidence: ${validatedData.classification_confidence}`);
    console.log(`Items extracted: ${validatedData.items.length}, Expenses: ${validatedData.expenses.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        extraction: validatedData,
        fileName,
        model: "gemini-3-flash-preview",
        processedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in universal extraction:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to extract document data", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
