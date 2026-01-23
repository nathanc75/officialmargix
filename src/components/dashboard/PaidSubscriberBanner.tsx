import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw, Zap, Calendar } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

const PaidSubscriberBanner = () => {
  const { tier } = useSubscription();

  const tierLabels: Record<string, string> = {
    starter: "Starter Plan",
    pro: "Pro Plan",
    custom: "Enterprise"
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-background p-4 sm:p-5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className="gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Live Monitoring Active
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-primary border-primary/30">
            <Zap className="w-3 h-3" />
            {tierLabels[tier] || "Pro Plan"}
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Last synced: 2 min ago
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Real-time Revenue Analytics</h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Your data syncs automatically every 15 minutes. All platforms connected and monitoring for pricing errors.
            </p>
          </div>
          
          <Button variant="outline" className="gap-2 shrink-0" data-testid="button-sync-now">
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaidSubscriberBanner;
