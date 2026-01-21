const ItemBreakdownTable = () => {
  const items = [
    { name: "Chicken Bowl", price: "$14.99", fees: "-$3.75", promo: "-$1.50", profit: "$9.74", profitable: true },
    { name: "Beef Bulgogi", price: "$16.99", fees: "-$4.25", promo: "$0.00", profit: "$12.74", profitable: true },
    { name: "Veggie Bibimbap", price: "$12.99", fees: "-$3.25", promo: "-$2.60", profit: "$7.14", profitable: true },
    { name: "Korean Fried Chicken", price: "$11.99", fees: "-$3.00", promo: "-$6.00", profit: "$2.99", profitable: true },
    { name: "Kimchi Fries", price: "$8.99", fees: "-$2.25", promo: "-$4.50", profit: "$2.24", profitable: true },
    { name: "Bubble Tea", price: "$5.99", fees: "-$1.50", promo: "-$3.00", profit: "$1.49", profitable: true },
    { name: "Mochi Ice Cream", price: "$4.99", fees: "-$1.25", promo: "-$2.50", profit: "$1.24", profitable: true },
    { name: "Spring Rolls", price: "$6.99", fees: "-$1.75", promo: "-$5.60", profit: "-$0.36", profitable: false },
    { name: "Edamame", price: "$4.99", fees: "-$1.25", promo: "-$4.00", profit: "-$0.26", profitable: false },
  ];

  const totalProfit = items.reduce((sum, item) => sum + parseFloat(item.profit.replace('$', '')), 0);
  const avgProfit = totalProfit / items.length;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Outer glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-transparent to-primary/20 rounded-2xl blur-md opacity-70" />
      
      {/* Main card */}
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 border border-border/50 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden backdrop-blur-sm">
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative p-6 sm:p-8 flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
            <h3 className="text-lg font-semibold text-foreground">Item-Level Profit Breakdown</h3>
            <div className="text-sm text-muted-foreground">
              {items.length} items
            </div>
          </div>

          {/* CSV Table */}
          <div className="flex-1 rounded-xl bg-secondary/20 overflow-hidden border border-border/20 shadow-inner">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gradient-to-r from-secondary/60 to-secondary/40 text-sm font-semibold text-muted-foreground border-b border-border/30 uppercase tracking-wide">
              <span>Item</span>
              <span className="text-right">Price</span>
              <span className="text-right">Fees</span>
              <span className="text-right">Promo</span>
              <span className="text-right">Profit</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/20">
              {items.map((item) => (
                <div
                  key={item.name}
                  className={`grid grid-cols-5 gap-4 px-6 py-4 text-sm transition-all duration-300 ${
                    !item.profitable
                      ? "bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent"
                      : "bg-transparent hover:bg-secondary/30"
                  }`}
                >
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-right text-muted-foreground">{item.price}</span>
                  <span className="text-right text-red-500 font-medium">{item.fees}</span>
                  <span className={`text-right font-medium ${item.promo === "$0.00" ? "text-muted-foreground" : "text-red-500"}`}>
                    {item.promo}
                  </span>
                  <span className={`text-right font-bold text-base ${
                    item.profitable ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {item.profit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-6 pt-4 flex items-center justify-between border-t border-border/30">
            <span className="text-sm text-muted-foreground font-medium">
              {items.filter(i => !i.profitable).length} of {items.length} items at a loss
            </span>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                <span className="text-sm text-muted-foreground">Total Profit:</span>
                <span className="text-lg font-bold text-primary">
                  ${totalProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <span className="text-sm text-muted-foreground">Avg Profit:</span>
                <span className="text-lg font-bold text-emerald-600">
                  ${avgProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBreakdownTable;
