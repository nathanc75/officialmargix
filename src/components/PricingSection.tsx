import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    subtitle: "Single-Location Coverage",
    price: { monthly: 39, yearly: 27 },
    cta: "Get Started",
    positioning: "Same dashboard. Same intelligence. Scoped to one location.",
    description: "Full revenue intelligence for one restaurant location.",
    features: [
      "Full Margix dashboard",
      "1 restaurant location",
      "Up to 3 delivery platforms",
      "Standard analytics refresh",
      "Daily revenue & promo insights",
      "Email support",
    ],
  },
  {
    name: "Pro",
    subtitle: "Multi-Location Coverage",
    price: { monthly: 99, yearly: 69 },
    cta: "Get Started",
    popular: true,
    positioning: "Same tools — dramatically more operational leverage.",
    description: "Operate and optimize multiple locations from one dashboard.",
    features: [
      "Full Margix dashboard",
      "Up to 10 restaurant locations",
      "Unlimited delivery platforms",
      "Higher-volume data processing",
      "Real-time alerts & pricing signals",
      "Cross-location performance comparison",
      "Priority support",
    ],
  },
  {
    name: "Custom",
    subtitle: "Enterprise Scale",
    price: { monthly: "Custom", yearly: "Custom" },
    cta: "Contact Sales",
    positioning: "Advanced coverage for restaurant groups and franchises.",
    description: "",
    features: [
      "Unlimited locations",
      "Custom data volumes & refresh rates",
      "Dedicated onboarding & support",
      "POS & custom integrations",
      "SLA guarantees",
    ],
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    if (planName === "Custom") {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/signup?plan=${encodeURIComponent(planName)}`);
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
              Restaurant Pricing Plans
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Delivery Revenue Recovery Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Choose a plan that fits your restaurant's delivery platform management needs
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
      </div>
    </section>
  );
};

export default PricingSection;
