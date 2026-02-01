

# Plan: Remove "What We Checked" Section

## Overview
Remove the "What We Checked" (ScanCoverageSection) from the results page. This section displays the 8 leak types that were scanned, showing which ones had issues found.

## Changes Required

### File: `src/pages/LeakResults.tsx`

1. **Remove import** (line 29):
   ```typescript
   // DELETE this line
   import { ScanCoverageSection } from "@/components/results/ScanCoverageSection";
   ```

2. **Remove data calculations** (lines 152-157):
   ```typescript
   // DELETE these lines - no longer needed
   const foundTypes = useMemo(() => leakCategories.map(c => c.type), [leakCategories]);
   const foundCounts = useMemo(() => 
     Object.fromEntries(leakCategories.map(c => [c.type, c.count])), 
     [leakCategories]
   );
   ```

3. **Remove component usage** (lines 505-509):
   ```tsx
   // DELETE these lines
   {/* Scan Coverage - What We Checked */}
   <ScanCoverageSection 
     foundTypes={foundTypes}
     foundCounts={foundCounts}
   />
   ```

### Optional Cleanup: `src/components/results/ScanCoverageSection.tsx`
- Delete this file entirely since it's no longer used
- Or keep it for potential future use

## Result
The results page will go straight from the summary cards to the Issues Table, without the "What We Checked" section in between.

