import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Clock, Upload } from "lucide-react";

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
}

const DashboardHeader = ({ dateRange, setDateRange, platform, setPlatform }: DashboardHeaderProps) => {
  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side - Logo and back */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary shadow-sm"
              >
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground leading-none">Restaurant</h1>
                <p className="text-xs text-muted-foreground mt-1">Analytics Dashboard</p>
              </div>
            </div>
            
            {/* Platform badges - show on lg only */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <Badge variant="secondary" className="gap-1 py-0.5 px-2 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Uber Eats
              </Badge>
              <Badge variant="secondary" className="gap-1 py-0.5 px-2 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <CheckCircle2 className="h-2.5 w-2.5" />
                DoorDash
              </Badge>
            </div>
          </div>

          {/* Right side - Controls */}
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-lg border">
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-[140px] h-9 text-sm border-0 bg-transparent focus:ring-0">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="uber-eats">Uber Eats</SelectItem>
                  <SelectItem value="doordash">DoorDash</SelectItem>
                  <SelectItem value="grubhub">Grubhub</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-px h-5 bg-border" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px] h-9 text-sm border-0 bg-transparent focus:ring-0">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link to="/uploads-pos">
              <Button 
                variant="default" 
                size="sm"
                className="h-9 gap-2 shadow-sm"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sync Data</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
