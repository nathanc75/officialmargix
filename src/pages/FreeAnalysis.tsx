import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, AlertTriangle, TrendingDown, CreditCard, ArrowRight, Sparkles, CheckCircle2, Lock, Zap, Clock, Clover } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { FreeUploadDialog } from "@/components/dashboard/FreeUploadDialog";
import { useAnalysis } from "@/context/AnalysisContext";
import { AIChatWidget } from "@/components/AIChatWidget";
import { SiSquare } from "react-icons/si";

const FREE_SCAN_STORAGE_KEY = "margix_free_scan_used";

const FreeAnalysis = () => {
  const { leakAnalysis, hasData: hasAnalysisData } = useAnalysis();
  const [hasUsedFreeScan, setHasUsedFreeScan] = useState(() => {
    // Check localStorage on initial render
    return localStorage.getItem(FREE_SCAN_STORAGE_KEY) === "true";
  });

  const handleAnalysisComplete = () => {
    localStorage.setItem(FREE_SCAN_STORAGE_KEY, "true");
    setHasUsedFreeScan(true);
  };

  // Mock data for demo - in production this would come from analysis
  const scanResults = {
    potentialIssues: leakAnalysis?.leaks?.length || 4,
    totalRecoverable: leakAnalysis?.totalRecoverable || 847,
  };

  const platforms = [
    { 
      name: "Square POS", 
      icon: <SiSquare className="h-5 w-5 text-muted-foreground" />, 
    },
    { 
      name: "Toast", 
      icon: <div className="font-bold text-muted-foreground text-sm">T</div>, 
    },
    { 
      name: "Clover", 
      icon: <Clover className="h-5 w-5 text-muted-foreground" />, 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-primary/3 to-purple-500/3 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative">
        {/* Custom Header with Free Badge */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-105">
                    <img 
                      src="/margix-logo-download.png" 
                      alt="MARGIX" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="hidden xs:block">
                    <h1 className="text-sm sm:text-base font-bold text-foreground leading-none tracking-tight">MARGIX</h1>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block font-medium">Leak Detection</p>
                  </div>
                </Link>
                
                <Badge variant="outline" className="gap-1 sm:gap-1.5 py-0.5 sm:py-1 px-1.5 sm:px-2.5 text-[10px] sm:text-xs bg-amber-50 text-amber-700 border-amber-200 font-medium whitespace-nowrap">
                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                  <span className="hidden sm:inline">Free Analysis</span>
                  <span className="sm:hidden">Free</span>
                </Badge>
              </div>
              
              <Link to="/pricing" className="shrink-0">
                <Button 
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-auto sm:px-4 brand-gradient border-0 text-white"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline ml-1.5">Upgrade</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* AI Status Strip */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent border border-border/50 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div className={`w-2.5 h-2.5 rounded-full ${hasAnalysisData ? 'bg-emerald-500' : hasUsedFreeScan ? 'bg-amber-500' : 'bg-amber-500'}`} />
              <div className={`absolute w-2.5 h-2.5 rounded-full ${hasAnalysisData ? 'bg-emerald-500' : 'bg-amber-500'} animate-ping opacity-75`} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-medium text-foreground">
                {hasAnalysisData ? (
                  <>AI Status: <span className="text-primary">Analysis complete</span></>
                ) : hasUsedFreeScan ? (
                  <span className="text-amber-600 dark:text-amber-400">AI Status: Free scan already used</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">AI Status: Waiting for your document</span>
                )}
              </span>
              {!hasAnalysisData && !hasUsedFreeScan && (
                <span className="text-xs text-muted-foreground">
                  You get one complimentary scan. Make it count!
                </span>
              )}
            </div>
          </div>

          {/* Already Used Free Scan Banner */}
          {hasUsedFreeScan && !hasAnalysisData && (
            <Card className="border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 via-amber-25 to-transparent dark:from-amber-950/30 dark:to-transparent overflow-hidden animate-fade-in">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-bold text-foreground">You've already used your free scan</h3>
                      <p className="text-sm text-muted-foreground">
                        Upgrade to get unlimited scans, AI assistant, and detailed exports
                      </p>
                    </div>
                  </div>
                  <Link to="/pricing" className="shrink-0">
                    <Button className="gap-2 brand-gradient border-0 text-white" size="lg">
                      <Sparkles className="w-4 h-4" />
                      Unlock Full Access
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results State - When user has analyzed data */}
          {hasAnalysisData && (
            <div className="space-y-6 animate-fade-in">
              {/* Scan Complete Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Scan Complete — <span className="text-gradient">{scanResults.potentialIssues} Potential Issues Found</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Free analysis • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Recoverable Banner */}
              <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/25">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Recoverable Amount</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gradient">${scanResults.totalRecoverable.toLocaleString()}</p>
                      </div>
                    </div>
                    <Link to="/results">
                      <Button className="gap-2 shadow-lg shadow-primary/25">
                        View Detailed Report
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade CTA */}
              <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Want Deeper Insights?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Upgrade to unlock POS connections, AI chat assistant, and comprehensive analysis across all your financial documents.
                  </p>
                  <Link to="/pricing">
                    <Button className="gap-2 brand-gradient border-0 text-white shadow-lg shadow-primary/25">
                      <Sparkles className="w-4 h-4" />
                      Unlock Full Access
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State - Upload Section */}
          {!hasAnalysisData && (
            <div className="space-y-6 animate-fade-in">
              {/* Hero Card */}
              <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl" />
                
                <CardContent className="relative p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            1 Free Scan
                          </Badge>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                          Try Your <span className="text-gradient">Complimentary Analysis</span>
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                          Upload one payment or payout report to see what your AI can find. No credit card required.
                        </p>
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          Your documents are encrypted and processed securely.
                        </p>
                      </div>
                    </div>
                    
                    {!hasUsedFreeScan ? (
                      <FreeUploadDialog onAnalysisComplete={handleAnalysisComplete}>
                        <Button size="lg" className="w-full lg:w-auto gap-2 shadow-lg shadow-primary/25 h-12 px-6">
                          <Upload className="w-5 h-5" />
                          Upload Document
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </FreeUploadDialog>
                    ) : (
                      <div className="text-center lg:text-right">
                        <p className="text-sm text-muted-foreground mb-2">You've used your free scan</p>
                        <Link to="/pricing">
                          <Button size="lg" className="gap-2 brand-gradient border-0 text-white">
                            <Sparkles className="w-5 h-5" />
                            Upgrade for More
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* What AI Will Monitor Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">What Your AI Will Monitor</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="group relative overflow-hidden border border-border/60 bg-card hover:shadow-lg hover:border-border transition-all duration-300">
                    <CardContent className="relative p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors duration-300">
                          <TrendingDown className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1.5">Missed Payments</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">AI checks invoices and payments to detect underpaid, late, or unpaid revenue.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="group relative overflow-hidden border border-border/60 bg-card hover:shadow-lg hover:border-border transition-all duration-300">
                    <CardContent className="relative p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors duration-300">
                          <CreditCard className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1.5">Duplicate Charges</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">AI looks for vendors or services charging more than once.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="group relative overflow-hidden border border-border/60 bg-card hover:shadow-lg hover:border-border transition-all duration-300">
                    <CardContent className="relative p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors duration-300">
                          <AlertTriangle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1.5">Forgotten Subscriptions</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">AI tracks recurring charges and flags subscriptions that appear unused.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      The average account has <span className="font-bold text-primary text-base">$847</span> in recoverable revenue
                    </p>
                  </div>
                </div>
              </div>

              {/* Locked POS Connect Section */}
              <section className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Connect POS Systems</h2>
                  <Badge variant="outline" className="gap-1 text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground border-border">
                    <Lock className="h-2.5 w-2.5" />
                    Premium
                  </Badge>
                </div>

                <div className="relative">
                  <div className="blur-sm opacity-60 pointer-events-none select-none">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {platforms.map((platform) => (
                        <Card 
                          key={platform.name} 
                          className="group relative overflow-hidden border border-border/60 bg-card"
                        >
                          <CardContent className="relative p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                                  {platform.icon}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground text-sm">{platform.name}</h3>
                                  <p className="text-xs text-muted-foreground font-medium">Auto-sync</p>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="outline"
                              className="w-full gap-2"
                              size="sm"
                              disabled
                            >
                              Connect
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-lg">
                    <div className="text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">POS Connections</p>
                      <p className="text-xs text-muted-foreground mb-3">Upgrade to connect your POS systems</p>
                      <Link to="/pricing">
                        <Button size="sm" className="gap-1.5 brand-gradient border-0 text-white">
                          <Sparkles className="w-3.5 h-3.5" />
                          Unlock
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
      
      {/* AI Chat Widget - Locked for free users */}
      <AIChatWidget locked={true} />
    </div>
  );
};

export default FreeAnalysis;
