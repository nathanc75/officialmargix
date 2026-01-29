import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileCheck, Menu, Upload } from "lucide-react";
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
  documentType: string;
  setDocumentType: (value: string) => void;
  isTrial?: boolean;
}

const DashboardHeader = ({ dateRange, setDateRange, documentType, setDocumentType, isTrial = false }: DashboardHeaderProps) => {
  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-24 items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-11 sm:w-11 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 transition-transform group-hover:scale-105">
                <img 
                  src={margixLogo} 
                  alt="MARGIX" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-foreground leading-none tracking-tight">MARGIX</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block font-medium">Leak Detection Dashboard</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 ml-4">
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 text-sm bg-primary/10 text-primary border-primary/20 font-medium">
                <FileCheck className="h-3.5 w-3.5" />
                AI-Powered Scan
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 bg-muted/50 p-1.5 rounded-lg border">
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-[110px] lg:w-[140px] h-9 text-sm border-0 bg-transparent focus:ring-0 font-medium">
                  <SelectValue placeholder="Document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  <SelectItem value="bank">Bank Statements</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="payments">Payment Reports</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-px h-5 bg-border" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[110px] lg:w-[130px] h-9 text-sm border-0 bg-transparent focus:ring-0 font-medium">
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
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] z-[100]">
                  <SheetHeader>
                    <SheetTitle>Filter Analysis</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Document Type</label>
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="z-[110]">
                          <SelectItem value="all">All Documents</SelectItem>
                          <SelectItem value="bank">Bank Statements</SelectItem>
                          <SelectItem value="invoices">Invoices</SelectItem>
                          <SelectItem value="payments">Payment Reports</SelectItem>
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
                size="default"
                className="h-10 sm:h-11 px-4 sm:px-6 text-sm font-medium gap-2 shadow-md"
                data-testid="button-upload"
              >
                <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Upload</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
