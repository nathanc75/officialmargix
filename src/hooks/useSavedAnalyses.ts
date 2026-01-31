import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { LeakAnalysis } from "@/context/AnalysisContext";

export interface SavedAnalysis {
  id: string;
  user_id: string;
  title: string;
  total_leaks: number;
  total_recoverable: number;
  summary: string | null;
  leaks: LeakAnalysis["leaks"];
  confidence: LeakAnalysis["confidence"] | null;
  analyzed_at: string;
  created_at: string;
}

export function useSavedAnalyses() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAnalyses([]);
        return [];
      }

      const { data, error } = await supabase
        .from("saved_analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion for the JSONB fields
      const typedData = (data || []).map(item => ({
        ...item,
        leaks: item.leaks as unknown as LeakAnalysis["leaks"],
        confidence: item.confidence as unknown as LeakAnalysis["confidence"] | null,
      }));

      setAnalyses(typedData);
      return typedData;
    } catch (error) {
      console.error("Error fetching analyses:", error);
      toast({
        title: "Error loading analyses",
        description: "Could not load your saved analyses. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveAnalysis = useCallback(async (
    analysis: LeakAnalysis,
    title?: string
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save your analysis.",
          variant: "destructive",
        });
        return false;
      }

      const analysisTitle = title || `Analysis - ${new Date().toLocaleDateString()}`;

      const { error } = await supabase
        .from("saved_analyses")
        .insert([{
          user_id: user.id,
          title: analysisTitle,
          total_leaks: analysis.totalLeaks,
          total_recoverable: analysis.totalRecoverable,
          summary: analysis.summary,
          leaks: JSON.parse(JSON.stringify(analysis.leaks)),
          confidence: analysis.confidence ? JSON.parse(JSON.stringify(analysis.confidence)) : null,
          analyzed_at: analysis.analyzedAt,
        }]);

      if (error) throw error;

      toast({
        title: "Analysis saved",
        description: "Your analysis has been saved successfully.",
      });
      return true;
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        title: "Error saving analysis",
        description: "Could not save your analysis. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const deleteAnalysis = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("saved_analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAnalyses(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Analysis deleted",
        description: "The analysis has been removed.",
      });
      return true;
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        title: "Error deleting analysis",
        description: "Could not delete the analysis. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    analyses,
    isLoading,
    isSaving,
    fetchAnalyses,
    saveAnalysis,
    deleteAnalysis,
  };
}
