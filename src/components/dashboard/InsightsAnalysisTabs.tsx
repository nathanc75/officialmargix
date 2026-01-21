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
    <Card className="border shadow-md bg-card overflow-hidden">
      <Tabs defaultValue="promos" className="w-full">
        <CardHeader className="p-0 border-b bg-muted/30">
          <TabsList className="w-full justify-start h-14 bg-transparent p-0 rounded-none">
            <TabsTrigger 
              value="promos" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-14 px-8 text-sm font-bold uppercase tracking-widest"
            >
              Promo Performance
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-14 px-8 text-sm font-bold uppercase tracking-widest gap-3"
            >
              <Lightbulb className="h-4 w-4" />
              AI Suggestions
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-8">
          <TabsContent value="promos" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {promos.map((promo) => (
                <div 
                  key={promo.name} 
                  className={`p-6 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                    promo.profitable 
                      ? 'bg-emerald-500/[0.04] border-emerald-500/10' 
                      : 'bg-red-500/[0.04] border-red-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1.5">
                      <p className="font-bold text-base uppercase tracking-tight">{promo.name}</p>
                      <Badge variant="outline" className="text-xs font-bold uppercase border-0 bg-muted px-2 py-0.5 tracking-wider">
                        {promo.platform}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1.5 font-bold text-base ${
                      promo.profitable ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {promo.profitable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {promo.impact}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Cost</p>
                      <p className="text-base font-bold text-foreground">{promo.cost}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Revenue</p>
                      <p className="text-base font-bold text-foreground">{promo.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border shadow-sm">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-100 leading-relaxed">
                  <strong>Revenue Alert:</strong> 2 promos are underperforming, resulting in <span className="font-bold text-red-600 text-base">$250/week</span> in addressable revenue losses.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0 space-y-5">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-5 rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border shadow-inner">
                        <rec.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-bold text-base leading-none tracking-tight">{rec.action}</p>
                        <p className="text-sm text-muted-foreground font-bold leading-relaxed">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold text-xs uppercase h-8 px-4 tracking-widest shadow-sm">
                        {rec.impact}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all border shadow-sm">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10 border shadow-sm">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground leading-relaxed">
                  <strong>Recovery Target:</strong> Implementing these AI strategy suggestions could recover <span className="font-bold text-primary text-base">+$375/week</span> in net profit margin.
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
