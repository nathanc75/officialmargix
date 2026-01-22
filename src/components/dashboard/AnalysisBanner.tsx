import { Button } from "@/components/ui/button";
import { Sparkles, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AnalysisBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4 sm:p-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/20 shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">Free Revenue Analysis</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                <Lock className="w-3 h-3" />
                One-time snapshot
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              This is your 30-day revenue analysis. Data is frozen and won't update. 
              Upgrade to unlock live monitoring, real-time alerts, and continuous insights.
            </p>
          </div>
        </div>
        
        <Link to="/pricing" className="shrink-0 w-full sm:w-auto">
          <Button className="w-full sm:w-auto brand-gradient border-0 text-white gap-2" data-testid="button-upgrade-plan">
            Upgrade to live monitoring
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AnalysisBanner;
