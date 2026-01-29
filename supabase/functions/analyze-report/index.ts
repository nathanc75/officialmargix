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
    const { reportContent, reportType } = await req.json();

    if (!reportContent) {
      return new Response(
        JSON.stringify({ error: "Report content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this ${reportType || 'delivery'} report:\n\n${reportContent}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
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
    const analysis = JSON.parse(aiResponse.choices[0].message.content);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        model: "gpt-5-mini",
        analyzedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing report:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze report", details: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
