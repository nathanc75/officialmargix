import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import margixLogo from "@/assets/margix-logo.png";

const plans = [
  {
    name: "Starter",
    subtitle: "Single-Location Coverage",
    price: { monthly: 39, yearly: 27 },
    cta: "Start with Starter",
    positioning: "Same dashboard. Same intelligence. Scoped to one location.",
    description: "Full AI-powered analytics for one restaurant location.",
    features: [
      "Full Margix dashboard",
      "1 POS connection",
      "Dine-in, takeout & delivery insights",
      "Standard analytics refresh",
      "AI-driven recommendations",
      "Email support",
    ],
  },
  {
    name: "Pro",
    subtitle: "Multi-Location Coverage",
    price: { monthly: 99, yearly: 69 },
    cta: "Start with Pro",
    popular: true,
    positioning: "Same tools — dramatically more operational leverage.",
    description: "Unified analytics across all your restaurant locations.",
    features: [
      "Full Margix dashboard",
      "Multiple POS connections",
      "Delivery platform integration",
      "Higher-volume data processing",
      "Real-time performance alerts",
      "Cross-location comparison",
      "Priority support",
    ],
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();

  const handleSelectPlan = (planName: string) => {
    toast({
      title: `${planName} plan selected`,
      description: "Payment integration coming soon. We'll notify you when checkout is available.",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Analysis
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12">
              <img src={margixLogo} alt="MARGIX" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-foreground">MARGIX</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600">Your free analysis is ready!</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Upgrade to Live Analytics
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Unlock continuous AI-powered insights across all your order channels. Monitor dine-in, takeout, and delivery performance in real-time.
          </p>
          <p className="text-xs text-muted-foreground mt-2" data-testid="text-pos-requirement">
            Real-time analytics powered by your POS connection.
          </p>

          <div className="inline-flex items-center gap-2 p-1.5 rounded-full backdrop-blur-xl border border-white/20 dark:border-white/10 mt-8" style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}>
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

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
                plan.popular
                  ? "border-primary/50 shadow-[0_0_30px_-10px_hsl(221,83%,53%,0.3)]"
                  : "border-white/20 dark:border-white/10"
              }`}
              style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-primary font-medium">{plan.subtitle}</p>
                {plan.description && (
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-muted-foreground">/ month</span>
                </div>
              </div>

              <Button
                className={`w-full mb-6 ${plan.popular ? "brand-gradient border-0 text-white" : ""}`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.name)}
                data-testid={`button-select-${plan.name.toLowerCase()}`}
              >
                {plan.cta}
              </Button>

              <p className="text-xs text-muted-foreground italic mb-4 pb-4 border-b border-border">
                "{plan.positioning}"
              </p>

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

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need more?{" "}
            <a href="/#contact" className="text-primary hover:underline font-medium">
              Contact us for custom pricing
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
