

## Plan: Save and View Past Analyses for Logged-in Users

### Overview
This feature allows authenticated users to save their leak analysis results to the database and access them later through a "My Analyses" section. Users can view past scans, see the results again, and track their financial leak detection history.

### How It Works
When a user completes a document analysis, a "Save Analysis" button will appear on the results page. Clicking it stores the analysis in the database linked to their account. Users can then access their saved analyses from a new "My Analyses" page or section, where they can view past results and reload them for review.

---

### Changes Required

#### 1. Create Database Table for Saved Analyses
Create a new `saved_analyses` table to store user analysis results:

```text
+------------------+------------------------+
| Column           | Type                   |
+------------------+------------------------+
| id               | uuid (primary key)     |
| user_id          | uuid (foreign key)     |
| title            | text                   |
| total_leaks      | integer                |
| total_recoverable| decimal                |
| summary          | text                   |
| leaks            | jsonb                  |
| confidence       | jsonb                  |
| analyzed_at      | timestamp              |
| created_at       | timestamp              |
+------------------+------------------------+
```

Row Level Security policies will ensure users can only access their own saved analyses.

#### 2. Update Results Page (LeakResults.tsx)
- Add a "Save Analysis" button next to the existing "Export PDF" button
- When clicked, save the current `leakAnalysis` data to the database
- Show success/error feedback via toast notifications
- Disable the save button if already saved or if user is not authenticated

#### 3. Create "My Analyses" Page
New page at `/my-analyses` that displays:
- A list of all saved analyses for the current user
- Each item shows: title/date, total leaks found, recoverable amount
- Click on an item to view the full analysis results
- Delete option to remove old analyses

#### 4. Update Navigation
- Add "My Analyses" link to the dashboard header for authenticated users
- Add "My Analyses" option in user menu or navigation

#### 5. Update App.tsx Routes
- Add route for `/my-analyses` page

#### 6. Update Analysis Context
- Add function to load a saved analysis into the context
- This allows viewing past analyses with the existing LeakResults UI

---

### Technical Details

#### Database Migration SQL
```sql
CREATE TABLE public.saved_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Analysis',
  total_leaks integer NOT NULL DEFAULT 0,
  total_recoverable numeric NOT NULL DEFAULT 0,
  summary text,
  leaks jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence jsonb,
  analyzed_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analyses"
  ON public.saved_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON public.saved_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON public.saved_analyses FOR DELETE
  USING (auth.uid() = user_id);
```

#### Files to Create
| File | Purpose |
|------|---------|
| `src/pages/MyAnalyses.tsx` | Page displaying saved analyses history |
| `src/hooks/useSavedAnalyses.ts` | Hook for fetching/saving analyses to database |

#### Files to Modify
| File | Changes |
|------|---------|
| `src/pages/LeakResults.tsx` | Add "Save Analysis" button and save logic |
| `src/App.tsx` | Add `/my-analyses` route |
| `src/components/dashboard/DashboardHeader.tsx` | Add "My Analyses" navigation link |
| `src/context/AnalysisContext.tsx` | Add `loadSavedAnalysis` function |

---

### User Flow

1. User completes analysis and views results on `/results`
2. User clicks "Save Analysis" button
3. Analysis is saved to database with success toast
4. User can navigate to "My Analyses" from dashboard
5. User sees list of all past analyses with dates and amounts
6. User clicks on any past analysis to view full details
7. User can delete old analyses they no longer need

---

### Summary
This feature transforms MARGIX from a one-time scan tool into a persistent financial monitoring platform where users can track their leak detection history over time and revisit past findings.

