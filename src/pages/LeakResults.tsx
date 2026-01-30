import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  DollarSign, 
  AlertTriangle, 
  TrendingDown,
  Download,
  Plus,
  ShieldCheck
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useEffect, useState, useMemo } from "react";
import { AIChatWidget } from "@/components/AIChatWidget";
import { jsPDF } from "jspdf";
import { DeeperInsightsSection, InsightCategory } from "@/components/results/DeeperInsightsSection";
import { LeakCategoryTable } from "@/components/results/LeakCategoryTable";
import { LeakDetailDrawer } from "@/components/results/LeakDetailDrawer";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getLeakTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    missing_payment: "Missing Payments",
    duplicate_charge: "Duplicate Charges",
    unused_subscription: "Unused Subscriptions",
    failed_payment: "Failed Payments",
    pricing_inefficiency: "Pricing Mismatches",
    billing_error: "Billing Errors",
    other: "Other Issues",
  };
  return labels[type] || type;
};

const LeakResults = () => {
  const { leakAnalysis, clearAnalysis } = useAnalysis();
  const navigate = useNavigate();
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
        // Upgrade severity if this leak is higher
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

    // Sort by amount descending
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

    // Load and add logo
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

  // Get overall confidence
  const overallConfidence = (leakAnalysis as any).confidence?.overallScore || 
    (leakCategories.length > 0 
      ? leakCategories.reduce((sum, c) => sum + c.confidence, 0) / leakCategories.length 
      : 0.75);

  // Get selected category data for drawer
  const selectedCategoryData = selectedCategory 
    ? leakCategories.find(c => c.type === selectedCategory) 
    : null;

  // Chat context for the assistant
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
                    <p className="text-xs sm:text-sm text-muted-foreground">Analysis complete</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 hidden sm:flex" onClick={handleExport} data-testid="button-download">
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
          {/* LAYER 1: Executive Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Leaks</p>
                    <p className="text-3xl font-bold text-foreground mt-1" data-testid="text-total-leaks">
                      {leakAnalysis.totalLeaks}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Recoverable</p>
                    <p className="text-3xl font-bold text-green-600 mt-1" data-testid="text-recoverable">
                      {formatCurrency(leakAnalysis.totalRecoverable)}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Confidence</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {Math.round(overallConfidence * 100)}%
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                </div>
                {(leakAnalysis as any).confidence?.crossValidated > 0 && (
                  <Badge variant="outline" className="mt-2 text-xs text-green-600 border-green-600/20">
                    {(leakAnalysis as any).confidence.crossValidated} verified
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* LAYER 1: Where You're Losing Money Table */}
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

      {/* LAYER 2: Issue Detail Drawer */}
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
