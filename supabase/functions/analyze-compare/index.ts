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
    const { reportAnalysis, menuData } = await req.json();

    if (!reportAnalysis || !menuData) {
      return new Response(
        JSON.stringify({ error: "Both report analysis and menu data are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
          { role: "user", content: `Compare this report analysis:\n${JSON.stringify(reportAnalysis)}\n\nWith this menu data:\n${JSON.stringify(menuData)}` }
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
    const comparison = JSON.parse(aiResponse.choices[0].message.content);

    return new Response(
      JSON.stringify({
        success: true,
        comparison,
        model: "gpt-5-mini",
        analyzedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error comparing data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to compare data", details: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
