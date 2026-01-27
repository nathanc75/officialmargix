import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Zap, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BookDemoSection = () => {
  return (
    <section id="book-demo" className="relative py-24 bg-secondary/50 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Get Started
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Find Your Leaks?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Upload your financial documents and let our AI discover where 
              your business is losing money. No account connections, no complex setup.
            </p>

            <div className="space-y-4">
              {[
                { icon: FileText, text: "Upload any PDF or CSV financial file" },
                { icon: Zap, text: "Get results in minutes, not days" },
                { icon: Shield, text: "Bank-level security, files never stored" },
                { icon: ArrowRight, text: "Clear action steps to recover money" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Form */}
          <div className="relative">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-xl">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Start Your Free Scan
              </h3>
              
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      First Name
                    </label>
                    <Input 
                      placeholder="John" 
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input 
                      placeholder="Doe" 
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Work Email
                  </label>
                  <Input 
                    type="email" 
                    placeholder="john@company.com" 
                    className="bg-secondary/50 border-border"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Business Name
                  </label>
                  <Input 
                    placeholder="Your Business" 
                    className="bg-secondary/50 border-border"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Industry (Optional)
                  </label>
                  <Input 
                    placeholder="e.g., E-commerce, Agency, Consulting" 
                    className="bg-secondary/50 border-border"
                  />
                </div>

                <Link to="/signup" className="block">
                  <Button type="button" size="lg" className="w-full mt-2">
                    Get Free Leak Scan
                  </Button>
                </Link>
                
                <p className="text-xs text-muted-foreground text-center">
                  No credit card required. Your first scan is completely free.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDemoSection;
