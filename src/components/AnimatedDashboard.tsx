import { useState, useEffect } from "react";

const fakeData = [
  { id: "ORD-7291", platform: "Uber Eats", date: "Jan 18", amount: "$47.82", issue: "Missing refund", recovered: "$12.50" },
  { id: "ORD-7284", platform: "DoorDash", date: "Jan 17", amount: "$32.15", issue: "Price error", recovered: "$8.20" },
  { id: "ORD-7279", platform: "Grubhub", date: "Jan 17", amount: "$28.90", issue: "Promo loss", recovered: "$15.00" },
  { id: "ORD-7265", platform: "Uber Eats", date: "Jan 16", amount: "$55.40", issue: "Commission error", recovered: "$22.80" },
  { id: "ORD-7251", platform: "DoorDash", date: "Jan 15", amount: "$41.25", issue: "Missing refund", recovered: "$18.50" },
  { id: "ORD-7238", platform: "Grubhub", date: "Jan 14", amount: "$19.99", issue: "Price error", recovered: "$6.40" },
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
            const rowValue = parseFloat(fakeData[rowIndex].recovered.replace("$", ""));
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
            Uploading CSV...
          </span>
        );
      case "analyzing":
        return (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Analyzing orders...
          </span>
        );
      case "found":
        return (
          <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Found ${displayAmount.toFixed(2)} in recoverable revenue!
          </span>
        );
    }
  };

  return (
    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group animate-float">
      {/* Outer glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-2xl blur-sm opacity-60" />
      
      {/* Main card */}
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 border border-border/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-sm">
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/70 shadow-sm shadow-destructive/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70 shadow-sm shadow-yellow-500/30" />
              <div className="w-3 h-3 rounded-full bg-green-500/70 shadow-sm shadow-green-500/30" />
            </div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground px-3 py-1.5 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/30">
              {getStatusDisplay()}
            </div>
          </div>

          {/* CSV Table */}
          <div className="flex-1 rounded-xl bg-secondary/20 overflow-hidden border border-border/20 shadow-inner">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-2 px-4 py-2.5 bg-gradient-to-r from-secondary/60 to-secondary/40 text-[10px] sm:text-xs font-semibold text-muted-foreground border-b border-border/30 uppercase tracking-wide">
              <span>Order ID</span>
              <span>Platform</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Issue</span>
              <span className="text-right">Recovered</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/20">
              {fakeData.map((row, index) => (
                <div
                  key={row.id}
                  className={`grid grid-cols-6 gap-2 px-4 py-2.5 text-[10px] sm:text-xs transition-all duration-500 ${
                    highlightedRow === index
                      ? "bg-gradient-to-r from-primary/15 via-primary/10 to-transparent scale-[1.01] shadow-sm"
                      : highlightedRow > index
                      ? "bg-green-500/5"
                      : "bg-transparent hover:bg-secondary/30"
                  }`}
                >
                  <span className="font-mono text-foreground font-medium">{row.id}</span>
                  <span className="text-muted-foreground">{row.platform}</span>
                  <span className="text-muted-foreground">{row.date}</span>
                  <span className="text-foreground font-medium">{row.amount}</span>
                  <span className={`transition-colors duration-300 ${highlightedRow >= index ? "text-destructive font-medium" : "text-muted-foreground"}`}>
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
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-border/30">
            <span className="text-xs text-muted-foreground font-medium">
              {status === "found" ? "6 issues detected" : `${Math.max(0, highlightedRow + 1)} of 6 orders scanned`}
            </span>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <span className="text-xs text-muted-foreground">Total:</span>
              <span className="text-sm font-bold text-primary">
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
