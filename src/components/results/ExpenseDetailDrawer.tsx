import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { 
  Clock, 
  DollarSign, 
  ArrowLeft,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import type { ExpenseItem } from "@/context/AnalysisContext";

interface ExpenseDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryLabel: string;
  expenses: ExpenseItem[];
  totalAmount: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getSeverityDetails = (severity: string): { label: string; color: string; bgColor: string; borderColor: string } => {
  switch (severity) {
    case "high":
      return { label: "Urgent", color: "text-destructive", bgColor: "bg-destructive/10", borderColor: "border-destructive/20" };
    case "medium":
      return { label: "Due Soon", color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" };
    default:
      return { label: "Low Priority", color: "text-slate-600", bgColor: "bg-slate-50", borderColor: "border-slate-200" };
  }
};

export function ExpenseDetailDrawer({ 
  open, 
  onOpenChange, 
  categoryLabel, 
  expenses, 
  totalAmount 
}: ExpenseDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg overflow-y-auto bg-background border-l border-border/40"
      >
        <SheetHeader className="space-y-4 pb-6 border-b border-border/40">
          {/* Mobile Back Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Back to results</span>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1 flex-1">
              <SheetTitle className="text-xl font-semibold text-foreground leading-tight">
                {categoryLabel}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {expenses.length} expense{expenses.length !== 1 ? 's' : ''} totaling{' '}
                <span className="font-semibold text-amber-700">{formatCurrency(totalAmount)}</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-4">
          {expenses.map((expense, index) => {
            const severity = getSeverityDetails(expense.severity);
            
            return (
              <Card 
                key={expense.id} 
                className="border-border/40 shadow-soft overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Header with amount and severity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {expense.vendor && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                          <Building className="w-3.5 h-3.5" />
                          {expense.vendor}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-amber-700 tabular-nums">
                          {formatCurrency(expense.amount)}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`${severity.bgColor} ${severity.color} ${severity.borderColor}`}
                        >
                          {severity.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Due date info */}
                  {expense.dueDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due:</span>
                      <span className="font-medium text-foreground">
                        {new Date(expense.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      {expense.daysOverdue && expense.daysOverdue > 0 && (
                        <Badge variant="outline" className="text-destructive bg-destructive/5 border-destructive/20 text-xs">
                          {expense.daysOverdue} days overdue
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      What's happening
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {expense.description}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      What to do
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {expense.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total amount due</span>
            <span className="font-bold text-amber-700 text-lg">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
