import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UniversalExtraction } from "@/types/extraction";

// Re-export extraction types for convenience
export type { UniversalExtraction } from "@/types/extraction";

export interface AnalysisSummary {
  totalRevenue: { value: number; isEstimate: boolean };
  totalFees: { value: number; isEstimate: boolean };
  totalPromos: { value: number; isEstimate: boolean };
  totalRefunds: { value: number; isEstimate: boolean };
  netProfit: { value: number; isEstimate: boolean };
}

export interface AnalysisIssue {
  type: "pricing_error" | "missed_refund" | "fee_discrepancy" | "promo_loss" | "duplicate_charge" | "missing_payment" | "unused_subscription";
  description: string;
  potentialRecovery: number;
}

export interface AnalysisItem {
  name: string;
  quantity: number;
  revenue: number;
  profit: number;
  isEstimate: boolean;
}

export interface ReportAnalysis {
  summary: AnalysisSummary;
  issues: AnalysisIssue[];
  items: AnalysisItem[];
  recommendations: string[];
}

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  modifiers?: { name: string; price: number }[];
}

export interface MenuAnalysis {
  platform: string;
  menuItems: MenuItem[];
  notes: string;
}

export interface ComparisonResult {
  discrepancies: {
    itemName: string;
    menuPrice: number;
    chargedPrice: number;
    difference: number;
    type: "undercharge" | "overcharge" | "missing";
    estimatedLoss: number;
    isEstimate: boolean;
  }[];
  totalEstimatedRecovery: number;
  priorityActions: string[];
  summary: string;
}

export interface LeakAnalysis {
  totalLeaks: number;
  totalRecoverable: number;
  leaks: {
    id: string;
    type: string;
    description: string;
    amount: number;
    date?: string;
    severity: "high" | "medium" | "low";
    recommendation: string;
    confidence?: number;
    crossValidated?: boolean;
    modelSource?: "gemini" | "gpt" | "both";
  }[];
  summary: string;
  analyzedAt: string;
  multiModelAnalysis?: boolean;
  confidence?: {
    overallScore: number;
    crossValidated: number;
    needsReview: number;
  };
  modelContributions?: {
    gemini: string[];
    gpt: string[];
  };
}

interface AnalysisState {
  reportAnalysis: ReportAnalysis | null;
  menuAnalysis: MenuAnalysis | null;
  comparison: ComparisonResult | null;
  leakAnalysis: LeakAnalysis | null;
  extractions: UniversalExtraction[];
  isAnalyzing: boolean;
  analysisStep: string;
  error: string | null;
}

interface AnalysisContextType extends AnalysisState {
  analyzeReport: (reportContent: string, reportType?: string) => Promise<ReportAnalysis | null>;
  analyzeMenu: (imageBase64: string, imageMimeType: string) => Promise<MenuAnalysis | null>;
  compareData: () => Promise<ComparisonResult | null>;
  setLeakAnalysis: (analysis: LeakAnalysis) => void;
  setExtractions: (extractions: UniversalExtraction[]) => void;
  addExtraction: (extraction: UniversalExtraction) => void;
  clearAnalysis: () => void;
  hasData: boolean;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalysisState>({
    reportAnalysis: null,
    menuAnalysis: null,
    comparison: null,
    leakAnalysis: null,
    extractions: [],
    isAnalyzing: false,
    analysisStep: "",
    error: null,
  });

  const analyzeReport = useCallback(async (reportContent: string, reportType?: string): Promise<ReportAnalysis | null> => {
    setState(prev => ({ ...prev, isAnalyzing: true, analysisStep: "Analyzing delivery report...", error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-report", {
        body: { reportContent, reportType },
      });
      
      if (error) {
        throw new Error(error.message || "Failed to analyze report");
      }
      
      const analysis = data.analysis as ReportAnalysis;
      
      setState(prev => ({
        ...prev,
        reportAnalysis: analysis,
        isAnalyzing: false,
        analysisStep: "",
      }));
      
      return analysis;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Analysis failed";
      setState(prev => ({ ...prev, isAnalyzing: false, error, analysisStep: "" }));
      return null;
    }
  }, []);

  const analyzeMenu = useCallback(async (imageBase64: string, imageMimeType: string): Promise<MenuAnalysis | null> => {
    setState(prev => ({ ...prev, isAnalyzing: true, analysisStep: "Reading menu prices...", error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-menu", {
        body: { imageBase64, imageMimeType },
      });
      
      if (error) {
        throw new Error(error.message || "Failed to analyze menu");
      }
      
      const menuData = data.menuData as MenuAnalysis;
      
      setState(prev => ({
        ...prev,
        menuAnalysis: menuData,
        isAnalyzing: false,
        analysisStep: "",
      }));
      
      return menuData;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Menu analysis failed";
      setState(prev => ({ ...prev, isAnalyzing: false, error, analysisStep: "" }));
      return null;
    }
  }, []);

  const compareData = useCallback(async (): Promise<ComparisonResult | null> => {
    if (!state.reportAnalysis || !state.menuAnalysis) {
      return null;
    }
    
    setState(prev => ({ ...prev, isAnalyzing: true, analysisStep: "Comparing data for discrepancies...", error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-compare", {
        body: {
          reportAnalysis: state.reportAnalysis,
          menuData: state.menuAnalysis,
        },
      });
      
      if (error) {
        throw new Error(error.message || "Failed to compare data");
      }
      
      const comparison = data.comparison as ComparisonResult;
      
      setState(prev => ({
        ...prev,
        comparison,
        isAnalyzing: false,
        analysisStep: "",
      }));
      
      return comparison;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Comparison failed";
      setState(prev => ({ ...prev, isAnalyzing: false, error, analysisStep: "" }));
      return null;
    }
  }, [state.reportAnalysis, state.menuAnalysis]);

  const setLeakAnalysis = useCallback((analysis: LeakAnalysis) => {
    setState(prev => ({ ...prev, leakAnalysis: analysis }));
  }, []);

  const setExtractions = useCallback((extractions: UniversalExtraction[]) => {
    setState(prev => ({ ...prev, extractions }));
  }, []);

  const addExtraction = useCallback((extraction: UniversalExtraction) => {
    setState(prev => ({ ...prev, extractions: [...prev.extractions, extraction] }));
  }, []);

  const clearAnalysis = useCallback(() => {
    setState({
      reportAnalysis: null,
      menuAnalysis: null,
      comparison: null,
      leakAnalysis: null,
      extractions: [],
      isAnalyzing: false,
      analysisStep: "",
      error: null,
    });
  }, []);

  const hasData = !!(state.reportAnalysis || state.menuAnalysis || state.leakAnalysis || state.extractions.length > 0);

  return (
    <AnalysisContext.Provider
      value={{
        ...state,
        analyzeReport,
        analyzeMenu,
        compareData,
        setLeakAnalysis,
        setExtractions,
        addExtraction,
        clearAnalysis,
        hasData,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
