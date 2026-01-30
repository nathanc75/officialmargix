import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Clover, Zap } from "lucide-react";
import { SiSquare } from "react-icons/si";

const POSConnectSection = () => {
  const platforms = [
    { 
      name: "Square POS", 
      icon: <SiSquare className="h-5 w-5 text-muted-foreground" />, 
    },
    { 
      name: "Toast", 
      icon: <div className="font-bold text-muted-foreground text-sm">T</div>, 
    },
    { 
      name: "Clover", 
      icon: <Clover className="h-5 w-5 text-muted-foreground" />, 
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
            className="group relative overflow-hidden border border-border/60 bg-card hover:shadow-lg hover:border-border transition-all duration-300"
          >
            <CardContent className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-muted/50 border border-border flex items-center justify-center group-hover:bg-muted transition-colors duration-300">
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{platform.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">Coming Soon</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-muted-foreground border-border bg-muted/30 text-[10px] px-2 py-0.5 font-medium">
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
