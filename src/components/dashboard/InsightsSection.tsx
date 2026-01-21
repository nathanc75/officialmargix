import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, Percent } from "lucide-react";

const InsightsSection = () => {
  const insights = [
    {
      icon: TrendingDown,
      title: "Promo codes reduced your profit by $1,840 this period",
      severity: "high",
    },
    {
      icon: AlertTriangle,
      title: "6 menu items are being sold at a loss",
      severity: "high",
    },
    {
      icon: Percent,
      title: "Uber Eats fees are 12% higher than DoorDash",
      severity: "medium",
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Where You're Losing Money</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card 
            key={index} 
            className={`border-l-4 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 ${
              insight.severity === 'high' 
                ? 'border-l-red-500 bg-gradient-to-br from-red-50/80 to-white/80' 
                : 'border-l-amber-500 bg-gradient-to-br from-amber-50/80 to-white/80'
            }`}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                insight.severity === 'high' ? 'bg-red-100' : 'bg-amber-100'
              }`}>
                <insight.icon className={`h-4 w-4 ${
                  insight.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                }`} />
              </div>
              <p className="text-sm font-medium text-foreground leading-tight">{insight.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default InsightsSection;
