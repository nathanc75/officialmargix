import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileCheck } from "lucide-react";
import margixLogo from "@/assets/margix-logo.png";
import { useGoBack } from "@/hooks/useGoBack";
import { useUser } from "@/context/UserContext";

const DashboardHeader = () => {
  const goBack = useGoBack();
  const { user } = useUser();
  
  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-105">
                <img 
                  src={margixLogo} 
                  alt="MARGIX" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold text-foreground leading-none tracking-tight">MARGIX</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block font-medium">Leak Detection Dashboard</p>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center gap-2 ml-4">
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs bg-primary/10 text-primary border-primary/20 font-medium">
                <FileCheck className="h-3 w-3" />
                AI-Powered Scan
              </Badge>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;