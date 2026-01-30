
# Plan: Humanize Leak Analysis Language

## Overview
This plan updates the AI prompts and UI components to use plain, empathetic language that any business owner can understand. We'll remove technical jargon and restructure responses to answer the questions users actually have: What happened? Is money missing? Why did this happen? What do I do now?

## Changes Required

### 1. Update the AI Analysis Prompt (Edge Function)

**File:** `supabase/functions/analyze-leaks/index.ts`

The GPT system prompt will be completely rewritten to enforce the language rules:

**Current problems:**
- Uses terms like "revenue leaks", "reconciliation", "cross-validate"
- Descriptions are technical rather than conversational
- Recommendations sound like system logs

**New prompt structure:**
- Instruct the AI to write as if talking to a non-technical business owner
- Every leak description must follow the format:
  - **What happened** (clear human summary)
  - **What this means** (is money missing, at risk, or lost)
  - **Why this usually happens** (simple cause)
  - **What to do** (specific next steps)
- Tone: Calm, supportive, no blame, no jargon
- Banned words in main descriptions: reconciliation, sync failure, webhook, revenue recognition, discrepancy, mapping issue

**Example output transformation:**
```text
BEFORE: "Revenue reconciliation discrepancy detected. Payment sync failure between POS and settlement."

AFTER: "You didn't get paid for this order. Your records show you earned $90, but no payment was actually processed. This usually happens when a payment fails silently or your system doesn't update correctly. Search your payment provider for this order — if no charge exists, contact the customer to retry the payment."
```

### 2. Update Leak Type Labels

**File:** `src/pages/LeakResults.tsx`

Change the `getLeakTypeLabel` function to use friendlier, more descriptive labels:

| Current | New |
|---------|-----|
| Missing Payments | Money That Never Arrived |
| Duplicate Charges | You Got Charged Twice |
| Unused Subscriptions | Paying for Things You Don't Use |
| Failed Payments | Payments That Didn't Go Through |
| Pricing Mismatches | You're Being Overcharged |
| Billing Errors | Billing Mistakes |

### 3. Update Result Page Labels

**File:** `src/pages/LeakResults.tsx`

- Change "Issues Found" → "Problems Found"
- Change "Analysis Complete" → "We've finished checking your documents"
- Update the subtitle from "We found X potential issues worth investigating" → "We found X things that might be costing you money"

### 4. Update LeakCategoryTable Labels

**File:** `src/components/results/LeakCategoryTable.tsx`

- Table header "Confidence" → "How sure we are"
- Column header "Issue" → "Problem"
- Column header "Impact" → "Money at Risk"
- Remove or rename technical confidence labels

### 5. Update LeakDetailDrawer Language

**File:** `src/components/results/LeakDetailDrawer.tsx`

- Section "What's happening" → "What went wrong"
- Keep "Recommended Actions" as is (clear enough)
- "Total potential loss" → "Money you could lose"
- "Risk" label → "Urgency"
- "Confidence" → "How sure we are"
- Technical Details section: Keep as is (collapsed by default, for advanced users)
- "Detection Source" → "How we found this"
- "Detection Method" → keep in technical section

### 6. Banner Message Updates

**File:** `src/pages/LeakResults.tsx`

Update the success banner:
```text
BEFORE: "Analysis Complete - We found X potential issues worth investigating"

AFTER: "All done — We found X things that might be costing you money"
```

---

## Summary of Files to Edit

| File | Changes |
|------|---------|
| `supabase/functions/analyze-leaks/index.ts` | Rewrite GPT prompt with language rules and human-friendly output format |
| `src/pages/LeakResults.tsx` | Update labels, banner text, and leak type mappings |
| `src/components/results/LeakCategoryTable.tsx` | Update column headers and labels |
| `src/components/results/LeakDetailDrawer.tsx` | Update section titles and labels |

## Language Guidelines Summary (for AI prompt)

1. Start with a clear human summary: "We found an order that looks paid, but no payment was processed."
2. Explain what this means: "Your records say you earned $90, but the customer was never charged."
3. Simple cause: "This usually happens when a payment fails or your system doesn't update correctly."
4. Clear action: "Search your payment provider for this order. If no charge exists, contact the customer."
5. Tone: Calm, supportive, clear, no blame
6. Avoid: reconciliation, sync failure, webhook, revenue recognition, discrepancy, mapping issue (keep these in Technical Details only if needed)
