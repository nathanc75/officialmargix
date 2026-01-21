import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const PromoAnalysis = () => {
  const promos = [
    { 
      name: "SAVE20", 
      cost: "$620", 
      revenue: "$890", 
      impact: "+$270", 
      profitable: true,
      platform: "Uber Eats"
    },
    { 
      name: "BOGO Friday", 
      cost: "$420", 
      revenue: "$310", 
      impact: "-$110", 
      profitable: false,
      platform: "DoorDash"
    },
    { 
      name: "Free Delivery", 
      cost: "$380", 
      revenue: "$520", 
      impact: "+$140", 
      profitable: true,
      platform: "Uber Eats"
    },
    { 
      name: "15% Off First Order", 
      cost: "$420", 
      revenue: "$280", 
      impact: "-$140", 
      profitable: false,
      platform: "DoorDash"
    },
  ];

  return (
    <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      <CardHeader className="pb-3 bg-gradient-to-r from-secondary/50 to-transparent">
        <CardTitle className="text-base font-semibold">Promo Impact Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {promos.map((promo) => (
          <div 
            key={promo.name} 
            className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
              promo.profitable 
                ? 'bg-gradient-to-r from-emerald-50/80 to-white/60 border-emerald-200/50' 
                : 'bg-gradient-to-r from-red-50/80 to-white/60 border-red-200/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{promo.name}</span>
                <Badge variant="outline" className="text-xs py-0 bg-white/50 backdrop-blur-sm">
                  {promo.platform}
                </Badge>
              </div>
              <div className={`flex items-center gap-1 font-semibold text-sm ${
                promo.profitable ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {promo.profitable ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {promo.impact}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Cost: {promo.cost}</span>
              <span>Revenue: {promo.revenue}</span>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-50/80 to-white/60 border border-amber-200/50 backdrop-blur-sm">
          <p className="text-xs text-amber-800">
            <strong>Insight:</strong> BOGO Friday promo cost $420 and generated only $310 in additional revenue — not profitable.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoAnalysis;
