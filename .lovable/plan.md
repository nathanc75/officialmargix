

# Plan: Add Expense Tracking with Overdue Detection

## Overview
Transform the leak detection system to also recognize and track **business expenses**. When you upload a subscription or bill document that shows you're past due, the system will:
1. Recognize it as an **Expense** (not a leak)
2. Track whether it's **overdue** and by how much
3. Display a separate "Amount Due" total alongside "Recoverable"
4. Use amount-based severity (High: $500+, Medium: $100-499, Low: <$100)

## Current Behavior
- System looks for "leaks" (duplicate charges, missing customer payments, unused subscriptions)
- Your past-due subscription bill is being misclassified as "Money That Never Arrived" because the AI doesn't have an "expense" category

## New Behavior
- System will recognize expenses vs leaks
- Past-due vendor bills will be categorized as "Overdue Expenses" 
- Dashboard will show two separate totals: **Recoverable** (savings from leaks) and **Amount Due** (expenses you need to pay)

---

## Technical Changes

### 1. Update Analysis Types (`src/context/AnalysisContext.tsx`)

Add new fields to `LeakAnalysis` interface:
```typescript
export interface LeakAnalysis {
  totalLeaks: number;
  totalRecoverable: number;
  // NEW FIELDS
  totalAmountDue: number;        // Sum of overdue expenses
  expenses: {
    id: string;
    type: "subscription" | "vendor_bill" | "utility" | "rent" | "other";
    description: string;
    amount: number;
    dueDate?: string;
    daysOverdue?: number;
    severity: "high" | "medium" | "low";  // Based on amount
    recommendation: string;
    vendor?: string;
  }[];
  // ... existing fields
}
```

### 2. Update Edge Function (`supabase/functions/analyze-leaks/index.ts`)

**Gemini Prompt Changes:**
- Add detection for expense documents (subscription bills, vendor invoices, utility bills)
- Identify overdue status and due dates

**GPT System Prompt Changes:**
- Add new category: **OVERDUE EXPENSES** (bills you need to pay)
- Calculate severity based on amount:
  - High: $500+
  - Medium: $100-499
  - Low: Under $100
- Return separate `expenses` array alongside `leaks` array
- Calculate `totalAmountDue` separately from `totalRecoverable`

**New Classification Logic:**
```text
=== EXPENSE DOCUMENTS (NOT LEAKS) ===
When you see documents showing the business owes money:

1. Classify as an EXPENSE, not a leak
2. Determine the expense type:
   - subscription: Monthly/yearly software, SaaS tools
   - vendor_bill: Invoices from suppliers
   - utility: Electric, water, internet, phone
   - rent: Office or equipment rental
   - other: Everything else

3. Check overdue status:
   - Is there a "past due" notice?
   - Is there a due date that has passed?
   - How many days overdue?

4. Assign severity by AMOUNT (not age):
   - High: $500 or more
   - Medium: $100 to $499
   - Low: Under $100

5. Return in the "expenses" array, NOT the "leaks" array
```

**Updated Response Format:**
```json
{
  "totalLeaks": 0,
  "totalRecoverable": 0,
  "leaks": [],
  "totalAmountDue": 149.99,
  "expenses": [
    {
      "id": "exp-1",
      "type": "subscription",
      "description": "Your QuickBooks subscription payment is past due. The $149.99 monthly fee was due on January 15th and hasn't been paid yet.",
      "amount": 149.99,
      "dueDate": "2024-01-15",
      "daysOverdue": 17,
      "severity": "medium",
      "recommendation": "Log into QuickBooks and update your payment method to avoid service interruption.",
      "vendor": "QuickBooks"
    }
  ],
  "summary": "No revenue leaks detected. We found 1 overdue expense totaling $149.99 that needs attention."
}
```

### 3. Update Results Pages

**`src/pages/LeakResults.tsx` and `src/pages/FreeAnalysisResults.tsx`:**

Add a fourth summary card for "Amount Due":
```tsx
// New card alongside Problems Found, Recoverable, How Sure We Are
<Card>
  <CardContent>
    <p>Amount Due</p>
    <p>{formatCurrency(leakAnalysis.totalAmountDue)}</p>
    <Badge>Overdue expenses</Badge>
  </CardContent>
</Card>
```

**New Expense Category Table:**
- Add "Overdue Expenses" section below the Leaks table
- Show each expense with vendor, amount, days overdue, and severity
- Different styling to distinguish from leaks (e.g., orange/amber theme instead of red)

### 4. Update Leak Category Labels

Add new label mapping for expense types:
```typescript
const getExpenseTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    subscription: "Subscription Payments Due",
    vendor_bill: "Vendor Invoices Due",
    utility: "Utility Bills Due",
    rent: "Rent Payments Due",
    other: "Other Expenses Due",
  };
  return labels[type] || type;
};
```

### 5. Update Dashboard (`src/pages/Dashboard.tsx`)

Add expense tracking to the summary:
```tsx
const expenseResults = {
  overdueCount: leakAnalysis?.expenses?.length || 0,
  totalAmountDue: leakAnalysis?.totalAmountDue || 0,
};
```

Display in a new card or banner if there are overdue expenses.

---

## Files to Modify

1. **`supabase/functions/analyze-leaks/index.ts`** — Add expense detection and classification logic
2. **`src/context/AnalysisContext.tsx`** — Add expense types to LeakAnalysis interface
3. **`src/pages/LeakResults.tsx`** — Add Amount Due card and expense table
4. **`src/pages/FreeAnalysisResults.tsx`** — Add Amount Due card and expense table (limited view)
5. **`src/pages/Dashboard.tsx`** — Show overdue expense count if applicable
6. **`src/components/results/LeakCategoryTable.tsx`** — Handle expense display (optional: create new ExpenseCategoryTable)

---

## User Experience After Implementation

When you upload a past-due subscription document:
1. It will be classified as an **Expense** (subscription type)
2. Results will show:
   - **Leaks Found: 0** (no revenue leaks)
   - **Recoverable: $0** (no money to recover)
   - **Amount Due: $149.99** (what you owe)
3. The expense will appear in an "Overdue Expenses" section with:
   - Vendor name
   - Amount
   - Days overdue
   - Severity (based on amount)
   - Recommendation to pay

