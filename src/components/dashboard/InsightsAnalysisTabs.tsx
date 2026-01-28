import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Lock, Sparkles, Upload, CreditCard, CheckCircle, AlertCircle, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportAnalysis } from "@/context/AnalysisContext";

interface InsightsAnalysisTabsProps {
  isTrial?: boolean;
  hasData?: boolean;
  reportAnalysis?: ReportAnalysis | null;
}

const InsightsAnalysisTabs = ({ isTrial = false, hasData = false, reportAnalysis }: InsightsAnalysisTabsProps) => {
  const recommendations = reportAnalysis?.recommendations || [];
  const subscriptionIssues = reportAnalysis?.issues?.filter(i => i.type === 'unused_subscription' || i.type === 'duplicate_charge') || [];

  if (!hasData) {
    return (
      <Card className="border shadow-sm bg-card overflow-hidden">
        <Tabs defaultValue="leaks" className="w-full">
          <CardHeader className="p-0 border-b bg-muted/30">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none overflow-x-auto overflow-y-hidden no-scrollbar">
              <TabsTrigger 
                value="leaks" 
                className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap"
              >
                Subscriptions & Charges
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-2 whitespace-nowrap"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                AI Recommendations
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <TabsContent value="leaks" className="mt-0">
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Subscription Data</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Upload bank statements to detect unused subscriptions and duplicate charges
                </p>
                <Link to="/uploads-pos">
                  <Button variant="outline" className="gap-2" data-testid="button-upload-for-subscriptions">
                    <Upload className="h-4 w-4" />
                    Upload Documents
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Recommendations Unavailable</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Upload financial documents to get AI-powered recommendations for recovering lost revenue
                </p>
                <Link to="/uploads-pos">
                  <Button className="gap-2" data-testid="button-upload-for-ai">
                    <Upload className="h-4 w-4" />
                    Upload Documents
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm bg-card overflow-hidden">
      <Tabs defaultValue="ai" className="w-full">
        <CardHeader className="p-0 border-b bg-muted/30">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none overflow-x-auto overflow-y-hidden no-scrollbar">
            <TabsTrigger 
              value="leaks" 
              className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap"
            >
              Subscriptions & Charges
              {subscriptionIssues.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-600 rounded">
                  {subscriptionIssues.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-2 whitespace-nowrap"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              AI Recommendations
              {recommendations.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-primary/20 text-primary rounded">
                  {recommendations.length}
                </span>
              )}
              {isTrial && <Lock className="h-3 w-3 text-amber-500" />}
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="leaks" className="mt-0">
            {subscriptionIssues.length > 0 ? (
              <div className="space-y-3">
                {subscriptionIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <Receipt className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{issue.description}</p>
                      {issue.potentialRecovery > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Potential savings: <span className="font-semibold text-emerald-600">${issue.potentialRecovery.toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No duplicate charges or unused subscriptions detected</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{rec}</p>
                  </div>
                ))}
                {isTrial && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-muted-foreground/20 text-center">
                    <Lock className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground mb-1">More insights available</p>
                    <p className="text-xs text-muted-foreground mb-3">Upgrade to unlock detailed action plans and priority recommendations</p>
                    <Link to="/pricing">
                      <Button size="sm" className="gap-2">
                        <Sparkles className="h-3 w-3" />
                        Unlock Full Insights
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">AI recommendations will appear after document analysis</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default InsightsAnalysisTabs;
