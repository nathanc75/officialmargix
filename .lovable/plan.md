
# Plan: Add Format Recommendation Tip to Upload Dialogs

## Overview
Add a helpful tip message to guide users toward CSV and Excel formats while still accepting screenshots. This message will set clear expectations about accuracy and encourage best practices.

## Changes

### 1. FreeUploadDialog (`src/components/dashboard/FreeUploadDialog.tsx`)

**Location:** Inside the upload zone area (around line 400-402)

**Current text:**
```
CSV, PDF, Excel, or image formats supported
```

**New text:**
```
For best results, upload a CSV or Excel export from your payment platform.
Screenshots work too, but may have lower accuracy.
```

This replaces the simple format list with a more helpful recommendation that sets expectations.

### 2. UploadDialog (`src/components/dashboard/UploadDialog.tsx`)

**Location:** Inside the upload zone section (similar structure)

Add the same tip below the existing format information to maintain consistency across the paid upload flow.

### 3. InsightUploadDialog (`src/components/results/InsightUploadDialog.tsx`)

**Location:** After the placeholder text in the upload zone (around line 414-419)

Add a similar but slightly shorter tip that fits the context of insight uploads where screenshots are more common (menu photos, etc.).

---

## Technical Details

- Use `text-xs text-muted-foreground/80` for the main recommendation
- Use `text-amber-600 dark:text-amber-400` or similar for the accuracy warning to draw attention
- Keep the message concise and non-technical per brand voice guidelines
- No structural changes needed - just text updates within existing upload zones

## Files to Modify
- `src/components/dashboard/FreeUploadDialog.tsx`
- `src/components/dashboard/UploadDialog.tsx`
- `src/components/results/InsightUploadDialog.tsx`
