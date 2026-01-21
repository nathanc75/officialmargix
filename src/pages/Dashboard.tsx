import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  DollarSign,
  Percent,
  Tag,
  CheckCircle2,
  Clock,
  ChevronRight
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfitOverview from "@/components/dashboard/ProfitOverview";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ItemBreakdownTable from "@/components/dashboard/ItemBreakdownTable";
import PromoAnalysis from "@/components/dashboard/PromoAnalysis";
import AIRecommendations from "@/components/dashboard/AIRecommendations";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("7days");

  return (
    <div className="min-h-screen bg-secondary/30">
      <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ProfitOverview />
        <InsightsSection />
        
        <div className="grid lg:grid-cols-2 gap-8">
          <ItemBreakdownTable />
          <PromoAnalysis />
        </div>
        
        <AIRecommendations />
      </main>
    </div>
  );
};

export default Dashboard;
