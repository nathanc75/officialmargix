import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, AlertTriangle, TrendingDown, CreditCard, ArrowRight, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import InsightsAnalysisTabs from "@/components/dashboard/InsightsAnalysisTabs";
import POSConnectSection from "@/components/dashboard/POSConnectSection";
import { UploadDialog } from "@/components/dashboard/UploadDialog";
import { useUser } from "@/context/UserContext";
import { useAnalysis } from "@/context/AnalysisContext";
import { AIChatWidget } from "@/components/AIChatWidget";

const Dashboard = () => {
  const { user } = useUser();
  const { leakAnalysis, hasData: hasAnalysisData } = useAnalysis();
  
  // Check if user has uploaded any documents
  const hasData = user.connectedPlatforms.length > 0 || hasAnalysisData;

  // Mock data for demo - in production this would come from analysis
  const scanResults = {
    potentialIssues: leakAnalysis?.leaks?.length || 4,
    duplicateCharges: leakAnalysis?.leaks?.filter(l => l.type === "duplicate_charge").length || 2,
    missedPayments: leakAnalysis?.leaks?.filter(l => l.type === "missing_payment" || l.type === "missed_refund").length || 1,
    activeSubscriptions: leakAnalysis?.leaks?.filter(l => l.type === "unused_subscription").length || 9,
    totalRecoverable: leakAnalysis?.totalRecoverable || 847,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-background relative overflow-hidden">
      {/* Background Elements - Matching Landing Page */}
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
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* AI Status Strip */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent border border-border/50 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div className={`w-2.5 h-2.5 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div className={`absolute w-2.5 h-2.5 rounded-full ${hasData ? 'bg-emerald-500' : 'bg-amber-500'} animate-ping opacity-75`} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-medium text-foreground">
                AI Status: {hasData ? (
                  <>Monitoring <span className="text-primary">{leakAnalysis?.leaks?.length || 38} transactions</span> and <span className="text-primary">{scanResults.activeSubscriptions} recurring charges</span></>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">Waiting for documents</span>
                )}
              </span>
              {!hasData && (
                <span className="text-xs text-muted-foreground">
                  Monitoring will begin after your first upload.
                </span>
              )}
            </div>
          </div>

          {/* Results Dashboard - When user has data */}
          {hasData && (
            <div className="space-y-6 animate-fade-in">
              {/* Scan Complete Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Scan Complete — <span className="text-gradient">Your AI Found {scanResults.potentialIssues} Potential Issues</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Analysis completed • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <UploadDialog>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    New Scan
                  </Button>
                </UploadDialog>
              </div>

              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Issues Detected */}
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-amber-500/5 hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Issues Detected</p>
                        <p className="text-3xl sm:text-4xl font-bold text-foreground">{scanResults.potentialIssues}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">require attention</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Potential Savings */}
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-emerald-500/5 hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Potential Savings</p>
                        <p className="text-3xl sm:text-4xl font-bold text-foreground">${scanResults.totalRecoverable}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">recoverable</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <TrendingDown className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscriptions */}
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subscriptions</p>
                        <p className="text-3xl sm:text-4xl font-bold text-foreground">{scanResults.activeSubscriptions}</p>
                        <p className="text-xs text-primary font-medium">tracked</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <RefreshCw className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transactions */}
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-blue-500/5 hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transactions</p>
                        <p className="text-3xl sm:text-4xl font-bold text-foreground">{leakAnalysis?.leaks?.length || 38}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">analyzed</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                    <Link to="/leak-results">
                      <Button className="gap-2 shadow-lg shadow-primary/25">
                        View Detailed Report
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Intelligence Preview - Premium Empty State */}
          {!hasData && (
            <div className="space-y-6 animate-fade-in">
              {/* Hero Card */}
              <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl" />
                
                <CardContent className="relative p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">No data yet — your AI is standing by.</p>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                          Your AI Financial Monitor is <span className="text-gradient">Ready</span>
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                          Upload financial documents to activate transaction analysis and issue detection.
                        </p>
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          Your documents are encrypted and processed securely.
                        </p>
                      </div>
                    </div>
                    
                    <UploadDialog>
                      <Button size="lg" className="w-full lg:w-auto gap-2 shadow-lg shadow-primary/25 h-12 px-6">
                        <Upload className="w-5 h-5" />
                        Upload Documents
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </UploadDialog>
                  </div>
                </CardContent>
              </Card>

              {/* What AI Finds Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">What Your AI Will Monitor</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="group relative overflow-hidden border border-red-500/20 bg-gradient-to-br from-card via-card to-red-500/5 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/40 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full" />
                    <CardContent className="relative p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/10">
                          <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1.5">Missed Payments</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">AI checks invoices and payments to detect underpaid, late, or unpaid revenue.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="group relative overflow-hidden border border-amber-500/20 bg-gradient-to-br from-card via-card to-amber-500/5 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/40 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
                    <CardContent className="relative p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/10">
                          <CreditCard className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1.5">Duplicate Charges</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">AI looks for vendors or services charging more than once.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="group relative overflow-hidden border border-orange-500/20 bg-gradient-to-br from-card via-card to-orange-500/5 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/40 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full" />
                    <CardContent className="relative p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/10">
                          <AlertTriangle className="w-6 h-6 text-orange-500" />
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

              {/* POS Connect Section */}
              <POSConnectSection />
            </div>
          )}
          
          {/* Only show detailed sections when there's data */}
          {hasData && (
            <>
              <InsightsSection isTrial={false} hasData={hasData} />
              <ProfitOverview isTrial={false} hasData={hasData} />
              <ItemBreakdownTable isTrial={false} hasData={hasData} />
              <InsightsAnalysisTabs isTrial={false} hasData={hasData} />
            </>
          )}
        </main>
      </div>
      
      {/* AI Chat Widget - Unlocked for paid users */}
      <AIChatWidget 
        documentContext={hasAnalysisData ? {
          fileNames: leakAnalysis?.leaks?.map(l => l.description) || [],
          categories: {},
          analysisResults: {
            totalLeaks: leakAnalysis?.leaks?.length || 0,
            totalRecoverable: leakAnalysis?.totalRecoverable || 0,
            summary: leakAnalysis?.summary || "",
          }
        } : undefined}
        locked={false}
      />
    </div>
  );
};

export default Dashboard;