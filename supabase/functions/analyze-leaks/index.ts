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
    const { fileContent, fileNames, categories, ocrResults } = await req.json();

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: "File content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // STEP 1: Gemini Pattern Detection (using gemini-3-flash-preview)
    const geminiPrompt = `You are a financial pattern detection AI. Analyze these documents for patterns that might indicate revenue leaks.

CRITICAL - MONEY FLOW DIRECTION:
First, determine the direction of money flow for each item:
- INFLOW (revenue): Money coming INTO the business from customers, clients, or sales
- OUTFLOW (expense): Money going OUT to vendors, suppliers, platforms, subscriptions

IMPORTANT: Only look for patterns that represent money LOST or LEAKED from the business.
Do NOT flag the business's own unpaid bills or past-due notices — those are obligations the business owes, not leaks.
Past-due subscription notices for services the business uses are NOT leaks — they are accounts payable.

Look for these LEAK patterns only:
1. Duplicate charges (same amount charged twice from a vendor)
2. Unusual fee patterns (fees higher than expected)
3. Missing customer payments (customers who haven't paid YOU)
4. Refund patterns where you still paid processing fees
5. Subscriptions the business pays for but doesn't use

DO NOT flag as patterns:
- Normal recurring expenses the business pays
- Past-due notices for services the business subscribes to
- Vendor invoices the business needs to pay

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
  "notLeaks": [
    { "description": "Past-due subscription to vendor X - normal accounts payable", "reason": "business_expense" }
  ],
  "summary": "Brief pattern summary"
}`;

    const geminiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: geminiPrompt }],
      }),
    });

    if (!geminiResponse.ok) {
      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (geminiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Gemini error:", geminiResponse.status);
    }

    let geminiFindings = { patterns: [], anomalies: [], summary: "Pattern analysis unavailable" };
    
    if (geminiResponse.ok) {
      try {
        const geminiData = await geminiResponse.json();
        const geminiText = geminiData.choices[0].message.content || "";
        const jsonMatch = geminiText.match(/```json\n?([\s\S]*?)\n?```/) || geminiText.match(/\{[\s\S]*\}/);
        geminiFindings = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : geminiText);
      } catch {
        console.error("Failed to parse Gemini response");
      }
    }

    // STEP 2: GPT Deep Reasoning Analysis (using gpt-5-mini)
    const gptSystemPrompt = `You are a helpful assistant talking to a business owner — not a technical system. Your job is to explain financial issues in clear, everyday language. Avoid jargon, engineering terms, and accounting phrases.

Pattern Analysis Results:
${JSON.stringify(geminiFindings, null, 2)}

=== CRITICAL FIRST STEP - MONEY FLOW DIRECTION ===
Before classifying ANY item, FIRST determine the money flow direction:

- INFLOW (revenue): Money coming INTO the business from customers, clients, or sales
- OUTFLOW (expense): Money going OUT to vendors, suppliers, platforms, subscriptions

This distinction is ESSENTIAL for correct classification.

=== WHAT IS NOT A LEAK (SKIP THESE) ===
The following are NORMAL BUSINESS OPERATIONS — do NOT create leak entries for them:

1. Business's own unpaid bills to vendors (that's accounts payable)
2. Past-due notices for subscriptions the business uses (that's your obligation)
3. Invoices from suppliers the business needs to pay
4. Normal recurring business expenses
5. Monthly software subscriptions the business actively uses

If the ONLY documents uploaded are the business's own expenses/bills, return:
- totalLeaks: 0
- totalRecoverable: 0
- leaks: []
- summary: "No revenue leaks detected. The documents show normal business expenses."

=== EXAMPLES TO GUIDE YOUR CLASSIFICATION ===

✓ THIS IS A LEAK:
- Customer invoice from 60 days ago still unpaid → Missing Payment (they owe YOU money)
- Same $50 charge from Stripe appeared twice on same day → Duplicate Charge (you got billed twice)
- You're paying $99/month for software nobody has logged into in 6 months → Unused Subscription

✗ THIS IS NOT A LEAK:
- Your Quickbooks subscription is past due → Normal expense (YOU owe THEM money) - SKIP IT
- Monthly $50 software subscription bill → Normal recurring expense - SKIP IT
- Vendor invoice saying "payment overdue" → Accounts payable, not a leak - SKIP IT

=== LEAK TYPES (ONLY FLAG THESE) ===

- MISSING PAYMENTS (INFLOW issue) - Money owed TO YOU by customers that never arrived
  ✓ Include: Customer invoices unpaid, expected deposits missing, refunds owed to you by platforms
  ✗ Exclude: YOUR unpaid bills to vendors, YOUR past-due subscriptions, YOUR accounts payable

- DUPLICATE CHARGES (OUTFLOW issue) - You got billed twice for the same thing
  ✓ Include: Same vendor charge appearing twice, double processing fees
  ✗ Exclude: Legitimate recurring monthly charges

- UNUSED SUBSCRIPTIONS (OUTFLOW issue) - Services YOU PAY FOR but aren't using
  ✓ Include: Software you're paying for monthly but haven't logged into
  ✗ Exclude: Active subscriptions you use, subscriptions customers owe you for

- FAILED PAYMENTS (INFLOW issue) - Payments TO YOU that failed and weren't retried
  ✓ Include: Customer card declined, ACH returns
  ✗ Exclude: Your failed payments to vendors

- PRICING INEFFICIENCIES (OUTFLOW issue) - You're being charged more than market rate
- BILLING ERRORS - Mistakes in invoices or calculations (either direction)
- REFUND FEE LOSS (OUTFLOW issue) - You refunded a customer but still paid the processing fee
- CHURN PERMANENT LOSS (INFLOW loss) - Customers who cancelled their subscriptions with you

=== HOW TO EXPLAIN EVERY ISSUE ===

1. **Start with what happened** — State it simply, like you're telling a friend.
2. **Explain what it means for the money** — Is it missing? At risk? Just costing more than it should?
3. **Give the most common reason** — Keep it short and relatable.
4. **End with clear next steps** — What can they do right now?

TONE RULES:
- Calm and supportive — never alarming or robotic
- Human and conversational — like talking to a neighbor
- No blame — focus on solutions, not mistakes

BANNED WORDS (never use these in main descriptions):
reconciliation, sync failure, webhook, revenue recognition, discrepancy, mapping issue, variance, settlement, ledger, POS integration, API, data mismatch, transaction log

Respond in JSON:
{
  "totalLeaks": number,
  "totalRecoverable": number,
  "leaks": [
    {
      "id": "leak-1",
      "type": "duplicate_charge",
      "description": "You got charged twice for the same thing. On January 15th, your account was billed $49.99 for 'Software Subscription', and the exact same charge appeared again the next day. This usually happens when a payment system glitches or retries by mistake. Check your statement and request a refund for the duplicate — most providers will process this quickly.",
      "amount": 49.99,
      "date": "2024-01-15",
      "severity": "high",
      "recommendation": "Log into your payment provider, find the duplicate charge, and request a refund or dispute it.",
      "confidence": 0.92,
      "crossValidated": true,
      "modelSource": "both"
    }
  ],
  "summary": "We found a few things that might be costing you money. Here's what we spotted and what you can do about each one.",
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

    const gptResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: gptSystemPrompt },
          { role: "user", content: `Analyze these financial documents:\n\nFiles: ${fileNames.join(', ')}\n\n${fileContent}` }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!gptResponse.ok) {
      if (gptResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (gptResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await gptResponse.text();
      console.error("GPT error:", gptResponse.status, errorText);
      throw new Error("GPT analysis failed");
    }

    const gptData = await gptResponse.json();
    const analysis = JSON.parse(gptData.choices[0].message.content);
    analysis.analyzedAt = new Date().toISOString();
    analysis.multiModelAnalysis = true;

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        models: ["gemini-3-flash-preview", "gpt-5-mini"],
        geminiFindings,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing for leaks:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze documents", details: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
