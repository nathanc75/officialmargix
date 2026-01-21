import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronRight, TrendingUp, XCircle, Calendar } from "lucide-react";

const AIRecommendations = () => {
  const recommendations = [
    {
      icon: TrendingUp,
      action: "Increase Chicken Bowl price by $1.50",
      reason: "Currently underpriced relative to competitors",
      impact: "+$180/week estimated",
    },
    {
      icon: XCircle,
      action: "Disable Uber Eats promo 'SAVE20'",
      reason: "Promo is costing more than revenue generated",
      impact: "+$110/week savings",
    },
    {
      icon: Calendar,
      action: "Remove BOGO promo on weekends",
      reason: "Weekend demand is already high without promos",
      impact: "+$85/week savings",
    },
  ];

  return (
    <Card 
      className="backdrop-blur-xl border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_60px_-15px_hsl(221,83%,53%,0.2)] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, hsl(var(--hero-gradient-start) / 0.6) 0%, hsl(var(--hero-gradient-end) / 0.4) 100%)' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: `
                radial-gradient(12px 12px at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
                linear-gradient(135deg, rgba(60,120,255,0.95), rgba(130,80,255,0.80))
              `,
              boxShadow: '0 10px 25px rgba(46,108,255,0.22)'
            }}
          >
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-base font-semibold">AI Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className="p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-white/30 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <rec.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground mb-1">{rec.action}</p>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  {rec.impact}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
