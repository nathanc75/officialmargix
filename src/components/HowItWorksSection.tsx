import { Button } from "@/components/ui/button";
import { Upload, Search, FileCheck, ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    icon: Upload,
    title: "Upload Files",
    number: "01",
    heading: "Upload your financial documents",
    description: "Upload bank statements, invoices, payment processor exports, or any financial reports you have. We accept PDF and CSV files — no account connections needed.",
    features: ["Bank statements", "Payment processor exports", "Invoices & receipts"],
  },
  {
    id: 2,
    icon: Search,
    title: "AI Analysis",
    number: "02",
    heading: "AI scans for revenue leaks",
    description: "Our AI standardizes your data and compares expected versus actual financial outcomes, identifying discrepancies that indicate money loss.",
    features: ["Missing payments", "Duplicate charges", "Unused subscriptions"],
  },
  {
    id: 3,
    icon: FileCheck,
    title: "Get Report",
    number: "03",
    heading: "Receive your leak report",
    description: "Get a simple report showing estimated money lost, the reason for each leak, and clear recommended next steps to recover your funds.",
    features: ["Money lost estimate", "Root cause analysis", "Recovery action plan"],
  },
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = steps[activeStep];

  return (
    <section id="how-it-works" className="relative py-12 sm:py-20 bg-secondary/50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            From Upload to Insights in Minutes
          </h2>
        </div>

        {/* Step Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-xl bg-card border border-border mb-16">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex-1 flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                activeStep === index
                  ? "bg-secondary border border-border"
                  : "hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <step.icon className={`w-5 h-5 ${activeStep === index ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
              </div>
              <span className={`text-sm font-medium ${activeStep === index ? "text-primary" : "text-muted-foreground"}`}>
                {step.number}
              </span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column - Step Info */}
          <div className="space-y-6">
            <div className="text-5xl font-bold text-primary/20">
              {currentStep.number}.
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {currentStep.heading}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentStep.description}
            </p>
            <Link to="/signup">
              <Button className="gap-2">
                Start Free Scan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Center Column - Product Card */}
          <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg brand-gradient flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">MARGIX AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload your files and let AI find where your business is losing money
            </p>
            <div className="space-y-3">
              {currentStep.features.map((feature) => (
                <div
                  key={feature}
                  className="inline-block mr-2 mb-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-muted-foreground"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sign Up Preview */}
          <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg brand-gradient flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <button className="text-muted-foreground hover:text-foreground text-sm">x</button>
            </div>
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-foreground">Get Your Free Leak Scan</h4>
              <p className="text-xs text-muted-foreground">
                Upload your files and discover hidden revenue leaks in minutes
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/signup" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary border border-border hover:border-primary transition-colors cursor-text">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Enter Email Address</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
