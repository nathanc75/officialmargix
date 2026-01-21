import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import PromoAnalysis from "@/components/dashboard/PromoAnalysis";
import AIRecommendations from "@/components/dashboard/AIRecommendations";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [platform, setPlatform] = useState("all");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements matching landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orb */}
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        
        {/* Grid pattern */}
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
        <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} platform={platform} setPlatform={setPlatform} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <ProfitOverview />
          <InsightsSection />
          
          {/* Main table - full width */}
          <ItemBreakdownTable />
          
          {/* Secondary sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            <PromoAnalysis />
            <AIRecommendations />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
