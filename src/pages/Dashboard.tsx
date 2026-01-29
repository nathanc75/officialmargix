import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, AlertTriangle, TrendingDown, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import InsightsAnalysisTabs from "@/components/dashboard/InsightsAnalysisTabs";
import { useUser } from "@/context/UserContext";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [documentType, setDocumentType] = useState("all");
  const { user } = useUser();
  
  // Check if user has uploaded any documents
  const hasData = user.connectedPlatforms.length > 0;

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
        <DashboardHeader 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
          documentType={documentType} 
          setDocumentType={setDocumentType}
          isTrial={false}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
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
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                          We scan your financial documents and uncover <span className="text-gradient">money you didn't know you were losing.</span>
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                          Upload bank statements, invoices, receipts, or payment reports. Our AI reads every transaction, 
                          understands your spending patterns, and automatically flags missed payments, duplicate charges, 
                          and hidden revenue leaks.
                        </p>
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          Your documents are encrypted and processed securely.
                        </p>
                      </div>
                    </div>
                    
                    <Link to="/uploads-pos" className="shrink-0">
                      <Button size="lg" className="w-full lg:w-auto gap-2 shadow-lg shadow-primary/25 h-12 px-6">
                        <Upload className="w-5 h-5" />
                        Upload Documents
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* What AI Finds Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">What Our AI Typically Finds</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="group border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/5 hover:border-red-500/30 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Missed Payments</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">Invoices that were underpaid, paid late, or never paid at all — revenue you've earned but haven't fully received.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="group border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/5 hover:border-amber-500/30 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <CreditCard className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Duplicate Charges</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">Services or vendors that charged you more than once, including repeated SaaS billing and processing errors.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="group border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <AlertTriangle className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1">Forgotten Subscriptions</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">Recurring subscriptions you're still paying for but no longer use, creating silent monthly spending.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Average user finds <span className="font-bold text-gradient text-base">$847</span> in recoverable revenue
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <InsightsSection isTrial={false} hasData={hasData} />
          <ProfitOverview isTrial={false} hasData={hasData} />
          <ItemBreakdownTable isTrial={false} hasData={hasData} />
          <InsightsAnalysisTabs isTrial={false} hasData={hasData} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;