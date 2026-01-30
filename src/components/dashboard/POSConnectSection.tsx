import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Clover, Zap } from "lucide-react";
import { SiSquare } from "react-icons/si";

const POSConnectSection = () => {
  const platforms = [
    { 
      name: "Square POS", 
      icon: <SiSquare className="h-5 w-5 text-white" />, 
      color: "bg-gradient-to-br from-[#006AFF] to-[#0052CC]",
      shadowColor: "shadow-[#006AFF]/20",
      borderColor: "border-blue-500/30",
      hoverBorder: "hover:border-blue-500/50",
      bgGradient: "from-blue-500/5 to-transparent"
    },
    { 
      name: "Toast", 
      icon: <div className="font-bold text-white text-sm">T</div>, 
      color: "bg-gradient-to-br from-[#FF6600] to-[#E55A00]",
      shadowColor: "shadow-orange-500/20",
      borderColor: "border-orange-500/30",
      hoverBorder: "hover:border-orange-500/50",
      bgGradient: "from-orange-500/5 to-transparent"
    },
    { 
      name: "Clover", 
      icon: <Clover className="h-5 w-5 text-white" />, 
      color: "bg-gradient-to-br from-[#1BC47D] to-[#15A066]",
      shadowColor: "shadow-emerald-500/20",
      borderColor: "border-emerald-500/30",
      hoverBorder: "hover:border-emerald-500/50",
      bgGradient: "from-emerald-500/5 to-transparent"
    },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Connect POS Systems</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Card 
            key={platform.name} 
            className={`group relative overflow-hidden border ${platform.borderColor} bg-gradient-to-br from-card via-card ${platform.bgGradient} ${platform.hoverBorder} hover:shadow-lg transition-all duration-300`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${platform.color} flex items-center justify-center shadow-lg ${platform.shadowColor} group-hover:scale-105 transition-transform duration-300`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{platform.name}</h3>
                    <p className="text-xs text-amber-600 font-medium">Coming Soon</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-[10px] px-2 py-0.5 font-medium">
                  <Clock className="h-2.5 w-2.5 mr-1" />
                  Soon
                </Badge>
              </div>
              <Button 
                variant="outline"
                className="w-full gap-2 text-muted-foreground border-dashed"
                size="sm"
                disabled
              >
                <Clock className="h-3.5 w-3.5" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default POSConnectSection;
