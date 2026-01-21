import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (value: string) => void;
}

const DashboardHeader = ({ dateRange, setDateRange }: DashboardHeaderProps) => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Cafe Seoul</h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </div>

          {/* Center - Date Range */}
          <div className="hidden md:block">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right side - Platform Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                Uber Eats
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                DoorDash
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-secondary text-muted-foreground border-border">
                <Clock className="h-3 w-3" />
                POS
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
