import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Lock, Menu, Upload } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import margixLogo from "@/assets/margix-logo.png";

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  isTrial?: boolean;
}

const DashboardHeader = ({ dateRange, setDateRange, platform, setPlatform, isTrial = false }: DashboardHeaderProps) => {
  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-105">
                <img 
                  src={margixLogo} 
                  alt="MARGIX" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xs sm:text-sm font-bold text-foreground leading-none tracking-tight">MARGIX</h1>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 sm:mt-1 font-medium">Analytics Dashboard</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 ml-4">
              <Badge variant="secondary" className="gap-1 py-0.5 px-2 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Uber Eats
              </Badge>
              <Badge variant="secondary" className="gap-1 py-0.5 px-2 text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
                <CheckCircle2 className="h-2.5 w-2.5" />
                DoorDash
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-[100px] lg:w-[120px] h-8 text-xs border-0 bg-transparent focus:ring-0 font-medium">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="uber-eats">Uber Eats</SelectItem>
                  <SelectItem value="doordash">DoorDash</SelectItem>
                  <SelectItem value="grubhub">Grubhub</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-px h-4 bg-border" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[100px] lg:w-[120px] h-8 text-xs border-0 bg-transparent focus:ring-0 font-medium">
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

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] z-[100]">
                  <SheetHeader>
                    <SheetTitle>Filter Analytics</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform</label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent className="z-[110]">
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="uber-eats">Uber Eats</SelectItem>
                          <SelectItem value="doordash">DoorDash</SelectItem>
                          <SelectItem value="grubhub">Grubhub</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Period</label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent className="z-[110]">
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Link to="/uploads">
              <Button 
                variant="default" 
                size="sm"
                className="h-8 sm:h-9 px-3 sm:px-6 text-xs sm:text-sm font-medium gap-2 shadow-sm"
                data-testid="button-upload"
              >
                <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Upload</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
