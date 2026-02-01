
# Plan: Fix Subscription Expense Misclassification

## Problem
When you upload a subscription document showing you're past due on a payment (e.g., a SaaS tool you're paying for), the AI is still incorrectly flagging it as "Money That Never Arrived" instead of recognizing it as a normal business expense/accounts payable item that should NOT be flagged at all.

## Root Cause Analysis
The current prompt tells the AI what NOT to flag, but:
1. The instruction may not be strong enough at the beginning of the prompt
2. The AI doesn't have a clear "skip this" action — so it tries to fit everything into a leak category
3. The Gemini pattern detection step doesn't have the money flow rules, so it might be seeding bad classifications

## Solution

### File: `supabase/functions/analyze-leaks/index.ts`

**Change 1: Add money flow rules to Gemini prompt (lines 29-52)**

The Gemini step currently just looks for "revenue leaks" without distinguishing direction. We need to add context so it doesn't flag accounts payable items as patterns.

```text
Add to Gemini prompt:
IMPORTANT: Only look for patterns that represent money LOST or LEAKED from the business.
Do NOT flag the business's own unpaid bills or past-due notices — those are obligations the business owes, not leaks.
```

**Change 2: Add explicit "NOT A LEAK" handling instruction to GPT prompt**

Add a clear instruction that if a document represents the business's own expense or obligation, the AI should NOT create a leak entry for it — just skip it or note it's a normal expense.

```text
IMPORTANT INSTRUCTION:
If a document shows the business owes money to a vendor/platform (past-due notice, invoice from supplier, subscription bill):
- This is NOT a leak — it's a normal business obligation
- Do NOT create any leak entry for it
- You may mention it in the summary as "normal accounts payable" if relevant
- Only flag issues where the BUSINESS is losing money it shouldn't lose
```

**Change 3: Make "DO NOT FLAG" section more prominent**

Move the "DO NOT FLAG AS LEAKS" section higher in the prompt, right after the money flow direction rules, so the AI sees it before trying to classify.

**Change 4: Add explicit examples of what IS vs what IS NOT a leak**

```text
EXAMPLES:
✓ LEAK: Customer invoice from 60 days ago still unpaid → Missing Payment (they owe YOU)
✗ NOT A LEAK: Your Quickbooks subscription is past due → Normal expense (YOU owe them)

✓ LEAK: Same $50 charge from Stripe appeared twice → Duplicate Charge
✗ NOT A LEAK: $50 monthly software subscription each month → Normal recurring expense
```

---

## Technical Implementation

### Changes to `supabase/functions/analyze-leaks/index.ts`:

1. **Lines 29-52 (Gemini prompt)**: Add money flow awareness
2. **Lines 96-160 (GPT system prompt)**: 
   - Move "DO NOT FLAG" section earlier
   - Add explicit "skip it" instruction for vendor obligations
   - Add clear examples

### After Implementation
- Redeploy the `analyze-leaks` edge function
- Test with the same subscription past-due document
- It should either: show no leaks, or correctly categorize as something other than "Missing Payment"
