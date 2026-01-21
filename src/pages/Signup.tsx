import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    subtitle: "Restaurant Owner Essentials",
    price: { monthly: 29, yearly: 20 },
    cta: "Start Recovering Revenue",
    positioning: "Track delivery platform performance without spreadsheets",
    features: [
      "Up to 3 delivery platforms",
      "Unlimited order tracking",
      "Daily revenue reports",
      "Promo & fee monitoring",
      "Basic delivery alerts",
      "Email support",
    ],
  },
  {
    name: "Pro",
    subtitle: "Full Revenue Recovery",
    price: { monthly: 79, yearly: 55 },
    cta: "Maximize Recovery",
    popular: true,
    positioning: "Most restaurants recover 3–10× the monthly subscription",
    features: [
      "Everything in Starter",
      "Unlimited delivery platforms",
      "AI-powered revenue analysis",
      "Real-time pricing alerts",
      "Item-level profit tracking",
      "Uber Eats vs DoorDash vs Grubhub comparison",
      "Advanced analytics dashboard",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "Multi-Location Restaurant Groups",
    price: { monthly: "Custom", yearly: "Custom" },
    cta: "Contact Sales",
    positioning: "For restaurant chains and franchise operators",
    features: [
      "Unlimited locations",
      "Custom platform integrations",
      "POS system integration",
      "Dedicated account manager",
      "Custom revenue reports",
      "SLA guarantees",
      "24/7 priority support",
    ],
  },
];

const Signup = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    // TODO: Integrate with payment provider
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-[12px] flex items-center justify-center"
              style={{
                background: `
                  radial-gradient(12px 12px at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
                  linear-gradient(135deg, rgba(60,120,255,0.95), rgba(130,80,255,0.80))
                `,
                boxShadow: '0 10px 25px rgba(46,108,255,0.22)'
              }}
            >
              <span className="text-white font-semibold text-base" style={{ fontFamily: "'Orbitron', sans-serif" }}>M</span>
            </div>
            <span className="text-2xl font-bold text-foreground">MARGIX</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get Started with{" "}
            <span className="text-gradient">MARGIX</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Choose the plan that fits your restaurant's delivery platform management needs
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
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_30px_-10px_hsl(221,83%,53%,0.2)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_-10px_hsl(221,83%,53%,0.25)] hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary/50 shadow-[0_0_30px_-10px_hsl(221,83%,53%,0.3)]"
                  : "border-white/20 dark:border-white/10"
              } ${
                selectedPlan === plan.name
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              }`}
              style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    Most Popular
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
                {isYearly && typeof plan.price.monthly === "number" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed ${(plan.price.yearly as number) * 12}/year
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full mb-6 ${
                  plan.popular ? "brand-gradient border-0 text-white" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.name)}
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

        {/* Trust Section */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            30-day money-back guarantee • Cancel anytime
          </p>
          <p className="text-xs text-muted-foreground">
            Questions? <a href="/#contact" className="text-primary hover:underline">Contact our team</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
