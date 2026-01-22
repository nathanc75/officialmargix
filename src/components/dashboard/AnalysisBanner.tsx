import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, ArrowRight, Calendar, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const AnalysisBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-background p-5 sm:p-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        {/* Top section with badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
            <Sparkles className="w-3 h-3" />
            Analysis Complete
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-muted-foreground">
            <FileText className="w-3 h-3" />
            From your uploaded report
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Dec 22 - Jan 21, 2026
          </Badge>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground">Your Free Revenue Analysis</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                <Lock className="w-3 h-3" />
                Frozen snapshot
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              We found <span className="font-semibold text-red-600">$1,247 in potential revenue recovery</span> from your 30-day data. 
              This analysis won't update — upgrade to get live monitoring, real-time alerts, and catch every pricing error as it happens.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs text-emerald-600 font-medium">Recoverable</p>
                <p className="text-lg font-bold text-emerald-600">$1,247</p>
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
