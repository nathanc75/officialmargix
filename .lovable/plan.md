
# Plan: Fix "Missing Payment" Misclassification Issue

## Problem
The leak detection AI is incorrectly categorizing **your unpaid bills to vendors** as "Money That Never Arrived" (missing customer payments). When you upload a document showing your business is past due on a subscription, it's being flagged as if a customer owes you money.

## Root Cause
The AI prompt in `analyze-leaks` doesn't clearly distinguish between:
- **Incoming money** (revenue/receivables) - customer payments to you
- **Outgoing money** (expenses/payables) - your payments to vendors

The current prompt says "Money you expected but never received" but doesn't clarify the **direction** of the money flow.

---

## Solution

### File: `supabase/functions/analyze-leaks/index.ts`

Update the GPT system prompt (lines 96-162) to add explicit direction-of-flow guidance:

**Changes to the prompt:**

1. **Add a new "MONEY FLOW RULE" section** that instructs the AI to first determine whether a transaction represents:
   - Money flowing INTO the business (revenue, receivables, customer payments)
   - Money flowing OUT of the business (expenses, payables, vendor payments)

2. **Clarify each leak type** with explicit direction indicators:
   - MISSING PAYMENTS: Only for money owed TO you BY customers, NOT your unpaid bills
   - UNUSED SUBSCRIPTIONS: Only for subscriptions YOU pay for but don't use
   - etc.

3. **Add explicit exclusions**:
   - "Do NOT flag the business's own unpaid bills as 'missing payments'"
   - "Your past-due obligations to vendors are NOT leaks - they are accounts payable"

**Updated prompt section:**
```text
CRITICAL - MONEY FLOW DIRECTION:
Before classifying any issue, determine the money flow:
- INFLOW (revenue): Money coming INTO the business from customers
- OUTFLOW (expense): Money going OUT to vendors, suppliers, platforms

Issue types - ONLY flag these:

- MISSING PAYMENTS - Money owed TO YOU by customers that never arrived
  ✓ Include: Customer invoices unpaid, expected deposits missing, refunds owed to you
  ✗ Exclude: YOUR unpaid bills to vendors, YOUR past-due subscriptions

- UNUSED SUBSCRIPTIONS - Services YOU PAY FOR but aren't using
  ✓ Include: Software you're paying for monthly but haven't logged into
  ✗ Exclude: Subscriptions customers owe you for

- DUPLICATE CHARGES - You got billed twice for the same thing (outflow)
- FAILED PAYMENTS - Payments TO YOU that failed and weren't retried (inflow)
- PRICING INEFFICIENCIES - You're being charged more than market rate (outflow)
- BILLING ERRORS - Mistakes in invoices or calculations (either direction)
- REFUND FEE LOSS - You refunded a customer but still paid the processing fee
- CHURN PERMANENT LOSS - Customers who cancelled their subscriptions with you
```

---

## Technical Details

### Edge Function Changes
- **File**: `supabase/functions/analyze-leaks/index.ts`
- **Location**: GPT system prompt (lines 96-162)
- **Change Type**: Prompt engineering - no code logic changes

### What This Fixes
- Past-due subscription notices for services you use will no longer be flagged as "missing payments"
- The AI will correctly understand that your unpaid vendor bills are accounts payable, not revenue leaks
- Only genuine revenue-side issues will appear in the "Money That Never Arrived" category

### No UI Changes Required
The frontend correctly displays whatever the AI returns - the fix is entirely in the AI prompt logic.

---

## After Implementation
- Redeploy the `analyze-leaks` edge function
- Run a test scan with the same subscription past-due document
- Verify it no longer appears as "Missing Payment"
