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
  ArrowRight,
  Brain,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useEffect, useState } from "react";
import { AIChatWidget } from "@/components/AIChatWidget";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { jsPDF } from "jspdf";
import { DeeperInsightsSection, InsightCategory } from "@/components/results/DeeperInsightsSection";

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
  const [expandedLeaks, setExpandedLeaks] = useState<Set<string>>(new Set());
  const [uploadedInsightCategories, setUploadedInsightCategories] = useState<Set<InsightCategory>>(new Set());

  const handleInsightCategoryUploaded = (category: InsightCategory) => {
    setUploadedInsightCategories(prev => new Set([...prev, category]));
  };

  useEffect(() => {
    if (!leakAnalysis) {
      navigate("/dashboard");
    }
  }, [leakAnalysis, navigate]);

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
      
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => {
          // Add logo to PDF (30x30 pixels)
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
        logoImg.onerror = () => resolve(); // Continue without logo if it fails
        logoImg.src = '/margix-logo-download.png';
      });
    } catch (e) {
      // Continue without logo if loading fails
    }

    // Header text (offset for logo)
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

    // Line separator
    yPos += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Summary Section
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", margin, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Stats boxes
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

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Detected Issues Section
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Detected Issues", margin, yPos);
    yPos += 8;

    leakAnalysis.leaks.forEach((leak, index) => {
      // Check if we need a new page
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      // Severity color
      const severityColors: Record<string, [number, number, number]> = {
        high: [220, 38, 38],
        medium: [245, 158, 11],
        low: [22, 163, 74]
      };
      const color = severityColors[leak.severity] || [100, 100, 100];

      // Issue card background
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(margin, yPos, contentWidth, 35, 2, 2, 'F');
      
      // Severity indicator
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(margin, yPos, 4, 35, 2, 2, 'F');

      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${getLeakTypeLabel(leak.type)}`, margin + 8, yPos);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(formatCurrency(leak.amount), pageWidth - margin - 30, yPos);

      yPos += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`${leak.severity.toUpperCase()} SEVERITY • ${leak.date || 'N/A'}`, margin + 8, yPos);

      yPos += 6;
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(leak.description, contentWidth - 16);
      doc.text(descLines[0] || '', margin + 8, yPos);
      
      yPos += 20;
    });

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Report generated by MARGIX AI Financial Monitor", margin, yPos);
    doc.text(new Date().toISOString(), pageWidth - margin - 40, yPos);

    // Save the PDF
    doc.save(`margix-leak-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const toggleLeakExpanded = (leakId: string) => {
    setExpandedLeaks(prev => {
      const next = new Set(prev);
      if (next.has(leakId)) {
        next.delete(leakId);
      } else {
        next.add(leakId);
      }
      return next;
    });
  };

  const highSeverityLeaks = leakAnalysis.leaks.filter(l => l.severity === "high");
  const mediumSeverityLeaks = leakAnalysis.leaks.filter(l => l.severity === "medium");
  const lowSeverityLeaks = leakAnalysis.leaks.filter(l => l.severity === "low");

  // Check for multi-model analysis metadata
  const isMultiModel = (leakAnalysis as any).multiModelAnalysis;
  const confidence = (leakAnalysis as any).confidence;
  const modelContributions = (leakAnalysis as any).modelContributions;

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
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {isMultiModel ? "Multi-model analysis complete" : "Analysis complete"}
                    </p>
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
          {/* Multi-Model Analysis Badge */}
          {isMultiModel && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Multi-Model AI Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Cross-validated by Gemini + GPT
                      </p>
                    </div>
                  </div>
                  {confidence && (
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {Math.round(confidence.overallScore * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {confidence.crossValidated}
                        </p>
                        <p className="text-xs text-muted-foreground">Verified</p>
                      </div>
                      {confidence.needsReview > 0 && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-amber-600">
                            {confidence.needsReview}
                          </p>
                          <p className="text-xs text-muted-foreground">Needs Review</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* Model Contributions */}
          {modelContributions && (
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-card/70 border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Model Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {modelContributions.gemini && modelContributions.gemini.length > 0 && (
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">Gemini Patterns</span>
                    </div>
                    <ul className="space-y-2">
                      {modelContributions.gemini.slice(0, 3).map((insight: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {modelContributions.gpt && modelContributions.gpt.length > 0 && (
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Brain className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="font-medium text-foreground">GPT Analysis</span>
                    </div>
                    <ul className="space-y-2">
                      {modelContributions.gpt.slice(0, 3).map((insight: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                  {leakAnalysis.leaks.map((leak, index) => {
                    const leakId = leak.id || `leak-${index}`;
                    const isExpanded = expandedLeaks.has(leakId);
                    const leakConfidence = (leak as any).confidence;
                    const isCrossValidated = (leak as any).crossValidated;
                    const modelSource = (leak as any).modelSource;

                    return (
                      <Collapsible 
                        key={leakId}
                        open={isExpanded}
                        onOpenChange={() => toggleLeakExpanded(leakId)}
                      >
                        <div 
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
                                {isCrossValidated && (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-600/20 gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    Verified
                                  </Badge>
                                )}
                                {leakConfidence && (
                                  <Badge variant="outline" className="text-xs text-primary border-primary/20">
                                    {Math.round(leakConfidence * 100)}% confidence
                                  </Badge>
                                )}
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

                              {/* Expandable AI Reasoning */}
                              {modelSource && (
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="mt-2 gap-1 text-muted-foreground">
                                    <Brain className="h-3 w-3" />
                                    AI Reasoning
                                    {isExpanded ? (
                                      <ChevronUp className="h-3 w-3" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3" />
                                    )}
                                  </Button>
                                </CollapsibleTrigger>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-bold text-destructive">
                                {formatCurrency(leak.amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">potential loss</p>
                            </div>
                          </div>

                          <CollapsibleContent>
                            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">
                                  Detected by: {modelSource === "both" ? "Gemini + GPT" : modelSource === "gemini" ? "Gemini" : "GPT"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                This finding was {isCrossValidated ? "cross-validated by multiple AI models for higher accuracy" : "identified through deep analysis"}. 
                                The confidence score of {leakConfidence ? `${Math.round(leakConfidence * 100)}%` : "N/A"} indicates the reliability of this detection.
                              </p>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deeper Insights Section - Unlock more analysis */}
          <DeeperInsightsSection 
            uploadedCategories={uploadedInsightCategories}
            onCategoryUploaded={handleInsightCategoryUploaded}
          />

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

      {/* AI Chat Widget - Locked for free scans */}
      <AIChatWidget documentContext={chatContext} locked={true} />
    </div>
  );
};

export default LeakResults;
