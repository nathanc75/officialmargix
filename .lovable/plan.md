# Migration Plan: Replit AI Integrations to Lovable AI Gateway

## Status: ✅ COMPLETED

## Overview

This plan migrated the AI backend from Replit's AI Integrations (GPT-4o-mini + Gemini 2.5 Flash) to Lovable AI Gateway with access to newer models (GPT-5, Gemini 3).

## Completed Steps

### ✅ Phase 1: Enable Lovable Cloud + Lovable AI
- [x] Enabled Lovable Cloud (Supabase backend)
- [x] Enabled Lovable AI integration (LOVABLE_API_KEY auto-provisioned)

### ✅ Phase 2: Created 7 Edge Functions
| Function Name | Model | Purpose |
|---------------|-------|---------|
| `analyze-report` | `openai/gpt-5-mini` | Delivery report analysis |
| `analyze-menu` | `google/gemini-3-flash-preview` | Menu image OCR |
| `analyze-ocr` | `google/gemini-3-flash-preview` | Document text extraction |
| `analyze-categorize` | `openai/gpt-5-mini` | Document classification |
| `chat-document` | `openai/gpt-5-mini` | Streaming chat assistant |
| `analyze-leaks` | Both models | Multi-model leak detection |
| `analyze-compare` | `openai/gpt-5-mini` | Price comparison |

### ✅ Phase 3: Updated Frontend Calls
- [x] `src/hooks/useDocumentChat.ts` - Updated to use Edge Function with proper SSE streaming
- [x] `src/context/AnalysisContext.tsx` - Updated all analysis endpoints to use Supabase invoke
- [x] `src/pages/Uploads.tsx` - Updated OCR, categorization, and leak analysis calls
- [x] `src/components/AIChatWidget.tsx` - No changes needed (uses useDocumentChat hook)

### ✅ Phase 4: Cleaned Up Express Server
- [x] Removed OpenAI and Gemini client initialization
- [x] Removed all `/api/analyze/*` endpoints
- [x] Removed `/api/chat/*` endpoint
- [x] Kept object storage and other non-AI endpoints

## Model Upgrades Applied

| Old Model | New Model | Improvement |
|-----------|-----------|-------------|
| GPT-4o-mini | openai/gpt-5-mini | Better reasoning, longer context |
| Gemini 2.5 Flash | google/gemini-3-flash-preview | Faster, improved accuracy |

## Architecture

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

## Benefits Achieved

1. **Newer models**: Now using GPT-5 and Gemini 3 series
2. **Unified billing**: All AI usage through Lovable credits
3. **Better rate limits**: Gateway handles limits gracefully with proper error messages
4. **No API keys to manage**: LOVABLE_API_KEY is auto-provisioned
5. **Edge performance**: Functions run on edge for lower latency
