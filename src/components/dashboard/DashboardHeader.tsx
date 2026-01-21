import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
}

const DashboardHeader = ({ dateRange, setDateRange, platform, setPlatform }: DashboardHeaderProps) => {
  return (
    <header 
      className="sticky top-2 sm:top-4 left-2 right-2 sm:left-4 sm:right-4 z-50 mx-2 sm:mx-4 lg:mx-auto max-w-7xl backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),0_0_60px_-15px_hsl(221,83%,53%,0.3)] border border-white/20"
      style={{ background: 'linear-gradient(135deg, hsl(var(--hero-gradient-start) / 0.4) 0%, hsl(var(--hero-gradient-end) / 0.3) 100%)' }}
    >
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 sm:h-16 gap-3 sm:gap-0">
          {/* Top row on mobile - Logo and back */}
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div 
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] flex items-center justify-center"
                  style={{
                    background: `
                      radial-gradient(12px 12px at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
                      linear-gradient(135deg, rgba(60,120,255,0.95), rgba(130,80,255,0.80))
                    `,
                    boxShadow: '0 10px 25px rgba(46,108,255,0.22)'
                  }}
                >
                  <span className="text-white font-semibold text-sm sm:text-base" style={{ fontFamily: "'Orbitron', sans-serif" }}>M</span>
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-semibold text-foreground">Restaurant</h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Dashboard</p>
                </div>
              </div>
            </div>
            
            {/* Platform badges - show on sm only, hide on mobile and md+ */}
            <div className="hidden lg:flex items-center gap-2">
              <Badge variant="outline" className="gap-1 py-0.5 px-2 text-xs bg-emerald-50/80 text-emerald-700 border-emerald-200/50 backdrop-blur-sm">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Uber Eats
              </Badge>
              <Badge variant="outline" className="gap-1 py-0.5 px-2 text-xs bg-emerald-50/80 text-emerald-700 border-emerald-200/50 backdrop-blur-sm">
                <CheckCircle2 className="h-2.5 w-2.5" />
                DoorDash
              </Badge>
              <Badge variant="outline" className="gap-1 py-0.5 px-2 text-xs bg-white/50 text-muted-foreground border-white/30 backdrop-blur-sm">
                <Clock className="h-2.5 w-2.5" />
                POS
              </Badge>
            </div>
          </div>

          {/* Bottom row on mobile - Platform & Date Range */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="flex-1 sm:flex-none sm:w-[140px] md:w-[160px] h-9 text-xs sm:text-sm bg-white/50 border-white/30 backdrop-blur-sm">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="uber-eats">Uber Eats</SelectItem>
                <SelectItem value="doordash">DoorDash</SelectItem>
                <SelectItem value="grubhub">Grubhub</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="flex-1 sm:flex-none sm:w-[140px] md:w-[160px] h-9 text-xs sm:text-sm bg-white/50 border-white/30 backdrop-blur-sm">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
