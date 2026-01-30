import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye } from "lucide-react";

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
  if (confidence >= 0.8) return { label: "High", className: "text-green-600 bg-green-500/10 border-green-500/20" };
  if (confidence >= 0.5) return { label: "Medium", className: "text-amber-600 bg-amber-500/10 border-amber-500/20" };
  return { label: "Low", className: "text-muted-foreground bg-secondary border-border" };
};

const getSeverityLabel = (severity: string): { label: string; className: string } => {
  switch (severity) {
    case "high": return { label: "High", className: "text-destructive bg-destructive/10 border-destructive/20" };
    case "medium": return { label: "Medium", className: "text-amber-600 bg-amber-500/10 border-amber-500/20" };
    case "low": return { label: "Low", className: "text-green-600 bg-green-500/10 border-green-500/20" };
    default: return { label: "Unknown", className: "text-muted-foreground bg-secondary" };
  }
};

export function LeakCategoryTable({ categories, onViewDetails }: LeakCategoryTableProps) {
  if (categories.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg font-medium text-foreground">No leaks detected</p>
          <p className="text-sm text-muted-foreground mt-1">Your financial documents look clean!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Where You're Losing Money
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Issue</TableHead>
                <TableHead className="font-semibold text-right">Potential Impact</TableHead>
                <TableHead className="font-semibold text-center">Confidence</TableHead>
                <TableHead className="font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const confidence = getConfidenceLabel(category.confidence);
                return (
                  <TableRow 
                    key={category.type}
                    className="cursor-pointer hover:bg-secondary/50"
                    onClick={() => onViewDetails(category.type)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{category.label}</span>
                        {category.count > 1 && (
                          <Badge variant="secondary" className="text-[10px] h-5">
                            {category.count} issues
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-destructive">
                        {formatCurrency(category.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={confidence.className}>
                        {confidence.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1.5 text-primary hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(category.type);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {categories.map((category) => {
            const confidence = getConfidenceLabel(category.confidence);
            return (
              <div 
                key={category.type}
                className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => onViewDetails(category.type)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-foreground">{category.label}</span>
                      {category.count > 1 && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {category.count}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className={`${confidence.className} text-[10px]`}>
                      {confidence.label} Confidence
                    </Badge>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-destructive">
                      {formatCurrency(category.totalAmount)}
                    </p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs text-primary"
                    >
                      View Details →
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
