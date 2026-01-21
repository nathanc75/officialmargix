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
      <Card className="border-red-500/20 bg-red-500/5 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full px-5 py-5 flex items-center justify-between hover:bg-red-500/10 transition-colors">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
                  {criticalCount} Critical Revenue Insights
                  <Badge variant="destructive" className="h-5 px-2 text-xs uppercase font-bold">Action Required</Badge>
                </h3>
                <p className="text-sm text-red-700/70 dark:text-red-300/70">
                  Potential revenue recovery: <span className="font-bold text-red-700 dark:text-red-300">$2,145.00</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-red-700 dark:text-red-300">
                {isOpen ? 'View Less' : 'View All'}
              </span>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-red-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-red-600" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            <div className="h-px bg-red-500/10 mb-2" />
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  insight.severity === 'high' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-amber-500/10 border-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${
                    insight.severity === 'high' ? 'bg-red-500/20' : 'bg-amber-500/20'
                  }`}>
                    <insight.icon className={`h-5 w-5 ${
                      insight.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <p className="text-base font-semibold text-foreground">{insight.title}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-9 px-4 text-xs uppercase font-bold text-muted-foreground hover:text-foreground border">
                  View details
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
