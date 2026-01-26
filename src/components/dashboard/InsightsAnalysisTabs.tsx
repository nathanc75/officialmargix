import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Lock, Sparkles, Upload, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface InsightsAnalysisTabsProps {
  isTrial?: boolean;
  hasData?: boolean;
}

const InsightsAnalysisTabs = ({ isTrial = false, hasData = false }: InsightsAnalysisTabsProps) => {
  if (!hasData) {
    return (
      <Card className="border shadow-sm bg-card overflow-hidden">
        <Tabs defaultValue="promos" className="w-full">
          <CardHeader className="p-0 border-b bg-muted/30">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none overflow-x-auto overflow-y-hidden no-scrollbar">
              <TabsTrigger 
                value="promos" 
                className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap"
              >
                Promo Performance
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-2 whitespace-nowrap"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                AI Suggestions
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <TabsContent value="promos" className="mt-0">
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Promo Data</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Upload reports to analyze promo code performance
                </p>
                <Link to="/uploads">
                  <Button variant="outline" className="gap-2" data-testid="button-upload-for-promos">
                    <Upload className="h-4 w-4" />
                    Upload Reports
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Suggestions Unavailable</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Upload your delivery reports and menu screenshots to get AI-powered recommendations
                </p>
                <Link to="/uploads">
                  <Button className="gap-2" data-testid="button-upload-for-ai">
                    <Upload className="h-4 w-4" />
                    Upload Data
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    );
  }

  // Placeholder for when data exists - would show actual promo/AI data
  return (
    <Card className="border shadow-sm bg-card overflow-hidden">
      <Tabs defaultValue="promos" className="w-full">
        <CardHeader className="p-0 border-b bg-muted/30">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none overflow-x-auto overflow-y-hidden no-scrollbar">
            <TabsTrigger 
              value="promos" 
              className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap"
            >
              Promo Performance
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-2 whitespace-nowrap"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              AI Suggestions
              {isTrial && <Lock className="h-3 w-3 text-amber-500" />}
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <TabsContent value="promos" className="mt-0">
            <p className="text-sm text-muted-foreground text-center py-8">Promo performance data will appear after AI analysis</p>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0">
            <p className="text-sm text-muted-foreground text-center py-8">AI suggestions will appear after report analysis</p>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default InsightsAnalysisTabs;
