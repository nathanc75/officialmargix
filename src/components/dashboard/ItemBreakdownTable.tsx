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
    { value: 'loss', label: 'Losses' },
    { value: 'profitable', label: 'Profits' },
  ];

  return (
    <Card className="border shadow-md bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b bg-muted/10">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight uppercase">Order Breakdown</h3>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Detailed platform transaction analysis</p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-muted rounded-lg border-2 shadow-inner">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all uppercase tracking-widest ${
                  filter === btn.value
                    ? 'bg-background shadow-md text-foreground border'
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
          <div className="grid grid-cols-7 gap-4 px-6 py-4 bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b">
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
                    ? "bg-red-500/[0.04]"
                    : "hover:bg-muted/30"
                }`}
              >
                <span className="font-mono text-xs font-bold text-muted-foreground">{item.orderId}</span>
                <span className="font-bold text-foreground">{item.name}</span>
                <span>
                  <Badge variant="outline" className={`text-xs uppercase font-bold border-0 ${getPlatformColor(item.platform)} px-2.5 py-1 tracking-wider`}>
                    {item.platform}
                  </Badge>
                </span>
                <span className="text-right font-bold text-muted-foreground">{item.price}</span>
                <span className="text-right text-red-600 font-bold">{item.fees}</span>
                <span className={`text-right font-bold ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-600"}`}>
                  {item.promo}
                </span>
                <span className={`text-right font-black text-lg ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>
                  {item.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {filteredItems.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="h-9 px-5 text-xs font-bold uppercase tracking-widest border shadow-sm"
              >
                {showAll ? "Show less" : `View all ${filteredItems.length} entries`}
                {showAll ? <ChevronUp className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3" />}
              </Button>
            )}
            <Badge variant="secondary" className="text-xs font-bold uppercase py-1 bg-muted tracking-widest">
              {lossCount} leaks detected
            </Badge>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="space-y-1 text-right">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Period Profit</p>
              <p className="text-xl font-bold text-primary tracking-tight">${totalProfit.toFixed(2)}</p>
            </div>
            <div className="w-px h-10 bg-border shadow-sm" />
            <div className="space-y-1 text-right">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Avg / Transaction</p>
              <p className="text-xl font-bold text-emerald-600 tracking-tight">${avgProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;
