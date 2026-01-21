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
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none overflow-x-auto overflow-y-hidden no-scrollbar">
            <TabsTrigger 
              value="promos" 
              className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap"
            >
              Promo Performance
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-2 whitespace-nowrap"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              AI Suggestions
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="promos" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {promos.map((promo) => (
                <div 
                  key={promo.name} 
                  className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    promo.profitable 
                      ? 'bg-emerald-500/[0.03] border-emerald-500/10' 
                      : 'bg-red-500/[0.03] border-red-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <p className="font-bold text-xs sm:text-sm">{promo.name}</p>
                      <Badge variant="outline" className="text-[9px] sm:text-[10px] font-bold uppercase border-0 bg-muted/50 px-1.5 font-medium">
                        {promo.platform}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 font-bold text-xs sm:text-sm ${
                      promo.profitable ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {promo.profitable ? <TrendingUp className="h-3 h-3 sm:h-3.5 sm:w-3.5" /> : <TrendingDown className="h-3 h-3 sm:h-3.5 sm:w-3.5" />}
                      {promo.impact}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Cost</p>
                      <p className="text-xs font-semibold">{promo.cost}</p>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Revenue</p>
                      <p className="text-xs font-semibold">{promo.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 sm:p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 shrink-0">
                  <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-amber-900 dark:text-amber-100 font-medium leading-relaxed">
                  <strong>Revenue Alert:</strong> 2 promos are underperforming, resulting in <span className="font-bold text-red-600">$250/week</span> in addressable losses.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0 space-y-3 sm:space-y-4">
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border">
                        <rec.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="font-bold text-xs sm:text-sm leading-tight tracking-tight">{rec.action}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed font-medium">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-3 mt-1 sm:mt-0">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[9px] sm:text-[10px] uppercase h-5 sm:h-6 font-medium">
                        {rec.impact}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-foreground font-medium leading-relaxed">
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
