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
          
          
          {/* AI Intelligence Preview - Ghost State */}
          {!hasData && (
            <Card className="border-dashed border-muted-foreground/20 bg-muted/30 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <Brain className="w-6 h-6 text-primary animate-pulse" />
                  <h4 className="font-semibold text-foreground text-base">What Our AI Typically Finds</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-red-500/30 group">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Missed Payments</p>
                      <p className="text-xs text-muted-foreground mt-1">Invoices paid late or unpaid</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-amber-500/30 group">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <CreditCard className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Duplicate Charges</p>
                      <p className="text-xs text-muted-foreground mt-1">Same SaaS billed twice</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-orange-500/30 group">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Forgotten Subscriptions</p>
                      <p className="text-xs text-muted-foreground mt-1">Services you no longer use</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-5 text-center">
                  Average user finds <span className="font-semibold text-primary animate-pulse">$847</span> in recoverable revenue
                </p>
              </CardContent>
            </Card>
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
