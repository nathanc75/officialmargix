import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, Sparkles, Brain, AlertTriangle, TrendingDown, CreditCard } from "lucide-react";
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative pt-4">
        <DashboardHeader 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
          documentType={documentType} 
          setDocumentType={setDocumentType}
          isTrial={false}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          
          {/* Upload Documents Card with AI Preview */}
          {!hasData && (
            <div className="space-y-4">
              {/* Main Upload Card */}
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">Start Scanning for Revenue Leaks</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          Upload financial documents and our AI will extract transactions, categorize spending, and detect missed revenue.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Link to="/uploads-pos" className="flex-1 sm:flex-none">
                        <Button className="w-full gap-2" data-testid="button-upload-documents">
                          <Upload className="w-4 h-4" />
                          Upload Documents
                        </Button>
                      </Link>
                      <Link to="/uploads-pos" className="flex-1 sm:flex-none">
                        <Button variant="outline" className="w-full gap-2" data-testid="button-view-sample">
                          <FileText className="w-4 h-4" />
                          View Sample
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Intelligence Preview - Ghost State */}
              <Card className="border-dashed border-muted-foreground/20 bg-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground text-sm">What Our AI Typically Finds</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Missed Payments</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Invoices paid late or unpaid</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Duplicate Charges</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Same SaaS billed twice</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Forgotten Subscriptions</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Services you no longer use</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground mt-4 text-center">
                    Average user finds <span className="font-semibold text-primary">$847</span> in recoverable revenue
                  </p>
                </CardContent>
              </Card>
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
