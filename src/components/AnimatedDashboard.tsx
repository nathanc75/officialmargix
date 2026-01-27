import { useState, useEffect } from "react";

const fakeData = [
  { id: "TXN-8291", type: "Subscription", date: "Jan 18", amount: "$49.99", issue: "Unused service", recovered: "$49.99" },
  { id: "TXN-8284", type: "Payment", date: "Jan 17", amount: "$1,250.00", issue: "Underpayment", recovered: "$125.00" },
  { id: "TXN-8279", type: "Invoice", date: "Jan 17", amount: "$890.00", issue: "Missing payment", recovered: "$890.00" },
  { id: "TXN-8265", type: "Fee", date: "Jan 16", amount: "$35.00", issue: "Duplicate charge", recovered: "$35.00" },
  { id: "TXN-8251", type: "Subscription", date: "Jan 15", amount: "$29.99", issue: "Price increase", recovered: "$9.99" },
  { id: "TXN-8238", type: "Payment", date: "Jan 14", amount: "$500.00", issue: "Failed payment", recovered: "$500.00" },
];

const AnimatedDashboard = () => {
  const [status, setStatus] = useState<"uploading" | "analyzing" | "found">("uploading");
  const [highlightedRow, setHighlightedRow] = useState(-1);
  const [recoveredAmount, setRecoveredAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);

  // Status cycle
  useEffect(() => {
    const cycle = () => {
      setStatus("uploading");
      setHighlightedRow(-1);
      setRecoveredAmount(0);
      setDisplayAmount(0);

      setTimeout(() => {
        setStatus("analyzing");
        // Start highlighting rows
        let rowIndex = 0;
        const rowInterval = setInterval(() => {
          if (rowIndex < fakeData.length) {
            setHighlightedRow(rowIndex);
            const rowValue = parseFloat(fakeData[rowIndex].recovered.replace("$", "").replace(",", ""));
            setRecoveredAmount(prev => prev + rowValue);
            rowIndex++;
          } else {
            clearInterval(rowInterval);
            setTimeout(() => {
              setStatus("found");
            }, 500);
          }
        }, 600);
      }, 1500);
    };

    cycle();
    const mainInterval = setInterval(cycle, 10000);
    return () => clearInterval(mainInterval);
  }, []);

  // Animate counter
  useEffect(() => {
    if (displayAmount < recoveredAmount) {
      const step = Math.max(0.5, (recoveredAmount - displayAmount) / 10);
      const timeout = setTimeout(() => {
        setDisplayAmount(prev => Math.min(prev + step, recoveredAmount));
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [displayAmount, recoveredAmount]);

  const getStatusDisplay = () => {
    switch (status) {
      case "uploading":
        return (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            Uploading documents...
          </span>
        );
      case "analyzing":
        return (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Scanning for leaks...
          </span>
        );
      case "found":
        return (
          <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Found ${displayAmount.toFixed(0)} in potential savings!
          </span>
        );
    }
  };

  return (
    <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden group animate-float">
      {/* Outer glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-2xl blur-sm opacity-60" />
      
      {/* Main card */}
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 border border-border/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-sm">
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 p-3 sm:p-6 flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-border/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-destructive/70 shadow-sm shadow-destructive/30" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70 shadow-sm shadow-yellow-500/30" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/70 shadow-sm shadow-green-500/30" />
            </div>
            <div className="text-[10px] sm:text-sm font-medium text-muted-foreground px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/30">
              {getStatusDisplay()}
            </div>
          </div>

          {/* CSV Table */}
          <div className="flex-1 rounded-lg sm:rounded-xl bg-secondary/20 overflow-hidden border border-border/20 shadow-inner">
            {/* Table Header - Show fewer columns on mobile */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 bg-gradient-to-r from-secondary/60 to-secondary/40 text-[8px] sm:text-xs font-semibold text-muted-foreground border-b border-border/30 uppercase tracking-wide">
              <span>Transaction</span>
              <span className="hidden sm:block">Type</span>
              <span className="hidden sm:block">Date</span>
              <span>Amount</span>
              <span>Issue Found</span>
              <span className="text-right">Recoverable</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/20">
              {fakeData.map((row, index) => (
                <div
                  key={row.id}
                  className={`grid grid-cols-4 sm:grid-cols-6 gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 text-[8px] sm:text-xs transition-all duration-500 ${
                    highlightedRow === index
                      ? "bg-gradient-to-r from-primary/15 via-primary/10 to-transparent scale-[1.01] shadow-sm"
                      : highlightedRow > index
                      ? "bg-green-500/5"
                      : "bg-transparent hover:bg-secondary/30"
                  }`}
                >
                  <span className="font-mono text-foreground font-medium truncate">{row.id}</span>
                  <span className="hidden sm:block text-muted-foreground truncate">{row.type}</span>
                  <span className="hidden sm:block text-muted-foreground">{row.date}</span>
                  <span className="text-foreground font-medium">{row.amount}</span>
                  <span className={`transition-colors duration-300 truncate ${highlightedRow >= index ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    {row.issue}
                  </span>
                  <span className={`text-right font-semibold transition-all duration-300 ${
                    highlightedRow >= index ? "text-green-600 dark:text-green-400" : "text-muted-foreground/50"
                  }`}>
                    {highlightedRow >= index ? row.recovered : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 flex items-center justify-between border-t border-border/30">
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
              {status === "found" ? "6 leaks detected" : `${Math.max(0, highlightedRow + 1)} of 6 transactions scanned`}
            </span>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <span className="text-[10px] sm:text-xs text-muted-foreground">Potential Savings:</span>
              <span className="text-xs sm:text-sm font-bold text-primary">
                ${displayAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedDashboard;
