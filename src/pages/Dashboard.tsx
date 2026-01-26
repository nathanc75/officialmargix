import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Upload, Zap } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PaidSubscriberBanner from "@/components/dashboard/PaidSubscriberBanner";
import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import InsightsAnalysisTabs from "@/components/dashboard/InsightsAnalysisTabs";
import { useUser } from "@/context/UserContext";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [platform, setPlatform] = useState("all");
  const { user } = useUser();
  
  // Check if user has connected any platforms or uploaded data
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
          platform={platform} 
          setPlatform={setPlatform}
          isTrial={false}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <PaidSubscriberBanner />
          
          {/* Connect POS / Upload Data Card */}
          {!hasData && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Get Started with Your Analytics</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Connect your POS system for real-time data syncing, or upload delivery reports to analyze your performance.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Link to="/uploads-pos" className="flex-1 sm:flex-none">
                      <Button className="w-full gap-2" data-testid="button-connect-pos">
                        <Link2 className="w-4 h-4" />
                        Connect POS
                      </Button>
                    </Link>
                    <Link to="/uploads-pos" className="flex-1 sm:flex-none">
                      <Button variant="outline" className="w-full gap-2" data-testid="button-upload-reports">
                        <Upload className="w-4 h-4" />
                        Upload Reports
                      </Button>
                    </Link>
                  </div>
                </div>
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
