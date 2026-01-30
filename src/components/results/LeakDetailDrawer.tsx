import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  Code2,
  Lightbulb,
  AlertTriangle,
  Gauge
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
    case "high": return { label: "High", className: "text-red-700 bg-red-50 border-red-200" };
    case "medium": return { label: "Medium", className: "text-amber-700 bg-amber-50 border-amber-200" };
    case "low": return { label: "Low", className: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    default: return { label: "Unknown", className: "text-slate-600 bg-slate-50 border-slate-200" };
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
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/40">
          <SheetHeader className="px-6 py-5">
            <SheetTitle className="text-xl font-semibold tracking-tight">
              {categoryLabel}
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              {leaks.length} issue{leaks.length !== 1 ? 's' : ''} found in this category
            </SheetDescription>
          </SheetHeader>

          {/* Impact Summary Bar */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive tabular-nums">
                    {formatCurrency(totalAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total potential loss</p>
                </div>
              </div>
              
              <Separator orientation="vertical" className="h-10" />
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className={`${severityInfo.className} text-xs`}>
                    {severityInfo.label}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">Risk</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{Math.round(avgConfidence * 100)}%</p>
                  <p className="text-[10px] text-muted-foreground">Confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="px-6 py-4 space-y-4">
          {leaks.map((leak, index) => {
            const leakId = leak.id || `leak-${index}`;
            const isExpanded = expandedTechnical.has(leakId);
            const itemSeverity = getSeverityInfo(leak.severity);

            return (
              <Card 
                key={leakId} 
                className="border-border/40 shadow-soft overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CardContent className="p-0">
                  {/* Issue Header */}
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted/20">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`${itemSeverity.className} capitalize`}>
                        {leak.severity}
                      </Badge>
                      {leak.crossValidated && (
                        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      {leak.date && (
                        <span className="text-xs text-muted-foreground">{leak.date}</span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-destructive shrink-0 tabular-nums">
                      {formatCurrency(leak.amount)}
                    </p>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* What's happening */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        What's happening
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">{leak.description}</p>
                    </div>

                    {/* Recommended Actions */}
                    {leak.recommendation && (
                      <div className="p-4 rounded-lg bg-primary/[0.03] border border-primary/10">
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                          {leak.recommendation.split(/[.;]/).filter(s => s.trim()).map((step, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-sm text-foreground">{step.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technical Details (Collapsed) */}
                    <Collapsible open={isExpanded} onOpenChange={() => toggleTechnical(leakId)}>
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-muted/50 h-9"
                        >
                          <span className="flex items-center gap-1.5 text-xs">
                            <Code2 className="h-3.5 w-3.5" />
                            Technical Details
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 p-4 rounded-lg bg-muted/30 border border-border/40">
                          <dl className="space-y-3 text-xs">
                            {leak.modelSource && (
                              <div>
                                <dt className="text-muted-foreground font-medium mb-0.5">Detection Source</dt>
                                <dd className="text-foreground font-mono">
                                  {leak.modelSource === "both" 
                                    ? "Cross-validated (Gemini + GPT)" 
                                    : leak.modelSource === "gemini" 
                                      ? "Gemini AI" 
                                      : "GPT AI"}
                                </dd>
                              </div>
                            )}
                            {leak.confidence && (
                              <div>
                                <dt className="text-muted-foreground font-medium mb-0.5">Confidence Score</dt>
                                <dd className="text-foreground font-mono">{Math.round(leak.confidence * 100)}%</dd>
                              </div>
                            )}
                            <div>
                              <dt className="text-muted-foreground font-medium mb-0.5">Detection Method</dt>
                              <dd className="text-foreground font-mono">
                                Pattern matching with historical cross-reference
                              </dd>
                            </div>
                            {leak.technicalDetails && (
                              <div>
                                <dt className="text-muted-foreground font-medium mb-0.5">Notes</dt>
                                <dd className="text-foreground font-mono">{leak.technicalDetails}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
