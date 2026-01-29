

# Migration Plan: Replit AI Integrations to Lovable AI Gateway

## Overview

This plan migrates your AI backend from Replit's AI Integrations (GPT-4o-mini + Gemini 2.5 Flash) to Lovable AI Gateway with access to newer models (GPT-5, Gemini 3).

## Current State

Your app has 6 AI-powered endpoints running on an Express server (`server/index.js`):

| Endpoint | Current Model | Purpose |
|----------|---------------|---------|
| `/api/analyze/report` | GPT-4o-mini | Delivery report analysis |
| `/api/analyze/menu` | Gemini 2.5 Flash | Menu image OCR |
| `/api/analyze/ocr` | Gemini 2.5 Flash | Document text extraction |
| `/api/analyze/categorize` | GPT-4o-mini | Document classification |
| `/api/chat/document` | GPT-4o-mini | Streaming chat assistant |
| `/api/analyze/leaks` | Both (cross-validation) | Multi-model leak detection |
| `/api/analyze/compare` | GPT-4o-mini | Price comparison |

## Target Architecture

Move all AI logic to Supabase Edge Functions calling the Lovable AI Gateway:

```text
Frontend (React)
    |
    v
Supabase Edge Functions
    |
    v
Lovable AI Gateway (https://ai.gateway.lovable.dev)
    |
    +--> google/gemini-3-flash-preview (OCR, patterns)
    +--> openai/gpt-5-mini (reasoning, chat)
```

## Migration Steps

### Phase 1: Enable Lovable Cloud + Lovable AI

1. Enable Lovable Cloud (Supabase backend)
2. Enable Lovable AI integration to provision `LOVABLE_API_KEY`

### Phase 2: Create Edge Functions (6 total)

Each current Express endpoint becomes a Supabase Edge Function:

| Function Name | Model | Replaces |
|---------------|-------|----------|
| `analyze-report` | `openai/gpt-5-mini` | `/api/analyze/report` |
| `analyze-menu` | `google/gemini-3-flash-preview` | `/api/analyze/menu` |
| `analyze-ocr` | `google/gemini-3-flash-preview` | `/api/analyze/ocr` |
| `analyze-categorize` | `openai/gpt-5-mini` | `/api/analyze/categorize` |
| `chat-document` | `openai/gpt-5-mini` | `/api/chat/document` (streaming) |
| `analyze-leaks` | Both models | `/api/analyze/leaks` |

### Phase 3: Update Frontend Calls

Update 4 files to call Edge Functions instead of Express server:
- `src/hooks/useDocumentChat.ts` - Chat streaming
- `src/context/AnalysisContext.tsx` - Analysis endpoints
- `src/pages/Uploads.tsx` - OCR/categorization
- `src/components/AIChatWidget.tsx` - Chat interface

### Phase 4: Remove Express AI Code

Clean up `server/index.js`:
- Remove OpenAI and Gemini client initialization
- Remove all `/api/analyze/*` and `/api/chat/*` endpoints
- Keep object storage and other non-AI endpoints

## Model Upgrades

| Old Model | New Model | Improvement |
|-----------|-----------|-------------|
| GPT-4o-mini | openai/gpt-5-mini | Better reasoning, longer context |
| Gemini 2.5 Flash | google/gemini-3-flash-preview | Faster, improved accuracy |

For cross-validation (leak detection), we'll use:
- `google/gemini-3-flash-preview` for pattern detection (first pass)
- `openai/gpt-5-mini` for deep reasoning (validation pass)

## Files to Create

```text
supabase/
  config.toml
  functions/
    analyze-report/index.ts
    analyze-menu/index.ts
    analyze-ocr/index.ts
    analyze-categorize/index.ts
    chat-document/index.ts
    analyze-leaks/index.ts
```

## Files to Modify

- `src/hooks/useDocumentChat.ts` - Update to call Edge Function
- `src/context/AnalysisContext.tsx` - Update all fetch URLs
- `src/pages/Uploads.tsx` - Update analysis calls
- `server/index.js` - Remove AI endpoints

## Benefits

1. **Newer models**: Access to GPT-5 and Gemini 3 series
2. **Unified billing**: All AI usage through Lovable credits
3. **Better rate limits**: Lovable Gateway handles limits gracefully
4. **No API keys to manage**: `LOVABLE_API_KEY` is auto-provisioned
5. **Edge performance**: Functions run closer to users

---

## Technical Details

### Edge Function Template

Each function will follow this pattern:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  // ... function logic
});
```

### Frontend Call Pattern

```typescript
const { data, error } = await supabase.functions.invoke('analyze-ocr', {
  body: { imageBase64, imageMimeType, fileName }
});
```

### Streaming Pattern (for chat)

The chat function will return SSE stream directly, with frontend parsing tokens line-by-line.

### Error Handling

All functions will handle:
- 429 (Rate limited) - Display "Please try again in a moment"
- 402 (Credits exhausted) - Display "Please add credits to continue"

