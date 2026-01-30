import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  Code2,
  ArrowRight
} from "lucide-react";

interface LeakItem {
  id?: string;
  type: string;
  description: string;
  amount: number;
  severity: "high" | "medium" | "low";
  date?: string;
  recommendation?: string;
  confidence?: number;
  crossValidated?: boolean;
  modelSource?: string;
  technicalDetails?: string;
}

interface LeakDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryLabel: string;
  leaks: LeakItem[];
  totalAmount: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getSeverityInfo = (severity: string) => {
  switch (severity) {
    case "high": return { label: "High Risk", className: "text-destructive bg-destructive/10 border-destructive/20", icon: "🔴" };
    case "medium": return { label: "Medium Risk", className: "text-amber-600 bg-amber-500/10 border-amber-500/20", icon: "🟡" };
    case "low": return { label: "Low Risk", className: "text-green-600 bg-green-500/10 border-green-500/20", icon: "🟢" };
    default: return { label: "Unknown", className: "text-muted-foreground bg-secondary", icon: "⚪" };
  }
};

export function LeakDetailDrawer({ 
  open, 
  onOpenChange, 
  categoryLabel, 
  leaks,
  totalAmount 
}: LeakDetailDrawerProps) {
  const [expandedTechnical, setExpandedTechnical] = useState<Set<string>>(new Set());

  const toggleTechnical = (id: string) => {
    setExpandedTechnical(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const avgConfidence = leaks.length > 0 
    ? leaks.reduce((sum, l) => sum + (l.confidence || 0.7), 0) / leaks.length 
    : 0;

  const highestSeverity = leaks.some(l => l.severity === "high") 
    ? "high" 
    : leaks.some(l => l.severity === "medium") 
      ? "medium" 
      : "low";

  const severityInfo = getSeverityInfo(highestSeverity);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-primary" />
            {categoryLabel}
          </SheetTitle>
        </SheetHeader>

        {/* Impact Summary */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-1">
                  <DollarSign className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-xl font-bold text-destructive">{formatCurrency(totalAmount)}</p>
                <p className="text-xs text-muted-foreground">Potential Loss</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <span className="text-lg">{severityInfo.icon}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{severityInfo.label}</p>
                <p className="text-xs text-muted-foreground">Risk Level</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-1">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground">{Math.round(avgConfidence * 100)}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Issues */}
        <div className="space-y-4">
          {leaks.map((leak, index) => {
            const leakId = leak.id || `leak-${index}`;
            const isExpanded = expandedTechnical.has(leakId);
            const itemSeverity = getSeverityInfo(leak.severity);

            return (
              <Card key={leakId} className="border-border/60">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className={itemSeverity.className}>
                          {leak.severity}
                        </Badge>
                        {leak.crossValidated && (
                          <Badge variant="outline" className="text-green-600 border-green-600/20 gap-1 text-xs">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                        {leak.date && (
                          <span className="text-xs text-muted-foreground">{leak.date}</span>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-destructive shrink-0">
                      {formatCurrency(leak.amount)}
                    </p>
                  </div>

                  {/* Plain-English Explanation */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-1">What's happening</h4>
                    <p className="text-sm text-muted-foreground">{leak.description}</p>
                  </div>

                  {/* Recommended Actions */}
                  {leak.recommendation && (
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        What to do
                      </h4>
                      <ul className="space-y-1.5">
                        {leak.recommendation.split(/[.;]/).filter(Boolean).map((step, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 text-primary mt-1 shrink-0" />
                            <span>{step.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Layer 3: Technical Details (Collapsed) */}
                  <Collapsible open={isExpanded} onOpenChange={() => toggleTechnical(leakId)}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-3 gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Code2 className="h-3 w-3" />
                        Show Technical Details
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3 ml-auto" />
                        ) : (
                          <ChevronDown className="h-3 w-3 ml-auto" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <div className="space-y-3 text-xs font-mono">
                          {leak.modelSource && (
                            <div>
                              <p className="text-muted-foreground mb-1">Detection Source:</p>
                              <p className="text-foreground">
                                {leak.modelSource === "both" 
                                  ? "Cross-validated by Gemini + GPT" 
                                  : leak.modelSource === "gemini" 
                                    ? "Detected by Gemini" 
                                    : "Detected by GPT"}
                              </p>
                            </div>
                          )}
                          {leak.confidence && (
                            <div>
                              <p className="text-muted-foreground mb-1">Confidence Score:</p>
                              <p className="text-foreground">{Math.round(leak.confidence * 100)}%</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground mb-1">Detection Method:</p>
                            <p className="text-foreground">
                              Pattern matching against transaction records, cross-referenced with historical data.
                            </p>
                          </div>
                          {leak.technicalDetails && (
                            <div>
                              <p className="text-muted-foreground mb-1">Additional Notes:</p>
                              <p className="text-foreground">{leak.technicalDetails}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
