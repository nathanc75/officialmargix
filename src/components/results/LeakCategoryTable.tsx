import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  ChevronRight, 
  CreditCard, 
  RefreshCw, 
  AlertCircle,
  Receipt,
  TrendingDown,
  FileWarning
} from "lucide-react";

interface LeakCategory {
  type: string;
  label: string;
  totalAmount: number;
  count: number;
  severity: "high" | "medium" | "low";
  confidence: number;
}

interface LeakCategoryTableProps {
  categories: LeakCategory[];
  onViewDetails: (type: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getConfidenceLabel = (confidence: number): { label: string; className: string } => {
  if (confidence >= 0.8) return { label: "High", className: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (confidence >= 0.5) return { label: "Medium", className: "text-amber-700 bg-amber-50 border-amber-200" };
  return { label: "Low", className: "text-slate-600 bg-slate-50 border-slate-200" };
};

const getCategoryIcon = (type: string) => {
  switch (type) {
    case "missing_payment": return <CreditCard className="h-4 w-4" />;
    case "duplicate_charge": return <Receipt className="h-4 w-4" />;
    case "unused_subscription": return <RefreshCw className="h-4 w-4" />;
    case "failed_payment": return <AlertCircle className="h-4 w-4" />;
    case "pricing_inefficiency": return <TrendingDown className="h-4 w-4" />;
    case "billing_error": return <FileWarning className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

export function LeakCategoryTable({ categories, onViewDetails }: LeakCategoryTableProps) {
  if (categories.length === 0) {
    return (
      <Card className="border-border/40 shadow-soft animate-fade-in">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No leaks detected</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your financial documents look clean. Keep up the great work!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 shadow-soft overflow-hidden animate-fade-in">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-border/40 bg-muted/30">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Where You're Losing Money
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Click any issue to see details and recommended actions
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/40">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-6">Issue</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Impact</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Confidence</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => {
              const confidence = getConfidenceLabel(category.confidence);
              const Icon = getCategoryIcon(category.type);
              return (
                <TableRow 
                  key={category.type}
                  className="group cursor-pointer hover:bg-primary/[0.02] transition-colors border-border/40"
                  onClick={() => onViewDetails(category.type)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                        {Icon}
                      </div>
                      <div>
                        <span className="font-medium text-foreground block">{category.label}</span>
                        {category.count > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {category.count} instances found
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <span className="text-lg font-semibold text-destructive tabular-nums">
                      {formatCurrency(category.totalAmount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Badge variant="outline" className={`${confidence.className} font-medium`}>
                      {confidence.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-primary hover:text-primary hover:bg-primary/5 font-medium"
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
      <div className="md:hidden divide-y divide-border/40">
        {categories.map((category, index) => {
          const confidence = getConfidenceLabel(category.confidence);
          const Icon = getCategoryIcon(category.type);
          return (
            <div 
              key={category.type}
              className="p-4 hover:bg-primary/[0.02] transition-colors cursor-pointer active:bg-primary/5"
              onClick={() => onViewDetails(category.type)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                  {Icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-medium text-foreground truncate">{category.label}</span>
                    <span className="text-base font-semibold text-destructive tabular-nums shrink-0">
                      {formatCurrency(category.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {category.count > 1 && (
                      <span className="text-xs text-muted-foreground">
                        {category.count} instances
                      </span>
                    )}
                    <Badge variant="outline" className={`${confidence.className} text-[10px] h-5`}>
                      {confidence.label}
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
