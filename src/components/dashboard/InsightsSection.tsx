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
      <Card className="border-red-500/20 bg-red-500/5 overflow-hidden shadow-sm">
        <CollapsibleTrigger asChild>
          <button className="w-full px-6 py-6 flex items-center justify-between hover:bg-red-500/10 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-inner">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-red-900 dark:text-red-100 flex items-center gap-3">
                  {criticalCount} Critical Revenue Insights
                  <Badge variant="destructive" className="h-6 px-3 text-xs uppercase font-black tracking-widest">Action Required</Badge>
                </h3>
                <p className="text-base text-red-700/80 dark:text-red-300/80 font-medium">
                  Addressable revenue recovery: <span className="font-black text-red-700 dark:text-red-300 text-lg">$2,145.00</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-red-700 dark:text-red-300 uppercase tracking-widest">
                {isOpen ? 'Collapse' : 'Expand All'}
              </span>
              {isOpen ? (
                <ChevronUp className="h-6 w-6 text-red-600" />
              ) : (
                <ChevronDown className="h-6 w-6 text-red-600" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4">
            <div className="h-px bg-red-500/10 mb-4" />
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                  insight.severity === 'high' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-amber-500/10 border-amber-500/20'
                } shadow-sm transition-transform hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${
                    insight.severity === 'high' ? 'bg-red-500/20' : 'bg-amber-500/20'
                  } border shadow-inner`}>
                    <insight.icon className={`h-6 w-6 ${
                      insight.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <p className="text-base font-bold text-foreground">{insight.title}</p>
                </div>
                <Button variant="outline" size="sm" className="h-10 px-6 text-xs uppercase font-black text-muted-foreground hover:text-foreground hover:bg-background border-2 shadow-sm">
                  View Analysis
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
