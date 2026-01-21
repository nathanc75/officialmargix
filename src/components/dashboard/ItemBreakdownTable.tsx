import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    { value: 'all', label: 'All Transactions' },
    { value: 'loss', label: 'Loss Detections' },
    { value: 'profitable', label: 'Profitable' },
  ];

  return (
    <Card className="border-2 shadow-xl bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 border-b-2 bg-muted/10">
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tighter uppercase">Order Breakdown</h3>
            <p className="text-lg text-muted-foreground font-bold tracking-tight">Granular analysis of every platform transaction and payout</p>
          </div>
          
          <div className="flex items-center gap-3 p-2.5 bg-muted rounded-2xl border-2 shadow-inner">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-6 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-widest ${
                  filter === btn.value
                    ? 'bg-background shadow-lg text-foreground border-2'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-7 gap-8 px-10 py-6 bg-muted/40 text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-b-2">
            <span>ID</span>
            <span>Menu Item</span>
            <span>Platform</span>
            <span className="text-right">Sale Price</span>
            <span className="text-right">Commission</span>
            <span className="text-right">Marketing</span>
            <span className="text-right">Payout</span>
          </div>

          <div className="divide-y-2 divide-border">
            {displayItems.map((item) => (
              <div
                key={item.orderId}
                className={`grid grid-cols-7 gap-8 px-10 py-8 text-lg items-center transition-all hover:bg-muted/10 ${
                  !item.profitable ? "bg-red-500/[0.06]" : ""
                }`}
              >
                <span className="font-mono text-xs font-black text-muted-foreground tracking-tighter opacity-70">{item.orderId}</span>
                <span className="font-black text-foreground tracking-tight">{item.name}</span>
                <span>
                  <Badge variant="outline" className={`text-xs uppercase font-black border-2 ${getPlatformColor(item.platform)} px-4 py-2 tracking-widest`}>
                    {item.platform}
                  </Badge>
                </span>
                <span className="text-right font-bold text-muted-foreground">{item.price}</span>
                <span className="text-right text-red-600 font-black">{item.fees}</span>
                <span className={`text-right font-black ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-600"}`}>
                  {item.promo}
                </span>
                <span className={`text-right font-black text-2xl tracking-tighter ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>
                  {item.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 bg-muted/20 border-t-2 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            {filteredItems.length > 5 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(!showAll)}
                className="h-14 px-10 text-base font-black uppercase tracking-widest border-2 shadow-md hover:-translate-y-0.5"
              >
                {showAll ? "Collapse List" : `Expand all ${filteredItems.length} records`}
              </Button>
            )}
            <Badge variant="secondary" className="text-sm font-black uppercase px-6 py-3 bg-muted border-2 tracking-[0.15em] shadow-sm">
              {lossCount} Revenue Leaks Detected
            </Badge>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="space-y-2 text-right">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Net Margin</p>
              <p className="text-4xl font-black text-primary tracking-tighter">${totalProfit.toFixed(2)}</p>
            </div>
            <div className="w-1 h-16 bg-border rounded-full shadow-inner" />
            <div className="space-y-2 text-right">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Avg. Profit / Unit</p>
              <p className="text-4xl font-black text-emerald-600 tracking-tighter">${avgProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;
