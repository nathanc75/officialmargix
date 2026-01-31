-- Create saved_analyses table for storing user analysis results
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

-- Enable Row Level Security
ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own saved analyses
CREATE POLICY "Users can view their own analyses"
  ON public.saved_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON public.saved_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON public.saved_analyses FOR DELETE
  USING (auth.uid() = user_id);