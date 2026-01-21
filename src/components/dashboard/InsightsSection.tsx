import { useState } from "react";
import { AlertTriangle, TrendingDown, Percent, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
      <div className="rounded-xl border border-red-200/50 bg-gradient-to-r from-red-50/80 to-amber-50/50 backdrop-blur-sm overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-foreground">
                  {criticalCount} Critical Issues Found
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  Click to {isOpen ? 'collapse' : 'expand'}
                </span>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-1 space-y-2">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  insight.severity === 'high' 
                    ? 'bg-red-100/60' 
                    : 'bg-amber-100/60'
                }`}
              >
                <insight.icon className={`h-4 w-4 flex-shrink-0 ${
                  insight.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                }`} />
                <p className="text-sm text-foreground">{insight.title}</p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default InsightsSection;
