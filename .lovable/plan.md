
# Plan: Free Upload Page (One-Time POS Report Upload)

## Overview

Create a new `/free-analysis` page that mirrors the look and feel of the main dashboard (as shown in your screenshot) but with these restrictions:
- **Only 1 file upload allowed** (single POS report)
- **One-time upload limit** - after uploading, the user cannot upload again
- **Premium features locked** - POS connections, AI chat, and deeper insights are visible but locked with upgrade prompts

---

## What Will Be Created

### New Page: `src/pages/FreeAnalysis.tsx`

A streamlined version of the Dashboard with:

**Header Section**
- Same DashboardHeader component with MARGIX branding
- "Free Analysis" badge instead of "AI-Powered Scan"

**AI Status Strip**
- Same yellow waiting indicator: "AI Status: Waiting for documents"
- Message: "You get one complimentary scan. Make it count!"

**Hero Upload Card**
- Simplified upload zone allowing **only 1 file**
- Clear messaging: "Upload one payment or payout report"
- Supported formats listed (CSV, PDF, Excel, images)

**What AI Will Monitor Section**
- Same 3 cards (Missed Payments, Duplicate Charges, Forgotten Subscriptions)
- Muted, neutral styling matching your current design

**Locked POS Section**
- POS Connect cards (Square, Toast, Clover) with lock icons
- "Upgrade to Connect" messaging
- Uses LockedFeature overlay effect

**Locked AI Chat Widget**
- Chat widget visible but locked with blur overlay
- "Unlock AI Assistant" prompt linking to pricing

---

## Page Flow

```text
User arrives at /free-analysis
       |
       v
[Empty State - Upload Zone]
       |
       v
User uploads 1 file
       |
       v
[Analysis runs with progress indicator]
       |
       v
[Results displayed with locked premium features]
       |
       v
"Want deeper insights?" --> /pricing
```

---

## Restrictions to Implement

1. **File limit**: Max 1 file in the upload section
2. **One-time use**: After analysis completes, show "You've used your free scan" message with upgrade CTA
3. **Locked features visible but unusable**:
   - POS connections show lock icon
   - AI Chat widget shows blurred preview
   - "Deeper Insights" categories locked

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/FreeAnalysis.tsx` | **Create** | New free-tier upload page |
| `src/components/dashboard/FreeUploadDialog.tsx` | **Create** | Simplified 1-file upload component |
| `src/App.tsx` | **Modify** | Add route `/free-analysis` |

---

## Visual Design

- Same background with subtle gradient overlay
- Same card styling with `border-border/60` and `bg-card`
- Same muted icon colors in the "What AI Will Monitor" section
- Lock overlays use existing `LockedFeature` component pattern
- Upgrade buttons use `brand-gradient` styling

---

## Technical Details

### FreeAnalysis.tsx Structure
```tsx
// State to track if user has already used their free scan
const [hasUsedFreeScan, setHasUsedFreeScan] = useState(false);

// After successful analysis:
setHasUsedFreeScan(true);
navigate("/results");
```

### FreeUploadDialog.tsx
- Reuses existing UploadDialog logic but with `maxFiles: 1`
- Only shows "Money In & Payouts" category
- Shows upgrade prompt after successful analysis

### Locked Feature Overlays
- POS section wrapped with LockedFeature component
- AI Chat shows locked state with `locked={true}` prop

---

## Route Addition

```tsx
// In App.tsx
import FreeAnalysis from "./pages/FreeAnalysis";

<Route path="/free-analysis" element={<FreeAnalysis />} />
```

---

## Next Steps After Implementation

1. Test the upload flow end-to-end
2. Verify locked features display correctly
3. Ensure results page handles free-tier context
4. Test upgrade CTAs link to pricing page

