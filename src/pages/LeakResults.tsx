import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown,
  FileText,
  Download,
  Plus,
  RefreshCw,
  Calendar,
  ArrowRight
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useEffect } from "react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getLeakTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    missing_payment: "Missing Payment",
    duplicate_charge: "Duplicate Charge",
    unused_subscription: "Unused Subscription",
    failed_payment: "Failed Payment",
    pricing_inefficiency: "Pricing Issue",
    billing_error: "Billing Error",
    other: "Other Issue",
  };
  return labels[type] || type;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "low": return "bg-green-500/10 text-green-600 border-green-500/20";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const LeakResults = () => {
  const { leakAnalysis, clearAnalysis } = useAnalysis();
  const navigate = useNavigate();

  useEffect(() => {
    if (!leakAnalysis) {
      navigate("/upload");
    }
  }, [leakAnalysis, navigate]);

  if (!leakAnalysis) {
    return null;
  }

  const handleNewScan = () => {
    clearAnalysis();
    navigate("/upload");
  };

  const highSeverityLeaks = leakAnalysis.leaks.filter(l => l.severity === "high");
  const mediumSeverityLeaks = leakAnalysis.leaks.filter(l => l.severity === "medium");
  const lowSeverityLeaks = leakAnalysis.leaks.filter(l => l.severity === "low");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative">
        <header className="border-b border-border/50 bg-white/80 dark:bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground">Leak Scan Results</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Analysis completed</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex" data-testid="button-download">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" className="gap-2" onClick={handleNewScan} data-testid="button-new-scan">
                  <Plus className="h-4 w-4" />
                  New Scan
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Leaks Found</p>
                    <p className="text-3xl font-bold text-foreground mt-1" data-testid="text-total-leaks">
                      {leakAnalysis.totalLeaks}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {highSeverityLeaks.length > 0 && (
                    <Badge variant="outline" className={getSeverityColor("high")}>
                      {highSeverityLeaks.length} High
                    </Badge>
                  )}
                  {mediumSeverityLeaks.length > 0 && (
                    <Badge variant="outline" className={getSeverityColor("medium")}>
                      {mediumSeverityLeaks.length} Medium
                    </Badge>
                  )}
                  {lowSeverityLeaks.length > 0 && (
                    <Badge variant="outline" className={getSeverityColor("low")}>
                      {lowSeverityLeaks.length} Low
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Recoverable Amount</p>
                    <p className="text-3xl font-bold text-green-600 mt-1" data-testid="text-recoverable">
                      {formatCurrency(leakAnalysis.totalRecoverable)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Potential savings identified
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Analysis Date</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {new Date(leakAnalysis.analyzedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Analysis complete</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground" data-testid="text-summary">
                {leakAnalysis.summary}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Detected Leaks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {leakAnalysis.leaks.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">No leaks detected</p>
                  <p className="text-sm text-muted-foreground">Your financial documents look clean!</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {leakAnalysis.leaks.map((leak, index) => (
                    <div 
                      key={leak.id || index} 
                      className="p-4 hover:bg-secondary/30 transition-colors"
                      data-testid={`leak-item-${index}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className={getSeverityColor(leak.severity)}>
                              {leak.severity}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {getLeakTypeLabel(leak.type)}
                            </Badge>
                            {leak.date && (
                              <span className="text-xs text-muted-foreground">{leak.date}</span>
                            )}
                          </div>
                          <p className="text-sm text-foreground font-medium">
                            {leak.description}
                          </p>
                          <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Recommendation</p>
                            <p className="text-sm text-foreground">{leak.recommendation}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-destructive">
                            {formatCurrency(leak.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">potential loss</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Get Ongoing Monitoring</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Subscribe to catch leaks automatically every month. Never miss a duplicate charge or unused subscription again.
                    </p>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button className="gap-2 brand-gradient border-0 text-white" data-testid="button-upgrade">
                    View Plans
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default LeakResults;
