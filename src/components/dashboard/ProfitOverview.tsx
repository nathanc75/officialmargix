import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Percent, Tag, TrendingUp, Upload, RefreshCw } from "lucide-react";
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
      label: "Gross Sales",
      value: formatCurrency(summary.totalRevenue.value, summary.totalRevenue.isEstimate),
      icon: DollarSign,
      color: "text-emerald-600",
      iconBg: "bg-emerald-500",
      iconColor: "text-emerald-600",
    },
    {
      label: "Platform Fees",
      value: formatCurrency(summary.totalFees.value, summary.totalFees.isEstimate),
      icon: Percent,
      color: "text-red-600",
      iconBg: "bg-red-500",
      iconColor: "text-red-600",
    },
    {
      label: "Promo Discounts",
      value: formatCurrency(summary.totalPromos.value, summary.totalPromos.isEstimate),
      icon: Tag,
      color: "text-amber-600",
      iconBg: "bg-amber-500",
      iconColor: "text-amber-600",
    },
    {
      label: "Est. Net Profit",
      value: formatCurrency(summary.netProfit.value, summary.netProfit.isEstimate),
      icon: TrendingUp,
      color: summary.netProfit.value >= 0 ? "text-emerald-600" : "text-red-600",
      iconBg: summary.netProfit.value >= 0 ? "bg-emerald-500" : "bg-red-500",
      iconColor: summary.netProfit.value >= 0 ? "text-emerald-600" : "text-red-600",
    },
  ] : [
    {
      label: "Gross Sales",
      value: "--",
      icon: DollarSign,
      color: "text-muted-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Platform Fees",
      value: "--",
      icon: Percent,
      color: "text-muted-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Promo Discounts",
      value: "--",
      icon: Tag,
      color: "text-muted-foreground",
      iconBg: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Est. Net Profit",
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
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Profit Overview</h2>
        {hasData ? (
          !isTrial ? (
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <div className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800" data-testid="badge-realtime">
                Real-time
              </div>
              <span className="text-[8px] text-muted-foreground" data-testid="text-pos-requirement-overview">POS-connected stores only</span>
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
            <h3 className="font-semibold text-foreground mb-2">No Data Yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Connect your POS to see profit metrics across all order channels
            </p>
            <Link to="/uploads-pos">
              <Button className="gap-2" data-testid="button-connect-pos">
                <Upload className="h-4 w-4" />
                Connect POS
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
