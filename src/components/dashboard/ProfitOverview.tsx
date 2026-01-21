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
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Profit Overview</h2>
        <div className="text-base font-black text-muted-foreground bg-muted px-6 py-2.5 rounded-xl border-2 shadow-sm uppercase tracking-wider">
          Live Analysis
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card 
            key={metric.label} 
            className={`border-2 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              metric.isHighlighted 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-card border-border'
            }`}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                  <p className={`text-5xl font-black tracking-tighter ${metric.color}`}>{metric.value}</p>
                </div>
                <div 
                  className={`p-4 rounded-2xl ${metric.iconBg} bg-opacity-10 border-2 shadow-inner`}
                >
                  <metric.icon className={`h-8 w-8 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className={`flex items-center gap-2 text-sm font-black px-3 py-2 rounded-lg uppercase tracking-wider ${
                  metric.trendUp 
                    ? 'text-emerald-700 bg-emerald-500/10' 
                    : 'text-red-700 bg-red-500/10'
                }`}>
                  {metric.trendUp ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {metric.trend}
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-black">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProfitOverview;
