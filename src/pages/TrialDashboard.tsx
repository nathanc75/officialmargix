import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalysisBanner from "@/components/dashboard/AnalysisBanner";
import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import InsightsAnalysisTabs from "@/components/dashboard/InsightsAnalysisTabs";
import LockedPremiumSection from "@/components/dashboard/LockedPremiumSection";
import { useAnalysis } from "@/context/AnalysisContext";

const TrialDashboard = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [platform, setPlatform] = useState("all");
  const { hasData, reportAnalysis, isAnalyzing, analysisStep } = useAnalysis();

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
          isTrial={true}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <AnalysisBanner 
            hasData={hasData} 
            reportAnalysis={reportAnalysis}
            isAnalyzing={isAnalyzing}
            analysisStep={analysisStep}
          />
          <InsightsSection isTrial={true} hasData={hasData} reportAnalysis={reportAnalysis} />
          <ProfitOverview isTrial={true} hasData={hasData} reportAnalysis={reportAnalysis} />
          <ItemBreakdownTable isTrial={true} hasData={hasData} reportAnalysis={reportAnalysis} />
          <InsightsAnalysisTabs isTrial={true} hasData={hasData} reportAnalysis={reportAnalysis} />
          <LockedPremiumSection />
        </main>
      </div>
    </div>
  );
};

export default TrialDashboard;
