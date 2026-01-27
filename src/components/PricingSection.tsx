import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free Scan",
    subtitle: "Try It Once",
    price: { monthly: 0, yearly: 0 },
    cta: "Start Free Scan",
    positioning: "See what leaks exist in your business — no commitment.",
    description: "Upload files and get your first leak detection report free.",
    features: [
      "1 free leak scan",
      "Upload up to 5 files",
      "Basic leak detection",
      "Summary report",
      "Top 3 issues identified",
    ],
  },
  {
    name: "Pro",
    subtitle: "Ongoing Monitoring",
    price: { monthly: 49, yearly: 34 },
    cta: "Get Started",
    popular: true,
    positioning: "Continuous leak detection to protect your revenue.",
    description: "Monthly scans with detailed reports and priority support.",
    features: [
      "Unlimited leak scans",
      "Upload unlimited files",
      "Advanced leak detection",
      "Detailed PDF reports",
      "All issues identified",
      "Recovery action plans",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "High-Volume Business",
    price: { monthly: "Custom", yearly: "Custom" },
    cta: "Contact Sales",
    positioning: "Custom solutions for businesses with complex financials.",
    description: "",
    features: [
      "Everything in Pro",
      "Multiple entity support",
      "Custom file formats",
      "API access",
      "Dedicated account manager",
      "SLA guarantees",
    ],
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    if (planName === "Enterprise") {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/signup');
    }
  };

  return (
    <section id="pricing" className="relative py-24 bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Your first leak scan is always free. See what you're losing before you commit.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-full backdrop-blur-xl border border-white/20 dark:border-white/10" style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}>
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                30% off
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_30px_-10px_hsl(221,83%,53%,0.2)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_-10px_hsl(221,83%,53%,0.25)] hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary/50 shadow-[0_0_30px_-10px_hsl(221,83%,53%,0.3)]"
                  : "border-white/20 dark:border-white/10"
              }`}
              style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    Popular
                  </span>
                </div>
              )}

              {/* Plan name & subtitle */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="text-sm text-primary font-medium">
                  {plan.subtitle}
                </p>
                {plan.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                {typeof plan.price.monthly === "number" ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-foreground">Custom</span>
                )}
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full mb-6 ${
                  plan.popular ? "brand-gradient border-0 text-white" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePlanSelect(plan.name)}
              >
                {plan.cta}
              </Button>

              {/* Positioning */}
              <p className="text-xs text-muted-foreground italic mb-4 pb-4 border-b border-border">
                "{plan.positioning}"
              </p>

              {/* Features */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Includes:</p>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6" data-testid="text-file-formats">
          Supports PDF and CSV files from any bank or payment processor.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
