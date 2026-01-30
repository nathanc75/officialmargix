

# Flow Redesign: Staged Document Upload with Insight Unlock Prompts

## Overview

This plan restructures the upload and results flow to:
1. Focus the initial upload on **Money In & Payouts** only
2. After analysis, show results with **three upgrade prompts** to unlock deeper insights
3. Each prompt leads to uploading additional document types for enhanced analysis

## Current Flow vs. New Flow

```text
CURRENT FLOW:
Dashboard → Upload Dialog (all categories at once) → Analyze → Results

NEW FLOW:
Dashboard → Upload Dialog (Money In only) → Analyze → Results Page
                                                          ↓
                                        "Want deeper insights?" section
                                           ├─ Upload Prices  → Re-analyze
                                           ├─ Upload Sales   → Re-analyze  
                                           └─ Upload Costs   → Re-analyze
```

---

## Implementation Details

### 1. Simplify Initial Upload Dialog

**File:** `src/components/dashboard/UploadDialog.tsx`

The initial upload experience will only show the "Money In & Payouts" section. Premium/optional sections (Pricing, Orders, Costs) will be removed from this dialog since they'll be offered on the results page.

Changes:
- Remove the `premiumSections` array from the initial dialog
- Simplify `sections` to only include the first `baseSections[0]` (Money In & Payouts)
- Remove the optional "Your Listed Prices" from `baseSections` (it moves to results page)

### 2. Create Deeper Insights Component

**New File:** `src/components/results/DeeperInsightsSection.tsx`

A new component displaying three insight unlock cards with the user-provided copy:

| Card | Title | Description | Button | Icon |
|------|-------|-------------|--------|------|
| Pricing | Find Underpriced Services & Products | Upload your menu or price list to see where you may be charging too little and leaving money on the table. | Upload Prices | Tag icon |
| Sales | See What Actually Makes You Money | Upload itemized sales or order reports to discover your best sellers, low performers, and upsell opportunities. | Upload Sales Report | ShoppingCart icon |
| Profit | Calculate Your Real Profit | Add your costs and expenses to see which products or services are truly profitable - not just high revenue. | Upload Costs | TrendingDown icon |

Structure:
- Section header: "Want deeper insights? Add more context to your business"
- Subtext: "Each upload unlocks new analysis."
- Three cards in a responsive grid
- Each card opens a focused upload dialog for that specific category

### 3. Create Focused Upload Dialog for Each Category

**New File:** `src/components/results/InsightUploadDialog.tsx`

A simpler dialog that:
- Accepts a single `category` prop (pricing, orders, or costs)
- Shows only the upload zone for that category
- On analyze, appends new document data to existing analysis
- Re-runs the leak analysis with additional context
- Updates the results page with enhanced insights

### 4. Update Results Page

**File:** `src/pages/LeakResults.tsx`

Changes:
- Import and render the new `DeeperInsightsSection` component
- Position it after the main leak detection cards but before the "Get Ongoing Monitoring" CTA
- Track which additional categories have been uploaded (via context or local state)
- Hide individual insight cards once that category has been uploaded

### 5. Extend Analysis Context

**File:** `src/context/AnalysisContext.tsx`

Add state to track which document categories have been uploaded:

```typescript
interface AnalysisState {
  // ... existing fields
  uploadedCategories: Set<DocumentCategory>;
}

// New method to add documents and re-analyze
appendDocuments: (category: DocumentCategory, content: string) => Promise<void>;
```

This allows the system to:
- Know which categories have data
- Trigger re-analysis when new categories are added
- Show/hide the appropriate insight prompts

---

## Technical Details

### Component Structure

```text
src/
├── components/
│   ├── dashboard/
│   │   └── UploadDialog.tsx          (simplified - Money In only)
│   └── results/
│       ├── DeeperInsightsSection.tsx (new - the 3-card section)
│       └── InsightUploadDialog.tsx   (new - single-category upload)
├── context/
│   └── AnalysisContext.tsx           (extended with category tracking)
└── pages/
    └── LeakResults.tsx               (updated to show deeper insights)
```

### Insight Card Styling

Each card will use the existing Card component with:
- Gradient background matching the icon color theme
- Hover state with shadow and border color change
- Icon in a rounded container with gradient background
- Clear hierarchy: Title → Description → Button

### State Flow for Re-analysis

1. User clicks "Upload Prices" on results page
2. `InsightUploadDialog` opens with pricing-specific UI
3. User uploads files, clicks analyze
4. System calls `appendDocuments("pricing", content)`
5. Context triggers re-analysis with combined data
6. Results page updates with new insights
7. Pricing card is marked as complete or hidden

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/dashboard/UploadDialog.tsx` | Modify | Simplify to Money In only |
| `src/components/results/DeeperInsightsSection.tsx` | Create | Three insight prompt cards |
| `src/components/results/InsightUploadDialog.tsx` | Create | Single-category upload dialog |
| `src/context/AnalysisContext.tsx` | Modify | Track uploaded categories, add append method |
| `src/pages/LeakResults.tsx` | Modify | Add DeeperInsightsSection component |

---

## User Experience Flow

1. **Dashboard**: User sees "Upload Documents" button
2. **Upload Dialog**: Shows only "Money In & Payouts" section - simple and focused
3. **Analysis**: AI processes payment/payout documents
4. **Results**: Shows leak detection results
5. **Deeper Insights Section**: Three cards appear below results:
   - "Wait... I might be undercharging??" → Upload Prices
   - "Ohhh I want to know my top earners." → Upload Sales
   - "Wait... revenue isn't profit??" → Upload Costs
6. **Enhanced Analysis**: Each upload triggers re-analysis with richer context
7. **Updated Results**: Page refreshes with new insights from additional data

