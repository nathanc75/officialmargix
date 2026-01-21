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
    <header 
      className="sticky top-4 left-4 right-4 z-50 mx-4 lg:mx-auto max-w-7xl backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),0_0_60px_-15px_hsl(221,83%,53%,0.3)] border border-white/20"
      style={{ background: 'linear-gradient(135deg, hsl(var(--hero-gradient-start) / 0.4) 0%, hsl(var(--hero-gradient-end) / 0.3) 100%)' }}
    >
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and back */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                style={{
                  background: `
                    radial-gradient(12px 12px at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
                    linear-gradient(135deg, rgba(60,120,255,0.95), rgba(130,80,255,0.80))
                  `,
                  boxShadow: '0 10px 25px rgba(46,108,255,0.22)'
                }}
              >
                <span className="text-white font-semibold text-base" style={{ fontFamily: "'Orbitron', sans-serif" }}>M</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Restaurant</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center - Date Range */}
          <div className="hidden md:block">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] bg-white/50 border-white/30 backdrop-blur-sm">
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
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-emerald-50/80 text-emerald-700 border-emerald-200/50 backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3" />
                Uber Eats
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-emerald-50/80 text-emerald-700 border-emerald-200/50 backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3" />
                DoorDash
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1 px-2.5 bg-white/50 text-muted-foreground border-white/30 backdrop-blur-sm">
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
