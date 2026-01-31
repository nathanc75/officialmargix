
## Plan: Remove the Uploads Page

### Overview
Remove the `/upload` page entirely and update all references to redirect users to the `/free-analysis` page instead, since that's the active free scanning experience.

### Changes Required

#### 1. Delete the Uploads Page File
- **File**: `src/pages/Uploads.tsx`
- **Action**: Delete this file (916 lines)

#### 2. Update App.tsx Route Configuration
- **File**: `src/App.tsx`
- **Changes**:
  - Remove the import for `Uploads` component
  - Remove the `/upload` route definition

#### 3. Update Pricing Page Navigation
- **File**: `src/pages/Pricing.tsx`
- **Change**: Update the "Free Scan" plan to redirect to `/free-analysis` instead of `/upload`

#### 4. Update Pricing Section Component Navigation
- **File**: `src/components/PricingSection.tsx`
- **Change**: Update the "Free Scan" plan to navigate to `/free-analysis` instead of `/upload`

### Summary of Files to Modify
| File | Action |
|------|--------|
| `src/pages/Uploads.tsx` | Delete |
| `src/App.tsx` | Remove import and route |
| `src/pages/Pricing.tsx` | Change `/upload` → `/free-analysis` |
| `src/components/PricingSection.tsx` | Change `/upload` → `/free-analysis` |

### Note
Some components reference `/uploads-pos` which is a different route that doesn't exist currently - those are likely placeholder links for future functionality and are not affected by this change.
