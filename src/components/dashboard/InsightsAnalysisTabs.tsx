import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Lightbulb, ChevronRight, XCircle, Calendar } from "lucide-react";

const InsightsAnalysisTabs = () => {
  const promos = [
    { name: "SAVE20", cost: "$620", revenue: "$890", impact: "+$270", profitable: true, platform: "Uber Eats" },
    { name: "BOGO Friday", cost: "$420", revenue: "$310", impact: "-$110", profitable: false, platform: "DoorDash" },
    { name: "Free Delivery", cost: "$380", revenue: "$520", impact: "+$140", profitable: true, platform: "Uber Eats" },
    { name: "15% Off First Order", cost: "$420", revenue: "$280", impact: "-$140", profitable: false, platform: "DoorDash" },
  ];

  const recommendations = [
    { icon: TrendingUp, action: "Increase Chicken Bowl price by $1.50", reason: "Currently underpriced relative to competitors", impact: "+$180/week" },
    { icon: XCircle, action: "Disable Uber Eats promo 'SAVE20'", reason: "Promo is costing more than revenue generated", impact: "+$110/week" },
    { icon: Calendar, action: "Remove BOGO promo on weekends", reason: "Weekend demand is already high without promos", impact: "+$85/week" },
  ];

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      <Tabs defaultValue="promos" className="w-full">
        <CardHeader className="pb-2">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/40">
            <TabsTrigger value="promos" className="text-xs sm:text-sm data-[state=active]:bg-white">
              Promo Performance
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm data-[state=active]:bg-white gap-1">
              <Lightbulb className="h-3 w-3" />
              AI Suggestions
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="pt-2">
          <TabsContent value="promos" className="mt-0 space-y-2">
            {promos.map((promo) => (
              <div 
                key={promo.name} 
                className={`p-3 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  promo.profitable 
                    ? 'bg-gradient-to-r from-emerald-50/80 to-white/60 border-emerald-200/50' 
                    : 'bg-gradient-to-r from-red-50/80 to-white/60 border-red-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{promo.name}</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-white/50">
                      {promo.platform}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-1 font-semibold text-sm ${
                    promo.profitable ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {promo.profitable ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {promo.impact}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Cost: {promo.cost}</span>
                  <span>Revenue: {promo.revenue}</span>
                </div>
              </div>
            ))}
            
            <div className="mt-3 p-2.5 rounded-lg bg-gradient-to-r from-amber-50/80 to-white/60 border border-amber-200/50">
              <p className="text-xs text-amber-800">
                <strong>Insight:</strong> 2 promos are costing you $250/week in losses.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0 space-y-2">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-white/30 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <rec.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground mb-0.5">{rec.action}</p>
                      <p className="text-xs text-muted-foreground">{rec.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50/80 px-2 py-1 rounded-md">
                      {rec.impact}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-3 p-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-white/60 border border-primary/20">
              <p className="text-xs text-foreground">
                <strong>Potential savings:</strong> +$375/week if all suggestions are applied.
              </p>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default InsightsAnalysisTabs;
