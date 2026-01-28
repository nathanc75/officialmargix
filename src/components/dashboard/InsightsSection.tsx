import { useState } from "react";
import { AlertTriangle, CreditCard, Receipt, Repeat, ChevronDown, ChevronUp, DollarSign, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReportAnalysis } from "@/context/AnalysisContext";

interface InsightsSectionProps {
  isTrial?: boolean;
  hasData?: boolean;
  reportAnalysis?: ReportAnalysis | null;
}

const InsightsSection = ({ isTrial = false, hasData = false, reportAnalysis }: InsightsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!hasData || !reportAnalysis?.issues?.length) {
    return null;
  }
  
  const issueTypeToIcon = {
    pricing_error: DollarSign,
    missed_refund: RefreshCw,
    fee_discrepancy: Receipt,
    promo_loss: Repeat,
    duplicate_charge: CreditCard,
    missing_payment: DollarSign,
    unused_subscription: Repeat,
  };

  const insights = reportAnalysis.issues.map(issue => ({
    icon: issueTypeToIcon[issue.type] || AlertTriangle,
    title: issue.description,
    severity: issue.potentialRecovery > 500 ? "high" : "medium",
    recovery: issue.potentialRecovery,
  }));

  const criticalCount = insights.filter(i => i.severity === 'high').length;
  const totalRecovery = insights.reduce((sum, i) => sum + (i.recovery || 0), 0);

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
                  {criticalCount > 0 ? criticalCount : insights.length} Revenue Leak{insights.length !== 1 ? 's' : ''} Detected
                  {criticalCount > 0 && (
                    <Badge variant="destructive" className="h-4 px-1.5 text-[9px] uppercase font-bold shrink-0">Action Required</Badge>
                  )}
                </h3>
                <p className="text-xs text-red-700/70 dark:text-red-300/70">
                  From your uploaded documents — Potential recovery: <span className="font-bold">${totalRecovery.toLocaleString()}</span>
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
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{insight.title}</p>
                    {insight.recovery > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Potential recovery: <span className="font-semibold text-emerald-600">${insight.recovery.toLocaleString()}</span>
                      </p>
                    )}
                  </div>
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
