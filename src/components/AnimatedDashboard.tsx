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
    <div className="relative aspect-[16/10] rounded-2xl bg-card border border-border shadow-2xl shadow-primary/5 overflow-hidden">
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            {getStatusDisplay()}
          </div>
        </div>

        {/* CSV Table */}
        <div className="flex-1 rounded-xl bg-secondary/30 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-2 px-3 py-2 bg-secondary/50 text-[10px] sm:text-xs font-medium text-muted-foreground border-b border-border/50">
            <span>Order ID</span>
            <span>Platform</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Issue</span>
            <span className="text-right">Recovered</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border/30">
            {fakeData.map((row, index) => (
              <div
                key={row.id}
                className={`grid grid-cols-6 gap-2 px-3 py-2 text-[10px] sm:text-xs transition-all duration-300 ${
                  highlightedRow === index
                    ? "bg-primary/10 scale-[1.01]"
                    : highlightedRow > index
                    ? "bg-green-500/5"
                    : "bg-transparent"
                }`}
              >
                <span className="font-mono text-foreground">{row.id}</span>
                <span className="text-muted-foreground">{row.platform}</span>
                <span className="text-muted-foreground">{row.date}</span>
                <span className="text-foreground">{row.amount}</span>
                <span className={`${highlightedRow >= index ? "text-destructive" : "text-muted-foreground"}`}>
                  {row.issue}
                </span>
                <span className={`text-right font-medium ${
                  highlightedRow >= index ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                }`}>
                  {highlightedRow >= index ? row.recovered : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {status === "found" ? "6 issues detected" : `${Math.max(0, highlightedRow + 1)} of 6 orders scanned`}
          </span>
          <span className="text-sm font-bold text-primary">
            Total: ${displayAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedDashboard;
