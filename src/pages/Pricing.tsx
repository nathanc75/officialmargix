import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import margixLogo from "@/assets/margix-logo.png";

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
    price: 99,
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
    cta: "Get Business",
    purpose: "For serious operators",
    features: [
      "Higher upload limits",
      "Multi-location or higher-volume businesses",
      "Priority analysis",
      "Exportable reports (PDF)",
      "Ongoing monthly monitoring via uploads",
    ],
  },
];

const Pricing = () => {
  const { toast } = useToast();

  const handleSelectPlan = (planName: string) => {
    if (planName === "Free Scan") {
      window.location.href = "/upload";
      return;
    }
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

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
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

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start with a free scan to see the value. Upgrade when you're ready for full insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
                plan.popular
                  ? "border-primary/50 shadow-[0_0_30px_-10px_hsl(221,83%,53%,0.3)]"
                  : "border-white/20 dark:border-white/10"
              }`}
              style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
              data-testid={`card-plan-${plan.name.toLowerCase().replace(' ', '-')}`}
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
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/ month</span>
                  )}
                </div>
              </div>

              <Button
                className={`w-full mb-6 ${plan.popular ? "brand-gradient border-0 text-white" : ""}`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.name)}
                data-testid={`button-select-${plan.name.toLowerCase().replace(' ', '-')}`}
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

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Questions?{" "}
            <a href="/#contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
