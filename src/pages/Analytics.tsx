import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import InsightsAnalysisTabs from "@/components/dashboard/InsightsAnalysisTabs";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [platform, setPlatform] = useState("all");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardHeader 
        dateRange={dateRange} 
        setDateRange={setDateRange}
        platform={platform}
        setPlatform={setPlatform}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <InsightsSection />
        <ProfitOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-12">
            <InsightsAnalysisTabs />
          </div>
          <div className="lg:col-span-12">
            <ItemBreakdownTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
