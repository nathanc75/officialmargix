import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, ArrowRight, Calendar, FileText, TrendingUp, Upload, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportAnalysis } from "@/context/AnalysisContext";

interface AnalysisBannerProps {
  hasData?: boolean;
  reportAnalysis?: ReportAnalysis | null;
  isAnalyzing?: boolean;
  analysisStep?: string;
}

const AnalysisBanner = ({ hasData = false, reportAnalysis, isAnalyzing = false, analysisStep = "" }: AnalysisBannerProps) => {
  if (isAnalyzing) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-background p-5 sm:p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-center gap-4 py-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <div>
            <h3 className="text-lg font-bold text-foreground">Analyzing Your Data</h3>
            <p className="text-sm text-muted-foreground">{analysisStep || "Processing..."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-muted bg-gradient-to-r from-muted/50 via-muted/20 to-background p-5 sm:p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-muted/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="gap-1.5 text-muted-foreground">
              <Upload className="w-3 h-3" />
              No POS connected
            </Badge>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Get Started with Your Analysis</h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Connect your POS to see AI-powered insights across dine-in, takeout, and delivery channels.
              </p>
            </div>
            
            <Link to="/uploads-pos" className="shrink-0">
              <Button className="w-full sm:w-auto brand-gradient border-0 text-white gap-2" data-testid="button-connect-pos">
                <Upload className="w-4 h-4" />
                Connect POS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalRecoverable = reportAnalysis?.issues?.reduce((sum, issue) => sum + (issue.potentialRecovery || 0), 0) || 1247;
  const dateNow = new Date();
  const dateStart = new Date(dateNow.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dateRangeStr = `${dateStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateNow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-background p-5 sm:p-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
            <Sparkles className="w-3 h-3" />
            Analysis Complete
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-muted-foreground">
            <FileText className="w-3 h-3" />
            From your POS data
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {dateRangeStr}
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground">Your Performance Analysis</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                <Lock className="w-3 h-3" />
                Trial snapshot
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              We found <span className="font-semibold text-red-600">${totalRecoverable.toLocaleString()} in optimization opportunities</span> from your data. 
              Upgrade to get live analytics, real-time alerts, and AI recommendations across all your order channels. <span data-testid="text-pos-requirement-banner">Powered by your POS connection.</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs text-emerald-600 font-medium">Recoverable</p>
                <p className="text-lg font-bold text-emerald-600">${totalRecoverable.toLocaleString()}</p>
              </div>
            </div>
            <Link to="/pricing" className="shrink-0">
              <Button className="w-full sm:w-auto brand-gradient border-0 text-white gap-2" data-testid="button-upgrade-plan">
                Unlock Live Monitoring
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisBanner;
