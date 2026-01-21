import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Percent, Tag, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

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
        <h2 className="text-base font-bold uppercase tracking-wider text-muted-foreground">Profit Overview</h2>
        <div className="text-sm font-bold text-muted-foreground bg-muted px-4 py-2 rounded-md border shadow-sm">
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
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">{metric.label}</p>
                  <p className={`text-4xl font-black tracking-tight ${metric.color}`}>{metric.value}</p>
                </div>
                <div 
                  className={`p-3 rounded-lg ${metric.iconBg} bg-opacity-10 border`}
                >
                  <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-xs font-black px-2.5 py-1.5 rounded uppercase ${
                  metric.trendUp 
                    ? 'text-emerald-700 bg-emerald-500/10' 
                    : 'text-red-700 bg-red-500/10'
                }`}>
                  {metric.trendUp ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )}
                  {metric.trend}
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProfitOverview;
