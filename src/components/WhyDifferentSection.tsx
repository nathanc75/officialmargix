import { X, Check } from "lucide-react";

const notItems = [
  "Not generic dashboards with vanity metrics",
  "Not vague estimates without data backing",
  "Not guesswork about where you're losing money",
];

const isItems = [
  "Analyzes your actual reports together with your menu",
  "Focuses on order-level profitability, fees & refunds",
  "All insights clearly labeled as exact or estimated",
];

const WhyDifferentSection = () => {
  return (
    <section className="relative py-24 bg-secondary/50 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-12">
          Confident Decisions, Not Guesswork
        </h2>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Not this */}
          <div className="space-y-4">
            {notItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
              >
                <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-left text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* This instead */}
          <div className="space-y-4">
            {isItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-xl border border-primary/30 shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_20px_-10px_hsl(221,83%,53%,0.2)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_20px_-10px_hsl(221,83%,53%,0.25)]"
                style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-left text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
