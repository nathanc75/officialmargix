import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Bell, 
  BarChart3, 
  Shield, 
  FileText, 
  Smartphone,
  ArrowUpRight 
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    iconBg: "bg-orange-500",
    title: "Unified Performance View",
    subtitle: "All Channels, One Dashboard",
    description: "Connect your POS to see dine-in, takeout, and delivery orders in a single view. Get a complete picture of your restaurant's performance.",
  },
  {
    icon: Bell,
    iconBg: "bg-blue-500",
    title: "AI-Driven Recommendations",
    subtitle: "Actionable Insights",
    description: "Our AI analyzes your real order data to provide feedback, performance analysis, and suggestions to improve sales and efficiency.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-purple-500",
    title: "Delivery Platform Integration",
    subtitle: "Uber Eats, DoorDash & More",
    description: "When delivery platforms are connected to your POS, we include delivery insights within the same unified analysis.",
  },
  {
    icon: Shield,
    iconBg: "bg-green-500",
    title: "Secure POS Connection",
    subtitle: "Your Data, Protected",
    description: "We securely connect to your POS system using industry-standard encryption. Your data stays protected at all times.",
  },
  {
    icon: FileText,
    iconBg: "bg-yellow-500",
    title: "Real Order Data Analysis",
    subtitle: "No Guesswork",
    description: "All insights are powered by your actual POS data — real orders, real numbers, real results you can act on.",
  },
  {
    icon: Smartphone,
    iconBg: "bg-primary",
    title: "Mobile Dashboard",
    subtitle: "Insights Anywhere",
    description: "Access your performance insights from any device. Make informed decisions on the go.",
    isNew: true,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 bg-background overflow-hidden">
      {/* Background gradient arc */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Insights Powered by{" "}
            <span className="text-muted-foreground">Real Data</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            AI-driven analytics from your POS data across all order channels
          </p>
          <Button className="gap-2">
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_30px_-10px_hsl(221,83%,53%,0.2)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_-10px_hsl(221,83%,53%,0.25)] hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
            >
              {/* Arrow icon */}
              <div className="absolute top-6 right-6 text-muted-foreground/40 group-hover:text-primary transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title with NEW badge */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                {feature.isNew && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-primary text-primary-foreground">
                    NEW
                  </span>
                )}
              </div>

              {/* Subtitle */}
              <p className="text-sm text-muted-foreground mb-4">
                {feature.subtitle}
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-border mb-4" />

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
