import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      case "Uber Eats": return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
      case "DoorDash": return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "Grubhub": return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'loss', label: 'At Loss' },
    { value: 'profitable', label: 'Profitable' },
  ];

  return (
    <Card className="border shadow-sm bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Order Breakdown</h3>
            <p className="text-sm text-muted-foreground font-medium">Detailed analysis of individual platform transactions</p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-muted rounded-lg border">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                  filter === btn.value
                    ? 'bg-background shadow-sm text-foreground border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-7 gap-4 px-6 py-4 bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b">
            <span>Order ID</span>
            <span>Item Name</span>
            <span>Platform</span>
            <span className="text-right">Price</span>
            <span className="text-right">Fees</span>
            <span className="text-right">Promo</span>
            <span className="text-right">Profit</span>
          </div>

          <div className="divide-y divide-border">
            {displayItems.map((item) => (
              <div
                key={item.orderId}
                className={`grid grid-cols-7 gap-4 px-6 py-5 text-base items-center transition-colors ${
                  !item.profitable
                    ? "bg-red-500/[0.03]"
                    : "hover:bg-muted/30"
                }`}
              >
                <span className="font-mono text-xs font-bold text-muted-foreground">{item.orderId}</span>
                <span className="font-bold">{item.name}</span>
                <span>
                  <Badge variant="outline" className={`text-xs uppercase font-bold border-0 ${getPlatformColor(item.platform)} px-2 py-1`}>
                    {item.platform}
                  </Badge>
                </span>
                <span className="text-right font-semibold">{item.price}</span>
                <span className="text-right text-red-600 font-bold">{item.fees}</span>
                <span className={`text-right font-bold ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-600"}`}>
                  {item.promo}
                </span>
                <span className={`text-right font-black ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>
                  {item.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden divide-y divide-border">
          {displayItems.map((item) => (
            <div
              key={item.orderId}
              className={`p-4 transition-colors ${
                !item.profitable
                  ? "bg-red-500/[0.03]"
                  : "hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-1">
                  <p className="font-bold text-sm leading-none">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{item.orderId}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] uppercase font-bold border-0 ${getPlatformColor(item.platform)}`}>
                  {item.platform}
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Price</p>
                  <p className="text-xs font-semibold">{item.price}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Fees</p>
                  <p className="text-xs font-semibold text-red-600">{item.fees}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Promo</p>
                  <p className={`text-xs font-semibold ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-600"}`}>{item.promo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Profit</p>
                  <p className={`text-xs font-bold ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>{item.profit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {filteredItems.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="h-8 text-xs font-semibold"
              >
                {showAll ? "Show less" : `View all ${filteredItems.length} entries`}
              </Button>
            )}
            <span className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1 bg-muted rounded border tracking-wider">
              {lossCount} issues detected
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="space-y-0.5 text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Profit</p>
              <p className="text-sm font-bold text-primary">${totalProfit.toFixed(2)}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="space-y-0.5 text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Average/Order</p>
              <p className="text-sm font-bold text-emerald-600">${avgProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;