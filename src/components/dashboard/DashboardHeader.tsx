import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Upload } from "lucide-react";

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
        <div className="flex h-20 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary shadow-md"
              >
                <span className="text-primary-foreground font-black text-2xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground leading-none tracking-tight">Restaurant</h1>
                <p className="text-sm text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">Analytics Dashboard</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-3 ml-6">
              <Badge variant="secondary" className="gap-2 py-1.5 px-4 text-sm bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 font-black uppercase tracking-widest">
                <CheckCircle2 className="h-4 w-4" />
                Uber Eats
              </Badge>
              <Badge variant="secondary" className="gap-2 py-1.5 px-4 text-sm bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 font-black uppercase tracking-widest">
                <CheckCircle2 className="h-4 w-4" />
                DoorDash
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-xl border-2 shadow-inner">
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-[180px] h-11 text-base border-0 bg-transparent focus:ring-0 font-black uppercase tracking-wide">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-bold text-base">All Platforms</SelectItem>
                  <SelectItem value="uber-eats" className="font-bold text-base">Uber Eats</SelectItem>
                  <SelectItem value="doordash" className="font-bold text-base">DoorDash</SelectItem>
                  <SelectItem value="grubhub" className="font-bold text-base">Grubhub</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-px h-6 bg-border" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] h-11 text-base border-0 bg-transparent focus:ring-0 font-black uppercase tracking-wide">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today" className="font-bold text-base">Today</SelectItem>
                  <SelectItem value="7days" className="font-bold text-base">Last 7 Days</SelectItem>
                  <SelectItem value="30days" className="font-bold text-base">Last 30 Days</SelectItem>
                  <SelectItem value="custom" className="font-bold text-base">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link to="/uploads-pos">
              <Button 
                variant="default" 
                size="lg"
                className="h-11 gap-3 shadow-lg font-black text-base px-6 uppercase tracking-widest"
              >
                <Upload className="h-5 w-5" />
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
