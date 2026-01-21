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
    { value: 'loss', label: 'At Loss' },
    { value: 'profitable', label: 'Profitable' },
  ];

  return (
    <Card className="border shadow-md bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b bg-muted/10">
          <div className="space-y-1.5">
            <h3 className="text-2xl font-black tracking-tight">Order Breakdown</h3>
            <p className="text-base text-muted-foreground font-semibold">Detailed analysis of individual platform transactions</p>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted rounded-xl border-2 shadow-inner">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-5 py-2.5 text-sm font-black rounded-lg transition-all uppercase tracking-widest ${
                  filter === btn.value
                    ? 'bg-background shadow-md text-foreground border-2'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-7 gap-6 px-8 py-5 bg-muted/40 text-xs font-black text-muted-foreground uppercase tracking-widest border-b">
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
                className={`grid grid-cols-7 gap-6 px-8 py-6 text-base items-center transition-all hover:bg-muted/10 ${
                  !item.profitable ? "bg-red-500/[0.04]" : ""
                }`}
              >
                <span className="font-mono text-xs font-bold text-muted-foreground tracking-tighter">{item.orderId}</span>
                <span className="font-black text-foreground">{item.name}</span>
                <span>
                  <Badge variant="outline" className={`text-xs uppercase font-black border-2 ${getPlatformColor(item.platform)} px-3 py-1.5 tracking-widest`}>
                    {item.platform}
                  </Badge>
                </span>
                <span className="text-right font-bold text-muted-foreground">{item.price}</span>
                <span className="text-right text-red-600 font-black">{item.fees}</span>
                <span className={`text-right font-black ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-600"}`}>
                  {item.promo}
                </span>
                <span className={`text-right font-black text-lg ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>
                  {item.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden divide-y divide-border">
          {displayItems.map((item) => (
            <div
              key={item.orderId}
              className={`p-6 transition-colors ${
                !item.profitable ? "bg-red-500/[0.04]" : "hover:bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1.5">
                  <p className="font-black text-lg leading-none">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono font-bold uppercase tracking-tight">{item.orderId}</p>
                </div>
                <Badge variant="outline" className={`text-xs uppercase font-black border-2 ${getPlatformColor(item.platform)} px-2.5 py-1 tracking-widest`}>
                  {item.platform}
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Price</p>
                  <p className="text-sm font-bold">{item.price}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fees</p>
                  <p className="text-sm font-black text-red-600">{item.fees}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Promo</p>
                  <p className={`text-sm font-black ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-600"}`}>{item.promo}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Profit</p>
                  <p className={`text-base font-black ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>{item.profit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {filteredItems.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="h-10 px-6 text-sm font-black uppercase tracking-widest border-2 shadow-sm"
              >
                {showAll ? "Show less" : `View all ${filteredItems.length} entries`}
              </Button>
            )}
            <Badge variant="secondary" className="text-xs font-black uppercase px-3 py-1.5 bg-muted border-2 tracking-widest">
              {lossCount} issues detected
            </Badge>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="space-y-1 text-right">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Period Profit</p>
              <p className="text-xl font-black text-primary tracking-tight">${totalProfit.toFixed(2)}</p>
            </div>
            <div className="w-px h-12 bg-border shadow-sm" />
            <div className="space-y-1 text-right">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Average / Transaction</p>
              <p className="text-xl font-black text-emerald-600 tracking-tight">${avgProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;
