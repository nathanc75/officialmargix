import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, AlertTriangle, Info, Zap, ShoppingCart, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FilterType = 'all' | 'profitable' | 'loss';

interface ItemBreakdownTableProps {
  isTrial?: boolean;
}

const ItemBreakdownTable = ({ isTrial = false }: ItemBreakdownTableProps) => {
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

  const getLossReason = (item: any) => {
    const price = parseFloat(item.price.replace('$', ''));
    const promo = Math.abs(parseFloat(item.promo.replace('$', '')));
    const fees = Math.abs(parseFloat(item.fees.replace('$', '')));
    
    if (promo > price * 0.5) return "Promo exceeds 50% of item price";
    if (fees > price * 0.3) return "High platform fees relative to price";
    if (promo + fees > price) return "Promo and fees exceed item price";
    return "Low margin after platform deductions";
  };

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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Uber Eats": return <Zap className="h-2.5 w-2.5 mr-1" />;
      case "DoorDash": return <ShoppingCart className="h-2.5 w-2.5 mr-1" />;
      case "Grubhub": return <Coffee className="h-2.5 w-2.5 mr-1" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Uber Eats": return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "DoorDash": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "Grubhub": return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'loss', label: 'At Loss' },
    { value: 'profitable', label: 'Profitable' },
  ];

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace('$', ''));
    const absNum = Math.abs(num).toFixed(2);
    return num < 0 ? `-$${absNum}` : `$${absNum}`;
  };

  return (
    <Card className="border shadow-sm bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold tracking-tight">Order Breakdown</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Detailed analysis of individual platform transactions</p>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 p-1 bg-muted rounded-lg border w-full sm:w-auto overflow-x-auto">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
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

        {displayItems.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground font-medium">No {filter === 'loss' ? 'loss-making' : filter === 'profitable' ? 'profitable' : ''} orders for this filter</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">
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
                      className={`grid grid-cols-7 gap-4 px-6 py-4 text-sm items-center transition-colors ${
                        !item.profitable
                          ? "bg-red-500/[0.03]"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <span className="font-mono text-xs text-muted-foreground">{item.orderId}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.name}</span>
                        {!item.profitable && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs font-medium">{getLossReason(item)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <span>
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 ${getPlatformColor(item.platform)}`}>
                          {getPlatformIcon(item.platform)}
                          {item.platform}
                        </Badge>
                      </span>
                      <span className="text-right font-medium">{formatCurrency(item.price)}</span>
                      <span className="text-right text-red-600 font-medium">{formatCurrency(item.fees)}</span>
                      <span className={`text-right font-medium ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-600"}`}>
                        {formatCurrency(item.promo)}
                      </span>
                      <span className={`text-right font-bold ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(item.profit)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-border">
              {displayItems.map((item) => (
                <div
                  key={item.orderId}
                  className={`p-4 space-y-3 transition-colors ${
                    !item.profitable ? "bg-red-500/[0.03]" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px] font-mono text-muted-foreground">{item.orderId}</p>
                        {!item.profitable && <AlertTriangle className="h-3 w-3 text-red-500" />}
                      </div>
                      <p className="text-sm font-bold">{item.name}</p>
                      {!item.profitable && <p className="text-[10px] text-red-600 font-medium leading-none">{getLossReason(item)}</p>}
                    </div>
                    <Badge variant="outline" className={`text-[9px] uppercase font-bold px-1.5 py-0 ${getPlatformColor(item.platform)}`}>
                      {getPlatformIcon(item.platform)}
                      {item.platform}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Price</p>
                      <p className="text-xs font-medium">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="space-y-0.5 text-center">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Fees+Promo</p>
                      <p className="text-xs font-medium text-red-600">
                        {formatCurrency((parseFloat(item.fees.replace('$', '')) + parseFloat(item.promo.replace('$', ''))).toString())}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Net Profit</p>
                      <p className={`text-sm font-bold ${item.profitable ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(item.profit)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="p-4 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            {filteredItems.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="h-8 text-[10px] sm:text-xs font-semibold px-2"
              >
                {showAll ? "Show less" : `View all ${filteredItems.length}`}
                {showAll ? <ChevronUp className="ml-1 sm:ml-2 h-3 w-3" /> : <ChevronDown className="ml-1 sm:ml-2 h-3 w-3" />}
              </Button>
            )}
            <Badge variant="secondary" className="text-[9px] sm:text-[10px] font-bold uppercase py-0.5 bg-muted">
              {lossCount} issues detected
            </Badge>
          </div>
          
          <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
            <div className="space-y-0.5 text-left sm:text-right flex-1 sm:flex-none">
              <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Total Period Profit</p>
              <p className={`text-sm sm:text-base font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(totalProfit.toString())}
              </p>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="space-y-0.5 text-right flex-1 sm:flex-none">
              <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Avg / Transaction</p>
              <p className={`text-sm sm:text-base font-bold ${avgProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(avgProfit.toString())}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;
