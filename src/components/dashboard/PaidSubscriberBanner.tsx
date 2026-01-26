import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw, Zap, Calendar } from "lucide-react";

const PaidSubscriberBanner = () => {

  return (
    <div className="relative overflow-hidden rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-background px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="gap-1 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Live Monitoring
          </Badge>
          <Badge variant="outline" className="gap-1 py-0.5 text-[10px] text-primary border-primary/30">
            <Zap className="w-2.5 h-2.5" />
            Pro
          </Badge>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            Syncs every 15 min
          </span>
        </div>
        
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" data-testid="button-sync-now">
          <RefreshCw className="w-3 h-3" />
          Sync Now
        </Button>
      </div>
    </div>
  );
};

export default PaidSubscriberBanner;
