import { Button } from "@/components/ui/button";
import { 
  Search, 
  FileText, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Zap,
  ArrowUpRight 
} from "lucide-react";

const features = [
  {
    icon: FileText,
    iconBg: "bg-blue-500",
    title: "Upload Any Financial File",
    subtitle: "Bank Statements, Invoices, Reports",
    description: "Simply upload your existing financial documents — PDFs, CSVs, bank statements, or payment processor exports. No account connections required.",
  },
  {
    icon: Search,
    iconBg: "bg-purple-500",
    title: "AI-Powered Leak Detection",
    subtitle: "Find Hidden Revenue Losses",
    description: "Our AI scans for missing payments, underpayments, duplicate charges, unused subscriptions, failed payments, and pricing inefficiencies.",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-orange-500",
    title: "Clear Issue Identification",
    subtitle: "Know Exactly What's Wrong",
    description: "Each leak is identified with the amount lost, the reason it occurred, and the specific transaction or pattern that caused it.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-green-500",
    title: "Actionable Recommendations",
    subtitle: "Steps to Recover Money",
    description: "Get clear, actionable next steps for each issue found — whether it's contacting a vendor, disputing a charge, or canceling an unused service.",
  },
  {
    icon: Shield,
    iconBg: "bg-yellow-500",
    title: "Private & Secure",
    subtitle: "Your Data, Protected",
    description: "Files are processed securely and never stored permanently. We use bank-level encryption to protect your financial information.",
  },
  {
    icon: Zap,
    iconBg: "bg-primary",
    title: "Works for Any Business",
    subtitle: "Industry-Agnostic Analysis",
    description: "Whether you run a restaurant, agency, e-commerce store, or consulting firm — if you have income and expenses, we can find your leaks.",
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
            Stop Losing Money You{" "}
            <span className="text-muted-foreground">Didn't Know Was Gone</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            AI-powered analysis that finds revenue leaks hiding in your financial data
          </p>
          <Button className="gap-2">
            Start Free Scan
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
