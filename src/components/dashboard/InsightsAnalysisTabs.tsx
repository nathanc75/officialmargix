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
          <TabsList className="w-full justify-start h-16 bg-transparent p-0 rounded-none">
            <TabsTrigger 
              value="promos" 
              className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-16 px-10 text-sm font-black uppercase tracking-widest"
            >
              Promo Performance
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-16 px-10 text-sm font-black uppercase tracking-widest gap-3"
            >
              <Lightbulb className="h-5 w-5" />
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
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    promo.profitable 
                      ? 'bg-emerald-500/[0.04] border-emerald-500/10' 
                      : 'bg-red-500/[0.04] border-red-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="space-y-1.5">
                      <p className="font-black text-lg">{promo.name}</p>
                      <Badge variant="outline" className="text-xs font-black uppercase border-2 bg-muted px-2.5 py-0.5 tracking-wider">
                        {promo.platform}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-2 font-black text-lg ${
                      promo.profitable ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {promo.profitable ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      {promo.impact}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-5 border-t-2 border-dashed">
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Promo Cost</p>
                      <p className="text-base font-black text-foreground">{promo.cost}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Direct Revenue</p>
                      <p className="text-base font-black text-foreground">{promo.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 rounded-2xl bg-amber-500/5 border-2 border-amber-500/10 shadow-inner">
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-xl bg-amber-500/10 border shadow-sm">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-base font-bold text-amber-900 dark:text-amber-100 leading-relaxed">
                  <strong className="uppercase tracking-wide">Optimization Opportunity:</strong> 2 promos are underperforming, resulting in <span className="font-black text-red-600 text-lg">$250/week</span> in addressable revenue losses.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0 space-y-5">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl bg-card border-2 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 border-2 shadow-inner">
                        <rec.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-black text-lg leading-tight">{rec.action}</p>
                        <p className="text-base text-muted-foreground font-semibold leading-relaxed">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 font-black text-sm uppercase h-10 px-4 tracking-widest">
                        {rec.impact}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all border-2 shadow-sm">
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 rounded-2xl bg-primary/5 border-2 border-primary/10 shadow-inner">
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-xl bg-primary/10 border shadow-sm">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <p className="text-base font-bold text-foreground leading-relaxed">
                  <strong className="uppercase tracking-wide">Recovery Potential:</strong> Implementing these AI suggestions could recover an estimated <span className="font-black text-primary text-xl">+$375/week</span> in pure margin.
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
