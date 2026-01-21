import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Percent, Tag, TrendingUp } from "lucide-react";

const ProfitOverview = () => {
  const metrics = [
    {
      label: "Gross Sales",
      value: "$12,480",
      icon: DollarSign,
      color: "text-foreground",
      bgColor: "bg-secondary",
    },
    {
      label: "Platform Fees",
      value: "-$3,220",
      icon: Percent,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Promo Discounts",
      value: "-$1,840",
      icon: Tag,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Net Profit",
      value: "$7,420",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      isHighlighted: true,
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Profit Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.label} 
            className={`${metric.isHighlighted ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : ''}`}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProfitOverview;
