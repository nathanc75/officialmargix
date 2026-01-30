import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, ShoppingCart, TrendingDown, Sparkles } from "lucide-react";
import { InsightUploadDialog } from "./InsightUploadDialog";

export type InsightCategory = "pricing" | "orders" | "costs";

interface InsightCardConfig {
  id: InsightCategory;
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
}

const insightCards: InsightCardConfig[] = [
  {
    id: "pricing",
    title: "Find Underpriced Services & Products",
    description: "Upload your menu or price list to see where you may be charging too little and leaving money on the table.",
    buttonText: "Upload Prices",
    icon: <Tag className="h-5 w-5" />,
    iconBgClass: "bg-emerald-500/10",
    iconColorClass: "text-emerald-500",
  },
  {
    id: "orders",
    title: "See What Actually Makes You Money",
    description: "Upload itemized sales or order reports to discover your best sellers, low performers, and upsell opportunities.",
    buttonText: "Upload Sales Report",
    icon: <ShoppingCart className="h-5 w-5" />,
    iconBgClass: "bg-blue-500/10",
    iconColorClass: "text-blue-500",
  },
  {
    id: "costs",
    title: "Calculate Your Real Profit",
    description: "Add your costs and expenses to see which products or services are truly profitable — not just high revenue.",
    buttonText: "Upload Costs",
    icon: <TrendingDown className="h-5 w-5" />,
    iconBgClass: "bg-orange-500/10",
    iconColorClass: "text-orange-500",
  },
];

interface DeeperInsightsSectionProps {
  uploadedCategories?: Set<InsightCategory>;
  onCategoryUploaded?: (category: InsightCategory) => void;
}

export function DeeperInsightsSection({ 
  uploadedCategories = new Set(), 
  onCategoryUploaded 
}: DeeperInsightsSectionProps) {
  const [activeDialog, setActiveDialog] = useState<InsightCategory | null>(null);

  // Filter out categories that have already been uploaded
  const availableCards = insightCards.filter(card => !uploadedCategories.has(card.id));

  // Don't render if all categories have been uploaded
  if (availableCards.length === 0) {
    return null;
  }

  const handleUploadComplete = (category: InsightCategory) => {
    setActiveDialog(null);
    onCategoryUploaded?.(category);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Want deeper insights?
          </h2>
        </div>
        <p className="text-muted-foreground">
          Add more context to your business. Each upload unlocks new analysis.
        </p>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableCards.map((card) => (
          <Card 
            key={card.id}
            className="group relative overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-soft-md hover:border-primary/30"
          >
            <CardContent className="p-6 space-y-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${card.iconBgClass} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <span className={card.iconColorClass}>{card.icon}</span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-lg leading-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Button */}
              <Button 
                variant="outline" 
                className="w-full gap-2 mt-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                onClick={() => setActiveDialog(card.id)}
              >
                {card.buttonText}
              </Button>
            </CardContent>

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Card>
        ))}
      </div>

      {/* Upload Dialogs */}
      {activeDialog && (
        <InsightUploadDialog
          category={activeDialog}
          open={activeDialog !== null}
          onOpenChange={(open) => !open && setActiveDialog(null)}
          onComplete={() => handleUploadComplete(activeDialog)}
        />
      )}
    </div>
  );
}
