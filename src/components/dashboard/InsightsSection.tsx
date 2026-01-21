import { useState } from "react";
import { AlertTriangle, TrendingDown, Percent, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const InsightsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  
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

  const criticalCount = insights.filter(i => i.severity === 'high').length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-4 border-red-500/20 bg-red-500/5 overflow-hidden shadow-xl">
        <CollapsibleTrigger asChild>
          <button className="w-full px-8 py-8 flex items-center justify-between hover:bg-red-500/10 transition-colors">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border-4 border-red-500/20 shadow-inner">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-red-900 dark:text-red-100 flex items-center gap-4 tracking-tight">
                  {criticalCount} Critical Revenue Insights
                  <Badge variant="destructive" className="h-8 px-4 text-xs uppercase font-black tracking-widest border-2">Action Required</Badge>
                </h3>
                <p className="text-lg text-red-700/80 dark:text-red-300/80 font-bold uppercase tracking-wide">
                  Addressable revenue recovery: <span className="font-black text-red-700 dark:text-red-300 text-3xl ml-2 tracking-tighter">$2,145.00</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-base font-black text-red-700 dark:text-red-300 uppercase tracking-widest mr-2">
                {isOpen ? 'Collapse Details' : 'View All Insights'}
              </span>
              {isOpen ? (
                <ChevronUp className="h-8 w-8 text-red-600" />
              ) : (
                <ChevronDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-8 pb-8 space-y-6">
            <div className="h-1 bg-red-500/10 mb-6 rounded-full" />
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-6 rounded-2xl border-2 ${
                  insight.severity === 'high' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-amber-500/10 border-amber-500/20'
                } shadow-md transition-all hover:scale-[1.01] hover:shadow-lg`}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-xl ${
                    insight.severity === 'high' ? 'bg-red-500/20' : 'bg-amber-500/20'
                  } border-2 shadow-inner`}>
                    <insight.icon className={`h-8 w-8 ${
                      insight.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <p className="text-xl font-black text-foreground tracking-tight">{insight.title}</p>
                </div>
                <Button variant="outline" size="lg" className="h-12 px-8 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-background border-2 shadow-sm">
                  Full Analysis
                </Button>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default InsightsSection;
