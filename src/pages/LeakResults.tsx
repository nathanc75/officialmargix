import { Link, useNavigate } from "react-router-dom";
import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  DollarSign, 
  AlertTriangle, 
  Download,
  Plus,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useEffect, useState, useMemo } from "react";
import { AIChatWidget } from "@/components/AIChatWidget";
import { jsPDF } from "jspdf";
import { DeeperInsightsSection, InsightCategory } from "@/components/results/DeeperInsightsSection";
import { LeakCategoryTable } from "@/components/results/LeakCategoryTable";
import { LeakDetailDrawer } from "@/components/results/LeakDetailDrawer";
import margixLogo from "@/assets/margix-logo.png";

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

const LeakResults = () => {
  const { leakAnalysis, clearAnalysis } = useAnalysis();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [uploadedInsightCategories, setUploadedInsightCategories] = useState<Set<InsightCategory>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleInsightCategoryUploaded = (category: InsightCategory) => {
    setUploadedInsightCategories(prev => new Set([...prev, category]));
  };

  useEffect(() => {
    if (!leakAnalysis) {
      navigate("/dashboard");
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

  if (!leakAnalysis) {
    return null;
  }

  const handleNewScan = () => {
    clearAnalysis();
    navigate("/dashboard");
  };

  const handleExport = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 20;

    try {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve) => {
        logoImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = logoImg.width;
          canvas.height = logoImg.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(logoImg, 0, 0);
            const logoData = canvas.toDataURL('image/png');
            doc.addImage(logoData, 'PNG', margin, yPos - 5, 20, 20);
          }
          resolve();
        };
        logoImg.onerror = () => resolve();
        logoImg.src = '/margix-logo-download.png';
      });
    } catch {
      // Continue without logo
    }

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("MARGIX", margin + 25, yPos + 5);
    
    yPos += 12;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Leak Scan Report", margin + 25, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, yPos);

    yPos += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", margin, yPos);

    yPos += 10;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos, 80, 25, 3, 3, 'F');
    doc.roundedRect(margin + 85, yPos, 80, 25, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Total Leaks Found", margin + 5, yPos + 8);
    doc.text("Recoverable Amount", margin + 90, yPos + 8);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(String(leakAnalysis.totalLeaks), margin + 5, yPos + 20);
    doc.setTextColor(22, 163, 74);
    doc.text(formatCurrency(leakAnalysis.totalRecoverable), margin + 90, yPos + 20);

    yPos += 35;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const summaryLines = doc.splitTextToSize(leakAnalysis.summary, contentWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * 5 + 10;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Issues by Category", margin, yPos);
    yPos += 8;

    leakCategories.forEach((category) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(250, 250, 250);
      doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F');

      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${category.label} (${category.count})`, margin + 5, yPos);
      
      doc.setTextColor(220, 38, 38);
      doc.text(formatCurrency(category.totalAmount), pageWidth - margin - 30, yPos);

      yPos += 18;
    });

    yPos = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Report generated by MARGIX AI Financial Monitor", margin, yPos);
    doc.text(new Date().toISOString(), pageWidth - margin - 40, yPos);

    doc.save(`margix-leak-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const overallConfidence = (leakAnalysis as any).confidence?.overallScore || 
    (leakCategories.length > 0 
      ? leakCategories.reduce((sum, c) => sum + c.confidence, 0) / leakCategories.length 
      : 0.75);

  const selectedCategoryData = selectedCategory 
    ? leakCategories.find(c => c.type === selectedCategory) 
    : null;

  const chatContext = {
    fileNames: [],
    categories: {},
    analysisResults: {
      totalLeaks: leakAnalysis.totalLeaks,
      totalRecoverable: leakAnalysis.totalRecoverable,
      summary: leakAnalysis.summary,
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-muted-foreground hover:text-foreground" 
                  data-testid="button-back"
                  onClick={goBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div className="h-5 w-px bg-border/60" />
                <div className="flex items-center gap-2.5">
                  <img src={margixLogo} alt="MARGIX" className="w-7 h-7" />
                  <div>
                    <h1 className="text-base font-semibold text-foreground tracking-tight">Scan Results</h1>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 hidden sm:flex border-border/60" 
                  onClick={handleExport} 
                  data-testid="button-download"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 brand-gradient border-0 text-white" 
                  onClick={handleNewScan} 
                  data-testid="button-new-scan"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Scan</span>
                </Button>
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
            <div>
              <p className="font-medium text-foreground">All done — we've finished checking your documents</p>
              <p className="text-sm text-muted-foreground">
                We found {leakAnalysis.totalLeaks} thing{leakAnalysis.totalLeaks !== 1 ? 's' : ''} that might be costing you money
              </p>
            </div>
          </div>

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <Card className="border-border/40 shadow-soft animate-fade-in" style={{ animationDelay: '150ms' }}>
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

          {/* Issues Table */}
          <LeakCategoryTable 
            categories={leakCategories}
            onViewDetails={(type) => setSelectedCategory(type)}
          />

          {/* Deeper Insights Section */}
          <DeeperInsightsSection 
            uploadedCategories={uploadedInsightCategories}
            onCategoryUploaded={handleInsightCategoryUploaded}
          />
        </main>
      </div>

      {/* Detail Drawer */}
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

      {/* AI Chat Widget */}
      <AIChatWidget documentContext={chatContext} locked={true} />
    </div>
  );
};

export default LeakResults;
