import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orb */}
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                >
                  <span className="text-[8px] font-medium text-muted-foreground">
                    {String.fromCharCode(64 + i)}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Join <span className="font-semibold text-foreground">327+</span> restaurants recovering revenue
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-5xl leading-[1.1]">
            AI-Driven Insights to Recover Lost{" "}
            <span className="text-gradient">Restaurant Revenue</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            MARGIX monitors your delivery apps pricing, promos, and refunds to uncover 
            where your restaurant is quietly losing money — and tells you exactly what to fix.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-medium gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 text-base font-medium gap-2"
            >
              <Play className="w-4 h-4" />
              Book Demo
            </Button>
          </div>


          {/* Abstract Visual / Dashboard Preview */}
          <div className="mt-16 w-full max-w-4xl">
            <div className="relative aspect-[16/10] rounded-2xl bg-card border border-border shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Mock Dashboard UI */}
              <div className="absolute inset-0 p-6">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="h-4 w-32 rounded bg-muted" />
                </div>

                {/* Dashboard content */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Revenue Recovered", value: "$12,847" },
                    { label: "Issues Detected", value: "23" },
                    { label: "Platforms Synced", value: "4" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-xl bg-secondary/50"
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="flex-1 rounded-xl bg-secondary/30 p-4">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                      (height, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-primary/20"
                          style={{ height: `${height}%` }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
