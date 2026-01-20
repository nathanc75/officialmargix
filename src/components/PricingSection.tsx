import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: { monthly: 29, yearly: 20 },
    cta: "Get the Starter Plan",
    features: [
      "3 delivery platforms",
      "Unlimited orders",
      "Daily reports",
      "Email support",
      "Basic alerts",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 79, yearly: 55 },
    cta: "Go Pro",
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited platforms",
      "Priority email support",
      "Advanced AI insights",
      "Real-time alerts",
      "Analytics dashboard",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    cta: "Contact Sales",
    features: [
      "Fully customized setup",
      "All integrations",
      "Dedicated account manager",
      "24/7 phone & chat support",
      "Custom reporting",
      "SLA guarantees",
    ],
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative py-24 bg-secondary/30 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Flexible Pricing Plans
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Choose a plan that fits your business needs and unlock the full potential of our platform
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

              {/* Plan name */}
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {plan.name}
              </h3>

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
              >
                {plan.cta}
              </Button>

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
