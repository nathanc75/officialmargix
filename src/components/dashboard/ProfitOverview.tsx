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
      <h2 className="text-lg font-semibold text-foreground mb-4">Profit Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.label} 
            className={`backdrop-blur-xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 ${
              metric.isHighlighted 
                ? 'ring-2 ring-emerald-500/50 bg-gradient-to-br from-emerald-50/80 to-white/80' 
                : 'bg-white/70'
            }`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div 
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${metric.iconBg} flex items-center justify-center shadow-sm`}
                >
                  <metric.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.iconColor}`} />
                </div>
                {/* Trend indicator */}
                <div className={`flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md ${
                  metric.trendUp 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-red-600 bg-red-50'
                }`}>
                  {metric.trendUp ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {metric.trend}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">{metric.label}</p>
              <p className={`text-xl sm:text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProfitOverview;
