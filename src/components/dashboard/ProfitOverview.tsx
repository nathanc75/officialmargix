import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, AlertTriangle, CreditCard, TrendingUp, Upload, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ReportAnalysis } from "@/context/AnalysisContext";

interface ProfitOverviewProps {
  isTrial?: boolean;
  hasData?: boolean;
  reportAnalysis?: ReportAnalysis | null;
}

const formatCurrency = (value: number, isEstimate: boolean = false) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  return isEstimate ? `~${formatted}` : formatted;
};

const ProfitOverview = ({ isTrial = false, hasData = false, reportAnalysis }: ProfitOverviewProps) => {
  const summary = reportAnalysis?.summary;

  const metrics = hasData && summary ? [
    {
      label: "Total Scanned",
      value: formatCurrency(summary.totalRevenue.value, summary.totalRevenue.isEstimate),
      icon: DollarSign,
      color: "text-foreground",
      iconBg: "bg-primary",
      iconColor: "text-primary",
    },
    {
      label: "Leaks Detected",
      value: formatCurrency(summary.totalFees.value, summary.totalFees.isEstimate),
      icon: AlertTriangle,
      color: "text-red-600",
      iconBg: "bg-red-500",
      iconColor: "text-red-600",
    },
    {
      label: "Duplicate Charges",
      value: formatCurrency(summary.totalPromos.value, summary.totalPromos.isEstimate),
      icon: CreditCard,
      color: "text-amber-600",
      iconBg: "bg-amber-500",
      iconColor: "text-amber-600",
    },
    {
      label: "Recoverable Amount",
      value: formatCurrency(summary.netProfit.value, summary.netProfit.isEstimate),
      icon: TrendingUp,
      color: summary.netProfit.value >= 0 ? "text-emerald-600" : "text-red-600",
      iconBg: summary.netProfit.value >= 0 ? "bg-emerald-500" : "bg-red-500",
      iconColor: summary.netProfit.value >= 0 ? "text-emerald-600" : "text-red-600",
    },
  ] : [
    {
      label: "Total Scanned",
      value: "--",
      icon: DollarSign,
      color: "text-muted-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Leaks Detected",
      value: "--",
      icon: AlertTriangle,
      color: "text-muted-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Duplicate Charges",
      value: "--",
      icon: CreditCard,
      color: "text-muted-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Recoverable Amount",
      value: "--",
      icon: TrendingUp,
      color: "text-muted-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Financial Overview</h2>
        {hasData ? (
          !isTrial ? (
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 shrink-0" data-testid="badge-analysis-complete">
              <RefreshCw className="w-3 h-3" />
              Analysis Complete
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800 shrink-0">
              <RefreshCw className="w-3 h-3" />
              AI-analyzed
            </div>
          )
        ) : (
          <div className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-md border shrink-0">
            No data
          </div>
        )}
      </div>
      
      {!hasData ? (
        <Card className="border shadow-sm bg-card">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No Documents Scanned</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Upload bank statements, invoices, or payment reports to detect revenue leaks
            </p>
            <Link to="/uploads-pos">
              <Button className="gap-2" data-testid="button-upload-documents">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((metric) => (
            <Card 
              key={metric.label} 
              className="border shadow-sm transition-all duration-200 hover:shadow-md bg-card"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">{metric.label}</p>
                    <p className={`text-xl sm:text-2xl font-bold tracking-tight ${metric.color}`}>{metric.value}</p>
                  </div>
                  <div 
                    className={`p-2 rounded-lg shrink-0 ${metric.iconBg} bg-opacity-10`}
                  >
                    <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProfitOverview;
