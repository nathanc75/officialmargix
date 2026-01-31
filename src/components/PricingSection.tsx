import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free Scan",
    price: 0,
    cta: "Start Free Scan",
    purpose: "Build trust + prove value",
    features: [
      "1 upload (bank statement, report, or export)",
      "High-level summary of potential issues",
      "Estimated total amount of possible leakage",
      "No integrations required",
    ],
  },
  {
    name: "Pro",
    price: 49,
    cta: "Get Pro",
    popular: true,
    purpose: "Your core plan",
    features: [
      "Full detailed leak report",
      "Clear explanations of each issue",
      "Recommended next steps",
      "Monthly scans (upload-based)",
      "History of past reports",
      "Works for any business type",
    ],
  },
  {
    name: "Business",
    price: 199,
    cta: "Coming Soon",
    purpose: "For serious operators",
    comingSoon: true,
    features: [
      "Higher upload limits",
      "Multi-location or higher-volume businesses",
      "Priority analysis",
      "Exportable reports (PDF)",
      "Ongoing monthly monitoring via uploads",
    ],
  },
  {
    name: "Custom",
    price: "Custom",
    cta: "Contact Sales",
    purpose: "Tailored to your needs",
    features: [
      "Everything in Business",
      "Custom integrations",
      "Dedicated account manager",
      "Custom reporting",
      "API access",
      "SLA guarantees",
    ],
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    if (planName === "Free Scan") {
      navigate('/free-analysis');
    } else if (planName === "Custom") {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/signup');
    }
  };

  return (
    <section id="pricing" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start with a free scan to see the value. Upgrade when you're ready for full insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_30px_-10px_hsl(221,83%,53%,0.2)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_-10px_hsl(221,83%,53%,0.25)] hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary/50 shadow-[0_0_30px_-10px_hsl(221,83%,53%,0.3)]"
                  : "border-white/20 dark:border-white/10"
              }`}
              style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
              data-testid={`card-pricing-${plan.name.toLowerCase().replace(' ', '-')}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    Recommended
                  </span>
                </div>
              )}
              {plan.comingSoon && (
                <div className="absolute -top-3 left-6">
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs font-semibold">
                    Coming Soon
                  </Badge>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  {typeof plan.price === "number" ? (
                    <>
                      <span className="text-4xl font-bold text-foreground">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/ month</span>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  )}
                </div>
              </div>

              <Button
                className={`w-full mb-6 ${
                  plan.popular ? "brand-gradient border-0 text-white" : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePlanSelect(plan.name)}
                disabled={plan.comingSoon}
                data-testid={`button-pricing-${plan.name.toLowerCase().replace(' ', '-')}`}
              >
                {plan.cta}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                {plan.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
