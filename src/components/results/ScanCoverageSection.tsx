import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  AlertCircle,
  CreditCard, 
  RefreshCw, 
  Receipt,
  TrendingDown,
  FileWarning,
  UserX,
  RotateCcw,
  HelpCircle
} from "lucide-react";

// All 8 leak types we check for
const ALL_LEAK_TYPES = [
  { 
    type: "missing_payment", 
    label: "Money That Never Arrived",
    description: "Expected payments that didn't come through",
    icon: CreditCard 
  },
  { 
    type: "duplicate_charge", 
    label: "You Got Charged Twice",
    description: "Same charge appearing multiple times",
    icon: Receipt 
  },
  { 
    type: "unused_subscription", 
    label: "Paying for Things You Don't Use",
    description: "Active subscriptions with no usage",
    icon: RefreshCw 
  },
  { 
    type: "failed_payment", 
    label: "Payments That Didn't Go Through",
    description: "Transactions that failed silently",
    icon: AlertCircle 
  },
  { 
    type: "pricing_inefficiency", 
    label: "You're Being Overcharged",
    description: "Fees higher than market rates",
    icon: TrendingDown 
  },
  { 
    type: "billing_error", 
    label: "Billing Mistakes",
    description: "Math errors or incorrect amounts",
    icon: FileWarning 
  },
  { 
    type: "churn_permanent_loss", 
    label: "Customers You've Lost",
    description: "Cancelled subscriptions and churned customers",
    icon: UserX 
  },
  { 
    type: "refund_fee_loss", 
    label: "Refund Fees You're Eating",
    description: "Processing fees kept on refunded transactions",
    icon: RotateCcw 
  },
];

interface ScanCoverageSectionProps {
  foundTypes: string[];
  foundCounts: Record<string, number>;
}

export function ScanCoverageSection({ foundTypes, foundCounts }: ScanCoverageSectionProps) {
  const foundSet = new Set(foundTypes);

  return (
    <Card className="border-border/40 shadow-soft animate-fade-in">
      <div className="px-6 py-4 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            What We Checked
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your documents were scanned for these 8 types of revenue leaks
        </p>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ALL_LEAK_TYPES.map((leakType, index) => {
            const found = foundSet.has(leakType.type);
            const count = foundCounts[leakType.type] || 0;
            const Icon = leakType.icon;
            
            return (
              <div 
                key={leakType.type}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors animate-fade-in opacity-0 ${
                  found 
                    ? "bg-destructive/5 border-destructive/20" 
                    : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30"
                }`}
                style={{ 
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  found 
                    ? "bg-destructive/10 text-destructive" 
                    : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {found ? (
                      <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${
                      found ? "text-destructive" : "text-emerald-700 dark:text-emerald-400"
                    }`}>
                      {found ? `${count} found` : "All clear"}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mt-0.5 leading-tight">
                    {leakType.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {leakType.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
