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
    <Card className="border-2 shadow-xl bg-card overflow-hidden">
      <Tabs defaultValue="promos" className="w-full">
        <CardHeader className="p-0 border-b-2 bg-muted/30">
          <TabsList className="w-full justify-start h-20 bg-transparent p-0 rounded-none">
            <TabsTrigger 
              value="promos" 
              className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-20 px-12 text-base font-black uppercase tracking-[0.2em]"
            >
              Promo Performance
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-20 px-12 text-base font-black uppercase tracking-[0.2em] gap-4"
            >
              <Lightbulb className="h-6 w-6" />
              AI Strategy
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-10">
          <TabsContent value="promos" className="mt-0 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {promos.map((promo) => (
                <div 
                  key={promo.name} 
                  className={`p-8 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    promo.profitable 
                      ? 'bg-emerald-500/[0.04] border-emerald-500/10' 
                      : 'bg-red-500/[0.04] border-red-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                      <p className="font-black text-2xl tracking-tight">{promo.name}</p>
                      <Badge variant="outline" className="text-xs font-black uppercase border-2 bg-muted px-3 py-1 tracking-widest">
                        {promo.platform}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-3 font-black text-2xl tracking-tighter ${
                      promo.profitable ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {promo.profitable ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                      {promo.impact}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10 pt-8 border-t-2 border-dashed">
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Campaign Cost</p>
                      <p className="text-xl font-black text-foreground tracking-tight">{promo.cost}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Gross Attribution</p>
                      <p className="text-xl font-black text-foreground tracking-tight">{promo.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 rounded-3xl bg-amber-500/5 border-2 border-amber-500/10 shadow-inner">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-amber-500/10 border-2 shadow-sm">
                  <Lightbulb className="h-8 w-8 text-amber-600" />
                </div>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-100 leading-relaxed">
                  <strong className="uppercase tracking-widest block text-xs mb-1 opacity-70">Optimization Alert</strong>
                  2 promotions are negatively impacting margins, leaking <span className="font-black text-red-600 text-2xl tracking-tighter">$250/week</span> in addressable profit.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0 space-y-6">
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-8 rounded-3xl bg-card border-2 shadow-sm hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between gap-10">
                    <div className="flex items-start gap-8">
                      <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center flex-shrink-0 border-2 shadow-inner">
                        <rec.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <p className="font-black text-2xl leading-tight tracking-tight">{rec.action}</p>
                        <p className="text-lg text-muted-foreground font-bold leading-relaxed">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 font-black text-base uppercase h-12 px-6 tracking-widest shadow-sm">
                        {rec.impact}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all border-2 shadow-md">
                        <ChevronRight className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 rounded-3xl bg-primary/5 border-2 border-primary/10 shadow-inner mt-8">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-primary/10 border-2 shadow-sm">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground leading-relaxed">
                  <strong className="uppercase tracking-widest block text-xs mb-1 opacity-70">Recovery Target</strong>
                  Implementing these AI-driven strategies could recover an estimated <span className="font-black text-primary text-3xl tracking-tighter">+$375/week</span> in net profit margin.
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
