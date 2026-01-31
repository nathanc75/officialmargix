import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, TrendingUp, Bell, FileDown, BarChart3, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LockedPremiumSection = () => {
  const lockedFeatures = [
    {
      icon: TrendingUp,
      title: "Historical Trends",
      description: "Track revenue patterns over 6-12 months to identify seasonal opportunities",
      value: "See trends up to 1 year"
    },
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Coming Soon: Pricing & fee anomaly detection",
      value: "Catch errors as they happen",
      comingSoon: true
    },
    {
      icon: FileDown,
      title: "Export Reports",
      description: "Download detailed PDF and Excel reports for your records and accountant",
      value: "Unlimited exports",
      comingSoon: false
    },
    {
      icon: BarChart3,
      title: "Platform Comparison",
      description: "Coming Soon: Cross-platform performance analytics",
      value: "Side-by-side insights",
      comingSoon: true
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Premium Features</h2>
          <Badge variant="outline" className="text-[9px] h-5 gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
            <Lock className="w-2.5 h-2.5" />
            Locked
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {lockedFeatures.map((feature, index) => (
              <div 
                key={index}
                className="relative p-4 rounded-xl bg-background/80 border border-muted/50 opacity-70"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {feature.comingSoon && (
                    <Badge variant="outline" className="text-[8px] h-4 px-1.5 bg-amber-50 text-amber-600 border-amber-200">
                      Coming Soon
                    </Badge>
                  )}
                  <Lock className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{feature.description}</p>
                    <Badge variant="secondary" className="text-[9px] h-5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <Zap className="w-2.5 h-2.5 mr-1" />
                      {feature.value}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-foreground mb-1">Unlock All Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                Get live monitoring, AI suggestions, and full analytics starting at <span className="font-semibold text-primary">$39/month</span>
              </p>
            </div>
            <Link to="/pricing" className="shrink-0">
              <Button className="gap-2 brand-gradient border-0 text-white" size="lg" data-testid="button-upgrade-premium">
                <Sparkles className="w-4 h-4" />
                View Plans
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default LockedPremiumSection;
