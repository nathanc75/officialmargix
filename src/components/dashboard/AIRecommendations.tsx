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
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">AI Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className="p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <rec.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground mb-1">{rec.action}</p>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
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
