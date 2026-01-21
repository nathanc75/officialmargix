import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Card className="border shadow-sm bg-card overflow-hidden">
      <Tabs defaultValue="promos" className="w-full">
        <CardHeader className="p-0 border-b bg-muted/30">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none">
            <TabsTrigger 
              value="promos" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 text-xs font-bold uppercase tracking-wider"
            >
              Promo Performance
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 text-xs font-bold uppercase tracking-wider gap-2"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              AI Suggestions
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-6">
          <TabsContent value="promos" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promos.map((promo) => (
                <div 
                  key={promo.name} 
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    promo.profitable 
                      ? 'bg-emerald-500/[0.03] border-emerald-500/10' 
                      : 'bg-red-500/[0.03] border-red-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <p className="font-bold text-sm">{promo.name}</p>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase border-0 bg-muted/50 px-1.5">
                        {promo.platform}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 font-bold text-sm ${
                      promo.profitable ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {promo.profitable ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {promo.impact}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Cost</p>
                      <p className="text-xs font-semibold">{promo.cost}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Revenue</p>
                      <p className="text-xs font-semibold">{promo.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                  <strong>Revenue Alert:</strong> 2 promos are underperforming, resulting in <span className="font-bold text-red-600">$250/week</span> in addressable losses.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0 space-y-4">
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border">
                        <rec.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm leading-none">{rec.action}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[10px] uppercase h-6">
                        {rec.impact}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  <strong>Recovery Target:</strong> Implementing these suggestions could recover <span className="font-bold text-primary">+$375/week</span> in pure profit.
                </p>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default InsightsAnalysisTabs;
