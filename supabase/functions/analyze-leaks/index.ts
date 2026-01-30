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
