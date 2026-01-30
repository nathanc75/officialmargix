import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Clover } from "lucide-react";
import { SiSquare } from "react-icons/si";

const POSConnectSection = () => {
  const platforms = [
    { name: "Square POS", icon: <SiSquare className="h-5 w-5 text-white" />, color: "bg-[#006AFF]" },
    { name: "Toast", icon: <div className="font-bold text-white text-sm">T</div>, color: "bg-[#FF6600]" },
    { name: "Clover", icon: <Clover className="h-5 w-5 text-white" />, color: "bg-[#1BC47D]" },
  ];

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Connect POS Systems</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Card key={platform.name} className="border border-border/50 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${platform.color} flex items-center justify-center shadow-sm grayscale opacity-70`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{platform.name}</h3>
                    <p className="text-xs text-amber-600">Coming Soon</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-50 text-[10px] px-2 py-0.5">
                  <Clock className="h-2.5 w-2.5 mr-1" />
                  Soon
                </Badge>
              </div>
              <Button 
                variant="outline"
                className="w-full gap-2 opacity-60 cursor-not-allowed text-muted-foreground"
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
