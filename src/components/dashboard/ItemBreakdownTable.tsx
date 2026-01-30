import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReportAnalysis } from "@/context/AnalysisContext";

interface ItemBreakdownTableProps {
  isTrial?: boolean;
  hasData?: boolean;
  reportAnalysis?: ReportAnalysis | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const ItemBreakdownTable = ({ isTrial = false, hasData = false, reportAnalysis }: ItemBreakdownTableProps) => {
  const items = reportAnalysis?.items || [];

  if (!hasData) {
    return (
      <Card className="border shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold tracking-tight">Transaction Analysis</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Detailed breakdown of scanned transactions and detected issues</p>
            </div>
          </div>
          
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Transaction Analysis Awaiting Documents</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Once uploaded, AI will break down every transaction, flag anomalies, and surface potential issues automatically.
            </p>
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2" data-testid="button-upload-for-analysis">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card className="border shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold tracking-tight">Transaction Analysis</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Detailed breakdown of scanned transactions</p>
            </div>
          </div>
          
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground">No transaction-level data was extracted from your documents</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold tracking-tight">Transaction Analysis</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {items.length} transactions analyzed from your documents
              {items.some(i => i.isEstimate) && (
                <Badge variant="outline" className="ml-2 text-[9px]">Estimates marked with ~</Badge>
              )}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{item.name}</span>
                      {item.isEstimate && (
                        <span className="text-xs text-muted-foreground">~</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">
                      {item.quantity > 1 ? 'Recurring' : 'One-time'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    {item.isEstimate ? '~' : ''}{formatCurrency(item.revenue)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {item.profit >= 0 ? (
                        <Badge variant="outline" className="gap-1 text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-[10px] text-red-600 border-red-200 bg-red-50 dark:bg-red-950/30">
                          <AlertTriangle className="h-3 w-3" />
                          Flagged
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {items.length > 10 && (
            <div className="p-4 text-center border-t">
              <p className="text-sm text-muted-foreground">
                Showing 10 of {items.length} transactions. <span className="text-primary cursor-pointer hover:underline">View all</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;
