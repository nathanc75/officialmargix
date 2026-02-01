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
    const geminiPrompt = `You are a financial document analyzer. Analyze these documents and classify them into two categories:

=== CATEGORY 1: LEAKS (money the business is LOSING) ===
Look for patterns that represent money LOST or LEAKED:
1. Duplicate charges (same amount charged twice from a vendor)
2. Unusual fee patterns (fees higher than expected)
3. Missing customer payments (customers who haven't paid YOU - the business)
4. Refund patterns where you still paid processing fees
5. Subscriptions the business pays for but doesn't use

=== CATEGORY 2: EXPENSES (bills the business OWES) ===
Look for documents showing money the business needs to PAY:
1. Subscription payments that are overdue or past due
2. Vendor invoices the business hasn't paid yet
3. Utility bills (electric, water, internet, phone) that are due or past due
4. Rent or lease payments that are overdue
5. Any service bills showing "past due", "payment required", "overdue notice"

KEY DISTINCTION:
- LEAKS = Money you're LOSING (revenue issues, duplicate charges, unused services)
- EXPENSES = Money you OWE (bills to pay, even if overdue - these are obligations, not leaks)

Documents analyzed: ${fileNames.join(', ')}

Content:
${fileContent}

Respond in JSON:
{
  "leakPatterns": [
    { "type": "duplicate_pattern", "description": "Found $49.99 charges twice on same day", "confidence": 0.9, "amounts": [49.99] }
  ],
  "expensePatterns": [
    { "type": "subscription", "vendor": "QuickBooks", "description": "Subscription payment is past due", "amount": 149.99, "dueDate": "2024-01-15", "daysOverdue": 17, "confidence": 0.95 }
  ],
  "summary": "Brief classification summary"
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

    let geminiFindings = { leakPatterns: [], expensePatterns: [], summary: "Pattern analysis unavailable" };
    
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
    const gptSystemPrompt = `You are a helpful assistant talking to a business owner — not a technical system. Your job is to analyze financial documents and separate them into two categories:

Pattern Analysis Results from Gemini:
${JSON.stringify(geminiFindings, null, 2)}

=== TWO SEPARATE CATEGORIES ===

CATEGORY 1: LEAKS (put in "leaks" array)
These are problems where the business is LOSING money:
- Missing customer payments (customers who owe YOU money and haven't paid)
- Duplicate charges (you got billed twice for the same thing)
- Unused subscriptions (services YOU PAY FOR but aren't using)
- Failed payments TO YOU
- Billing errors that cost you money
- Refund fees you're still paying after issuing refunds

CATEGORY 2: EXPENSES (put in "expenses" array)
These are bills the BUSINESS OWES — NOT leaks:
- Subscription payments that are overdue (your QuickBooks is past due = expense, not leak)
- Vendor invoices you need to pay
- Utility bills (electric, water, internet)
- Rent or lease payments due
- Any "past due" notice for a service YOU subscribe to

=== SEVERITY RULES FOR EXPENSES ===
Based on AMOUNT (not age):
- high: $500 or more
- medium: $100 to $499
- low: Under $100

=== EXPENSE TYPES ===
- subscription: Monthly/yearly software, SaaS tools
- vendor_bill: Invoices from suppliers
- utility: Electric, water, internet, phone
- rent: Office or equipment rental
- other: Everything else

=== HOW TO EXPLAIN EVERY ISSUE ===
1. **Start with what happened** — State it simply, like you're telling a friend.
2. **Explain what it means** — Is it missing? At risk? What's the situation?
3. **End with clear next steps** — What can they do right now?

TONE RULES:
- Calm and supportive — never alarming or robotic
- Human and conversational

Respond in JSON:
{
  "totalLeaks": number,
  "totalRecoverable": number,
  "totalAmountDue": number,
  "leaks": [
    {
      "id": "leak-1",
      "type": "duplicate_charge",
      "description": "Clear, friendly description of the leak",
      "amount": 49.99,
      "date": "2024-01-15",
      "severity": "high",
      "recommendation": "What to do about it",
      "confidence": 0.92,
      "crossValidated": true,
      "modelSource": "both"
    }
  ],
  "expenses": [
    {
      "id": "exp-1",
      "type": "subscription",
      "description": "Your QuickBooks subscription payment is past due. The $149.99 monthly fee was due on January 15th.",
      "amount": 149.99,
      "dueDate": "2024-01-15",
      "daysOverdue": 17,
      "severity": "medium",
      "recommendation": "Log into QuickBooks and update your payment method to avoid service interruption.",
      "vendor": "QuickBooks"
    }
  ],
  "summary": "Summary covering both leaks found and expenses due.",
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
    
    // Ensure expenses array and totalAmountDue exist
    if (!analysis.expenses) {
      analysis.expenses = [];
    }
    if (typeof analysis.totalAmountDue !== 'number') {
      analysis.totalAmountDue = analysis.expenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
    }
    
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
