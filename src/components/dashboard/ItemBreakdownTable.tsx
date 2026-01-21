import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ItemBreakdownTable = () => {
  const items = [
    { name: "Chicken Bowl", price: "$14.99", fees: "-$3.75", promo: "-$1.50", profit: "$9.74", profitable: true },
    { name: "Beef Bulgogi", price: "$16.99", fees: "-$4.25", promo: "$0.00", profit: "$12.74", profitable: true },
    { name: "Veggie Bibimbap", price: "$12.99", fees: "-$3.25", promo: "-$2.60", profit: "$7.14", profitable: true },
    { name: "Korean Fried Chicken", price: "$11.99", fees: "-$3.00", promo: "-$6.00", profit: "$2.99", profitable: true },
    { name: "Kimchi Fries", price: "$8.99", fees: "-$2.25", promo: "-$4.50", profit: "$2.24", profitable: true },
    { name: "Bubble Tea", price: "$5.99", fees: "-$1.50", promo: "-$3.00", profit: "$1.49", profitable: true },
    { name: "Spring Rolls", price: "$6.99", fees: "-$1.75", promo: "-$5.60", profit: "-$0.36", profitable: false },
    { name: "Edamame", price: "$4.99", fees: "-$1.25", promo: "-$4.00", profit: "-$0.26", profitable: false },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Outer glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-2xl blur-sm opacity-60" />
      
      {/* Main card */}
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 border border-border/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden backdrop-blur-sm">
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative p-4 sm:p-6 flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/70 shadow-sm shadow-destructive/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70 shadow-sm shadow-yellow-500/30" />
              <div className="w-3 h-3 rounded-full bg-green-500/70 shadow-sm shadow-green-500/30" />
            </div>
            <div className="text-sm font-medium text-foreground px-3 py-1.5 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/30">
              Item-Level Profit Breakdown
            </div>
          </div>

          {/* CSV Table */}
          <div className="flex-1 rounded-xl bg-secondary/20 overflow-hidden border border-border/20 shadow-inner">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-2 px-4 py-2.5 bg-gradient-to-r from-secondary/60 to-secondary/40 text-xs font-semibold text-muted-foreground border-b border-border/30 uppercase tracking-wide">
              <span>Item</span>
              <span className="text-right">Price</span>
              <span className="text-right">Fees</span>
              <span className="text-right">Promo</span>
              <span className="text-right">Profit</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/20 max-h-[320px] overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.name}
                  className={`grid grid-cols-5 gap-2 px-4 py-2.5 text-xs transition-all duration-300 ${
                    !item.profitable
                      ? "bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent"
                      : "bg-transparent hover:bg-secondary/30"
                  }`}
                >
                  <span className="font-medium text-foreground truncate">{item.name}</span>
                  <span className="text-right text-muted-foreground">{item.price}</span>
                  <span className="text-right text-red-500 font-medium">{item.fees}</span>
                  <span className={`text-right font-medium ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-500"}`}>
                    {item.promo}
                  </span>
                  <span className={`text-right font-semibold ${
                    item.profitable ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {item.profit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-border/30">
            <span className="text-xs text-muted-foreground font-medium">
              {items.filter(i => !i.profitable).length} items at a loss
            </span>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
              <span className="text-xs text-muted-foreground">Avg Profit:</span>
              <span className="text-sm font-bold text-emerald-600">
                $4.72
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBreakdownTable;
