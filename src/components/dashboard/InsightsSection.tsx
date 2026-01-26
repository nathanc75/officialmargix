import { useState } from "react";
import { AlertTriangle, TrendingDown, Percent, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InsightsSectionProps {
  isTrial?: boolean;
  hasData?: boolean;
}

const InsightsSection = ({ isTrial = false, hasData = false }: InsightsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Don't render anything if no data
  if (!hasData) {
    return null;
  }
  
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
          <button className="w-full px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-red-500/10 transition-colors text-left">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-red-900 dark:text-red-100 flex flex-wrap items-center gap-2">
                  {criticalCount} Critical Revenue Insights
                  <Badge variant="destructive" className="h-4 px-1.5 text-[9px] uppercase font-bold shrink-0">Action Required</Badge>
                </h3>
                <p className="text-xs text-red-700/70 dark:text-red-300/70">
                  Found in your uploaded report — Potential recovery: <span className="font-bold">$1,247.00</span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                {isOpen ? 'View Less' : 'View All'}
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-red-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3 ${
                  insight.severity === 'high' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-amber-500/10 border-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md shrink-0 ${
                    insight.severity === 'high' ? 'bg-red-500/20' : 'bg-amber-500/20'
                  }`}>
                    <insight.icon className={`h-4 w-4 ${
                      insight.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <p className="text-sm font-medium text-foreground leading-tight">{insight.title}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground self-end sm:self-auto">
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
