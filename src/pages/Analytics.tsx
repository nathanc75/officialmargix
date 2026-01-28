import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import InsightsAnalysisTabs from "@/components/dashboard/InsightsAnalysisTabs";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [documentType, setDocumentType] = useState("all");

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <DashboardHeader 
        dateRange={dateRange} 
        setDateRange={setDateRange}
        documentType={documentType}
        setDocumentType={setDocumentType}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8 overflow-x-hidden">
        <InsightsSection />
        <ProfitOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 overflow-hidden">
          <div className="lg:col-span-12 w-full overflow-hidden">
            <InsightsAnalysisTabs />
          </div>
          <div className="lg:col-span-12 w-full overflow-hidden">
            <ItemBreakdownTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
