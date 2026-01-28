import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedDashboard from "./AnimatedDashboard";

const HeroSection = () => {
  return (
    <section className="relative min-h-fit lg:min-h-screen bg-background overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orb */}
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-8">
        <div className="flex flex-col items-center text-center">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-5xl leading-[1.1]">
            Find Where Your Business is{" "}
            <span className="text-gradient">Losing Money</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Upload your bank statements, invoices, or payment reports. Our AI scans for missing payments, 
            duplicate charges, unused subscriptions, and hidden revenue leaks — no account connections needed.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup?redirect=/upload">
              <Button 
                size="lg" 
                className="h-11 px-6 text-sm font-medium gap-2"
                data-testid="button-free-scan"
              >
                Free Leak Scan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Button 
                variant="link" 
                size="default" 
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <Upload className="w-4 h-4" />
                See How It Works
              </Button>
            </a>
          </div>


          {/* Animated Dashboard Preview */}
          <div className="mt-10 sm:mt-14 w-full max-w-4xl">
            <AnimatedDashboard />
            <p className="text-xs text-muted-foreground/60 text-right mt-2">Example leak detection shown</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
