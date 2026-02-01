import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  ChevronRight, 
  Clock,
  RefreshCw,
  Zap,
  Building,
  FileText,
  Receipt
} from "lucide-react";
import type { ExpenseItem } from "@/context/AnalysisContext";

interface ExpenseCategory {
  type: string;
  label: string;
  totalAmount: number;
  count: number;
  severity: "high" | "medium" | "low";
  expenses: ExpenseItem[];
}

interface ExpenseCategoryTableProps {
  categories: ExpenseCategory[];
  onViewDetails: (type: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getSeverityLabel = (severity: string): { label: string; className: string } => {
  switch (severity) {
    case "high": return { label: "Urgent", className: "text-destructive bg-destructive/10 border-destructive/20" };
    case "medium": return { label: "Soon", className: "text-amber-700 bg-amber-50 border-amber-200" };
    default: return { label: "Low Priority", className: "text-slate-600 bg-slate-50 border-slate-200" };
  }
};

const getExpenseTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    subscription: "Subscription Payments Due",
    vendor_bill: "Vendor Invoices Due",
    utility: "Utility Bills Due",
    rent: "Rent Payments Due",
    other: "Other Expenses Due",
  };
  return labels[type] || type;
};

const getExpenseIcon = (type: string) => {
  switch (type) {
    case "subscription": return <RefreshCw className="h-4 w-4" />;
    case "vendor_bill": return <FileText className="h-4 w-4" />;
    case "utility": return <Zap className="h-4 w-4" />;
    case "rent": return <Building className="h-4 w-4" />;
    default: return <Receipt className="h-4 w-4" />;
  }
};

export function ExpenseCategoryTable({ categories, onViewDetails }: ExpenseCategoryTableProps) {
  if (categories.length === 0) {
    return (
      <Card className="border-border/40 shadow-soft animate-fade-in">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">All caught up!</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            No overdue expenses detected. Your bills are in good standing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/30 to-transparent shadow-soft overflow-hidden animate-fade-in">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-amber-200/40 bg-amber-50/50">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600" />
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Bills That Need Attention
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Expenses that are overdue or coming up soon
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-amber-200/40">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-6">Expense Type</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Amount Due</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Priority</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => {
              const severity = getSeverityLabel(category.severity);
              const Icon = getExpenseIcon(category.type);
              return (
                <TableRow 
                  key={category.type}
                  className="group cursor-pointer hover:bg-amber-50/50 transition-colors border-amber-200/40"
                  onClick={() => onViewDetails(category.type)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:bg-amber-200/70 transition-colors">
                        {Icon}
                      </div>
                      <div>
                        <span className="font-medium text-foreground block">{category.label}</span>
                        {category.count > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {category.count} bills
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <span className="text-lg font-semibold text-amber-700 tabular-nums">
                      {formatCurrency(category.totalAmount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Badge variant="outline" className={`${severity.className} font-medium`}>
                      {severity.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-amber-700 hover:text-amber-800 hover:bg-amber-100 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(category.type);
                      }}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-amber-200/40">
        {categories.map((category, index) => {
          const severity = getSeverityLabel(category.severity);
          const Icon = getExpenseIcon(category.type);
          return (
            <div 
              key={category.type}
              className="p-4 hover:bg-amber-50/50 transition-colors cursor-pointer active:bg-amber-100/50"
              onClick={() => onViewDetails(category.type)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  {Icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-medium text-foreground truncate">{category.label}</span>
                    <span className="text-base font-semibold text-amber-700 tabular-nums shrink-0">
                      {formatCurrency(category.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {category.count > 1 && (
                      <span className="text-xs text-muted-foreground">
                        {category.count} bills
                      </span>
                    )}
                    <Badge variant="outline" className={`${severity.className} text-[10px] h-5`}>
                      {severity.label}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export { getExpenseTypeLabel };
