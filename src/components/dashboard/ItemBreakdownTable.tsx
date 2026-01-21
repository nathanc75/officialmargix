import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterType = 'all' | 'profitable' | 'loss';

const ItemBreakdownTable = () => {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  
  const allItems = [
    { orderId: "#UE-4821", name: "Chicken Bowl", platform: "Uber Eats", price: "$14.99", fees: "-$3.75", promo: "-$1.50", profit: "$9.74", profitable: true },
    { orderId: "#DD-7392", name: "Beef Bulgogi", platform: "DoorDash", price: "$16.99", fees: "-$4.25", promo: "$0.00", profit: "$12.74", profitable: true },
    { orderId: "#UE-4823", name: "Veggie Bibimbap", platform: "Uber Eats", price: "$12.99", fees: "-$3.25", promo: "-$2.60", profit: "$7.14", profitable: true },
    { orderId: "#GH-1056", name: "Korean Fried Chicken", platform: "Grubhub", price: "$11.99", fees: "-$3.00", promo: "-$6.00", profit: "$2.99", profitable: true },
    { orderId: "#DD-7395", name: "Kimchi Fries", platform: "DoorDash", price: "$8.99", fees: "-$2.25", promo: "-$4.50", profit: "$2.24", profitable: true },
    { orderId: "#UE-4827", name: "Bubble Tea", platform: "Uber Eats", price: "$5.99", fees: "-$1.50", promo: "-$3.00", profit: "$1.49", profitable: true },
    { orderId: "#GH-1058", name: "Mochi Ice Cream", platform: "Grubhub", price: "$4.99", fees: "-$1.25", promo: "-$2.50", profit: "$1.24", profitable: true },
    { orderId: "#DD-7401", name: "Spring Rolls", platform: "DoorDash", price: "$6.99", fees: "-$1.75", promo: "-$5.60", profit: "-$0.36", profitable: false },
    { orderId: "#UE-4832", name: "Edamame", platform: "Uber Eats", price: "$4.99", fees: "-$1.25", promo: "-$4.00", profit: "-$0.26", profitable: false },
  ];

  // Sort to show loss items first
  const sortedItems = [...allItems].sort((a, b) => {
    if (!a.profitable && b.profitable) return -1;
    if (a.profitable && !b.profitable) return 1;
    return 0;
  });

  const filteredItems = sortedItems.filter(item => {
    if (filter === 'profitable') return item.profitable;
    if (filter === 'loss') return !item.profitable;
    return true;
  });

  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);
  const totalProfit = allItems.reduce((sum, item) => sum + parseFloat(item.profit.replace('$', '')), 0);
  const avgProfit = totalProfit / allItems.length;
  const lossCount = allItems.filter(i => !i.profitable).length;

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Uber Eats": return "bg-emerald-100 text-emerald-700";
      case "DoorDash": return "bg-red-100 text-red-700";
      case "Grubhub": return "bg-orange-100 text-orange-700";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'loss', label: 'At Loss' },
    { value: 'profitable', label: 'Profitable' },
  ];

  return (
    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-transparent to-primary/20 rounded-xl sm:rounded-2xl blur-md opacity-70" />
      
      <div className="relative h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 border border-border/50 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative p-4 sm:p-6 lg:p-8 flex flex-col">
          {/* Header with filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Item Breakdown</h3>
              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                {lossCount} at loss
              </span>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-secondary/40 rounded-lg">
              {filterButtons.map(btn => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    filter === btn.value
                      ? 'bg-white shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block flex-1 rounded-xl bg-secondary/20 overflow-hidden border border-border/20 shadow-inner">
            <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gradient-to-r from-secondary/60 to-secondary/40 text-xs font-semibold text-muted-foreground border-b border-border/30 uppercase tracking-wide">
              <span>Order ID</span>
              <span>Item</span>
              <span>Platform</span>
              <span className="text-right">Price</span>
              <span className="text-right">Fees</span>
              <span className="text-right">Promo</span>
              <span className="text-right">Profit</span>
            </div>

            <div className="divide-y divide-border/20">
              {displayItems.map((item) => (
                <div
                  key={item.orderId}
                  className={`grid grid-cols-7 gap-4 px-6 py-3 text-sm transition-all duration-300 ${
                    !item.profitable
                      ? "bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent"
                      : "bg-transparent hover:bg-secondary/30"
                  }`}
                >
                  <span className="font-mono text-muted-foreground text-xs">{item.orderId}</span>
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getPlatformColor(item.platform)}`}>
                      {item.platform}
                    </span>
                  </span>
                  <span className="text-right text-muted-foreground">{item.price}</span>
                  <span className="text-right text-red-500 font-medium">{item.fees}</span>
                  <span className={`text-right font-medium ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-500"}`}>
                    {item.promo}
                  </span>
                  <span className={`text-right font-bold ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>
                    {item.profit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-2">
            {displayItems.map((item) => (
              <div
                key={item.orderId}
                className={`rounded-lg p-3 border transition-all ${
                  !item.profitable
                    ? "bg-red-500/5 border-red-200/50"
                    : "bg-white/50 border-border/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.orderId}</p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getPlatformColor(item.platform)}`}>
                    {item.platform}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium">{item.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fees</p>
                    <p className="font-medium text-red-500">{item.fees}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Promo</p>
                    <p className={`font-medium ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-500"}`}>{item.promo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit</p>
                    <p className={`font-bold ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>{item.profit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All / Show Less + Stats */}
          <div className="mt-4 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border/30">
            {filteredItems.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                {showAll ? (
                  <>Show Less <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>View All {filteredItems.length} Items <ChevronDown className="h-3 w-3" /></>
                )}
              </Button>
            )}
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                <span className="text-xs text-muted-foreground">Total:</span>
                <span className="text-sm font-bold text-primary">${totalProfit.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <span className="text-xs text-muted-foreground">Avg:</span>
                <span className="text-sm font-bold text-emerald-600">${avgProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBreakdownTable;
