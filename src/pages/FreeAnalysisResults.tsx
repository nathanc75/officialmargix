import { useNavigate } from "react-router-dom";
import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  DollarSign, 
  AlertTriangle, 
  Download,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  Clock
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import type { ExpenseItem } from "@/context/AnalysisContext";
import { useEffect, useMemo } from "react";
import { AIChatWidget } from "@/components/AIChatWidget";
import { LeakCategoryTable } from "@/components/results/LeakCategoryTable";
import { LeakDetailDrawer } from "@/components/results/LeakDetailDrawer";
import { ExpenseCategoryTable, getExpenseTypeLabel } from "@/components/results/ExpenseCategoryTable";
import { ExpenseDetailDrawer } from "@/components/results/ExpenseDetailDrawer";
import margixLogo from "@/assets/margix-logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import LockedPremiumSection from "@/components/dashboard/LockedPremiumSection";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getLeakTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    missing_payment: "Money That Never Arrived",
    duplicate_charge: "You Got Charged Twice",
    unused_subscription: "Paying for Things You Don't Use",
    failed_payment: "Payments That Didn't Go Through",
    pricing_inefficiency: "You're Being Overcharged",
    billing_error: "Billing Mistakes",
    churn_permanent_loss: "Customers You've Lost",
    refund_fee_loss: "Refund Fees You're Eating",
    other: "Other Problems",
  };
  return labels[type] || type;
};

