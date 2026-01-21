import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Percent, Tag, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

const ProfitOverview = () => {
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
      trendUp: false, // up is bad for fees
      icon: Percent,
      color: "text-red-600",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Promo Discounts",
      value: "-$1,840",
      trend: "-12%",
      trendUp: true, // down is good for discounts
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
        <h2 className="text-base font-bold uppercase tracking-wider text-muted-foreground">Profit Overview</h2>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md border">
          Real-time updates
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.label} 
            className={`border shadow-sm transition-all duration-200 hover:shadow-md ${
              metric.isHighlighted 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-card'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">{metric.label}</p>
                  <p className={`text-3xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
                </div>
                <div 
                  className={`p-2.5 rounded-lg ${metric.iconBg} bg-opacity-10`}
                >
                  <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded uppercase ${
                  metric.trendUp 
                    ? 'text-emerald-700 bg-emerald-500/10' 
                    : 'text-red-700 bg-red-500/10'
                }`}>
                  {metric.trendUp ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {metric.trend}
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-tight font-medium">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProfitOverview;
