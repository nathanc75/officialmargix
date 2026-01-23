import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Percent, Tag, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

const ProfitOverview = () => {
  const { isPaid } = useSubscription();
  const metrics = [
    {
      label: "Gross Sales",
      value: "$12,480",
      trend: "+8.2%",
      trendUp: true,
      icon: DollarSign,
      color: "text-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-foreground",
    },
    {
      label: "Platform Fees",
      value: "-$3,220",
      trend: "+2.1%",
      trendUp: false,
      icon: Percent,
      color: "text-red-600",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Promo Discounts",
      value: "-$1,840",
      trend: "-12%",
      trendUp: true,
      icon: Tag,
      color: "text-red-600",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Net Profit",
      value: "$7,420",
      trend: "+15%",
      trendUp: true,
      icon: TrendingUp,
      color: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      isHighlighted: true,
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Profit Overview</h2>
        {isPaid ? (
          <div className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 shrink-0">
            Real-time
          </div>
        ) : (
          <div className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800 shrink-0">
            30-day snapshot
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.label} 
            className={`border shadow-sm transition-all duration-200 hover:shadow-md ${
              metric.isHighlighted 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-card'
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">{metric.label}</p>
                  <p className={`text-xl sm:text-2xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
                </div>
                <div 
                  className={`p-2 rounded-lg shrink-0 ${metric.iconBg} bg-opacity-10`}
                >
                  <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <div className={`flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  metric.trendUp 
                    ? 'text-emerald-700 bg-emerald-500/10' 
                    : 'text-red-700 bg-red-500/10'
                }`}>
                  {metric.trendUp ? (
                    <ArrowUp className="h-2.5 w-2.5" />
                  ) : (
                    <ArrowDown className="h-2.5 w-2.5" />
                  )}
                  {metric.trend}
                </div>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-tight truncate">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProfitOverview;
