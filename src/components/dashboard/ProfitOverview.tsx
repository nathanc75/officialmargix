import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Percent, Tag, TrendingUp, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const ProfitOverview = () => {
  const metrics = [
    {
      label: "Gross Sales",
      value: "$12,480",
      icon: DollarSign,
      color: "text-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-foreground",
    },
    {
      label: "Platform Fees",
      value: "-$3,220",
      icon: Percent,
      color: "text-red-600",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Promo Discounts",
      value: "-$1,840",
      icon: Tag,
      color: "text-red-600",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Net Profit",
      value: "$7,420",
      icon: TrendingUp,
      color: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      isHighlighted: true,
    },
  ];

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-foreground">Profit Overview</h2>
        <Link to="/uploads-pos">
          <Button 
            variant="outline" 
            className="h-10 sm:h-11 px-4 sm:px-5 bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 shadow-md backdrop-blur-sm rounded-xl hover:bg-white gap-2"
          >
            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Uploads & POS</span>
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.label} 
            className={`backdrop-blur-xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 ${
              metric.isHighlighted 
                ? 'ring-2 ring-emerald-500/50 bg-gradient-to-br from-emerald-50/80 to-white/80' 
                : 'bg-white/70'
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className={`w-10 h-10 rounded-xl ${metric.iconBg} flex items-center justify-center shadow-sm`}
                >
                  <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
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