const FreeAnalysisResults = () => {
  const { leakAnalysis, clearAnalysis } = useAnalysis();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!leakAnalysis) {
      navigate("/free-analysis");
    }
  }, [leakAnalysis, navigate]);

  // Group leaks by type into categories
  const leakCategories = useMemo(() => {
    if (!leakAnalysis?.leaks) return [];

    const categoryMap = new Map<string, {
      type: string;
      label: string;
      totalAmount: number;
      count: number;
      severity: "high" | "medium" | "low";
      confidence: number;
      leaks: typeof leakAnalysis.leaks;
    }>();

    leakAnalysis.leaks.forEach(leak => {
      const existing = categoryMap.get(leak.type);
      const leakConfidence = (leak as any).confidence || 0.7;
      
      if (existing) {
        existing.totalAmount += leak.amount;
        existing.count += 1;
        existing.confidence = (existing.confidence * (existing.count - 1) + leakConfidence) / existing.count;
        if (leak.severity === "high") existing.severity = "high";
        else if (leak.severity === "medium" && existing.severity === "low") existing.severity = "medium";
        existing.leaks.push(leak);
      } else {
        categoryMap.set(leak.type, {
          type: leak.type,
          label: getLeakTypeLabel(leak.type),
          totalAmount: leak.amount,
          count: 1,
          severity: leak.severity as "high" | "medium" | "low",
          confidence: leakConfidence,
          leaks: [leak]
        });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [leakAnalysis]);

  // Group expenses by type into categories
  const expenseCategories = useMemo(() => {
    if (!leakAnalysis?.expenses || leakAnalysis.expenses.length === 0) return [];

    const categoryMap = new Map<string, {
      type: string;
      label: string;
      totalAmount: number;
      count: number;
      severity: "high" | "medium" | "low";
      expenses: ExpenseItem[];
    }>();

    leakAnalysis.expenses.forEach(expense => {
      const existing = categoryMap.get(expense.type);
      
      if (existing) {
        existing.totalAmount += expense.amount;
        existing.count += 1;
        if (expense.severity === "high") existing.severity = "high";
        else if (expense.severity === "medium" && existing.severity === "low") existing.severity = "medium";
        existing.expenses.push(expense);
      } else {
        categoryMap.set(expense.type, {
          type: expense.type,
          label: getExpenseTypeLabel(expense.type),
          totalAmount: expense.amount,
          count: 1,
          severity: expense.severity as "high" | "medium" | "low",
          expenses: [expense]
        });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [leakAnalysis]);

  if (!leakAnalysis) {
    return null;
  }

  const overallConfidence = (leakAnalysis as any).confidence?.overallScore || 
    (leakCategories.length > 0 
      ? leakCategories.reduce((sum, c) => sum + c.confidence, 0) / leakCategories.length 
      : 0.75);

  const selectedCategoryData = selectedCategory 
    ? leakCategories.find(c => c.type === selectedCategory) 
    : null;

  const selectedExpenseCategoryData = selectedExpenseCategory
    ? expenseCategories.find(c => c.type === selectedExpenseCategory)
    : null;

  const totalAmountDue = leakAnalysis.totalAmountDue || 0;

  const chatContext = {
    fileNames: leakAnalysis.leaks.map(l => l.description).slice(0, 5),
    categories: Object.fromEntries(
      leakCategories.map(c => [c.label, c.leaks.map(l => `${l.description} (${formatCurrency(l.amount)})`)])
    ),
    analysisResults: {
      totalLeaks: leakAnalysis.totalLeaks,
      totalRecoverable: leakAnalysis.totalRecoverable,
      summary: leakAnalysis.summary,
      leakBreakdown: leakCategories.map(c => ({
        category: c.label,
        count: c.count,
        amount: c.totalAmount,
        severity: c.severity,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/[0.02] blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.015] blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 text-muted-foreground hover:text-foreground" 
                  data-testid="button-back"
                  onClick={goBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Back</span>
                </Button>
                <div className="h-4 w-px bg-border/60 hidden sm:block" />
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <img src={margixLogo} alt="MARGIX" className="w-6 h-6 sm:w-7 sm:h-7" />
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <h1 className="text-sm sm:text-base font-semibold text-foreground tracking-tight hidden xs:block">
                      Results
                    </h1>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 px-2 gap-1 text-amber-600 border-amber-300 bg-amber-50 whitespace-nowrap"
                    >
                      <span className="sm:hidden">Free</span>
                      <span className="hidden sm:inline">Free Analysis</span>
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Export locked for free users */}
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 gap-2 border-border/60 opacity-50 cursor-not-allowed" 
                  disabled
                  data-testid="button-download-locked"
                >
                  <Lock className="h-4 w-4 sm:h-3 sm:w-3" />
                  <Download className="hidden sm:inline h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Export</span>
                </Button>
                <Link to="/pricing">
                  <Button 
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-auto sm:px-4 brand-gradient border-0 text-white" 
                    data-testid="button-upgrade"
                  >
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline ml-1.5">Upgrade</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Success Banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/[0.03] to-transparent border border-primary/10 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Your complimentary analysis is complete!</p>
              <p className="text-sm text-muted-foreground">
                We found {leakAnalysis.totalLeaks} thing{leakAnalysis.totalLeaks !== 1 ? 's' : ''} that might be costing you money
              </p>
            </div>
          </div>

          {/* Upgrade CTA Banner */}
          <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 via-primary/[0.03] to-transparent overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-foreground">You've used your free scan</h3>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to get unlimited scans, AI assistant, and detailed exports
                    </p>
                  </div>
                </div>
                <Link to="/pricing" className="shrink-0">
                  <Button className="gap-2 brand-gradient border-0 text-white" size="lg" data-testid="button-unlock-full">
                    <Sparkles className="w-4 h-4" />
                    Unlock Full Access
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-border/40 shadow-soft animate-fade-in" style={{ animationDelay: '50ms' }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Problems Found</p>
                    <p className="text-3xl font-bold text-foreground mt-1.5 tabular-nums" data-testid="text-total-leaks">
                      {leakAnalysis.totalLeaks}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-soft animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recoverable</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1.5 tabular-nums" data-testid="text-recoverable">
                      {formatCurrency(leakAnalysis.totalRecoverable)}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/30 to-transparent shadow-soft animate-fade-in" style={{ animationDelay: '150ms' }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount Due</p>
                    <p className="text-3xl font-bold text-amber-700 mt-1.5 tabular-nums" data-testid="text-amount-due">
                      {formatCurrency(totalAmountDue)}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-700" />
                  </div>
                </div>
                {expenseCategories.length > 0 && (
                  <Badge variant="outline" className="mt-3 text-xs text-amber-700 bg-amber-50 border-amber-200">
                    {expenseCategories.reduce((sum, c) => sum + c.count, 0)} bill{expenseCategories.reduce((sum, c) => sum + c.count, 0) !== 1 ? 's' : ''} due
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-soft animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">How Sure We Are</p>
                    <p className="text-3xl font-bold text-foreground mt-1.5 tabular-nums">
                      {Math.round(overallConfidence * 100)}%
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                </div>
                {(leakAnalysis as any).confidence?.crossValidated > 0 && (
                  <Badge variant="outline" className="mt-3 text-xs text-emerald-700 bg-emerald-50 border-emerald-200">
                    {(leakAnalysis as any).confidence.crossValidated} double-checked
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Expenses Table - Only show if there are expenses */}
          {expenseCategories.length > 0 && (
            <ExpenseCategoryTable 
              categories={expenseCategories}
              onViewDetails={(type) => setSelectedExpenseCategory(type)}
            />
          )}

          {/* Locked Deeper Insights Section */}
          <LockedDeeperInsightsSection />

          {/* Locked Premium Features */}
          <LockedPremiumSection />
        </main>
      </div>

      {/* Leak Detail Drawer */}
      {selectedCategoryData && (
        <LeakDetailDrawer
          open={selectedCategory !== null}
          onOpenChange={(open) => !open && setSelectedCategory(null)}
          categoryLabel={selectedCategoryData.label}
          leaks={selectedCategoryData.leaks.map(l => ({
            ...l,
            confidence: (l as any).confidence,
            crossValidated: (l as any).crossValidated,
            modelSource: (l as any).modelSource,
          }))}
          totalAmount={selectedCategoryData.totalAmount}
        />
      )}

      {/* Expense Detail Drawer */}
      {selectedExpenseCategoryData && (
        <ExpenseDetailDrawer
          open={selectedExpenseCategory !== null}
          onOpenChange={(open) => !open && setSelectedExpenseCategory(null)}
          categoryLabel={selectedExpenseCategoryData.label}
          expenses={selectedExpenseCategoryData.expenses}
          totalAmount={selectedExpenseCategoryData.totalAmount}
        />
      )}

      {/* AI Chat Widget - Locked for free users */}
      <AIChatWidget documentContext={chatContext} locked={true} />
    </div>
  );
};

// Locked version of DeeperInsightsSection
const LockedDeeperInsightsSection = () => {
  const lockedCards = [
    {
      title: "🏷 Your Listed Prices",
      description: "Share your menu or price list so we can spot underpricing and missed revenue opportunities.",
    },
    {
      title: "🛒 What Customers Purchased",
      description: "Upload a sales or order report to see your best-selling services/products and upsell opportunities.",
    },
    {
      title: "📉 Your Business Costs",
      description: "Add a few example costs — subscriptions, rent, supplies, payroll — so we can estimate real profit.",
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Want deeper insights?</h2>
          <Badge variant="outline" className="text-[9px] h-5 gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
            <Lock className="w-2.5 h-2.5" />
            Upgrade Required
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lockedCards.map((card, index) => (
          <Card 
            key={index}
            className="relative overflow-hidden border-dashed border-2 border-muted/50 bg-muted/20 opacity-70"
          >
            <CardContent className="p-6 space-y-4">
              <div className="absolute top-3 right-3">
                <Lock className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground/70 text-lg leading-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2 opacity-50 cursor-not-allowed"
                disabled
              >
                <Lock className="h-3 w-3" />
                Locked
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link to="/pricing">
          <Button className="gap-2 brand-gradient border-0 text-white" data-testid="button-unlock-insights">
            <Sparkles className="w-4 h-4" />
            Unlock All Insights
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FreeAnalysisResults;
