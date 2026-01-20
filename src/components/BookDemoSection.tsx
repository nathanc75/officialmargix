import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, ShieldCheck } from "lucide-react";

const BookDemoSection = () => {
  return (
    <section id="book-demo" className="relative py-24 bg-background overflow-hidden">
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
                Book a Demo
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              See MARGIX in Action
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Schedule a personalized demo with our team to discover how MARGIX can help 
              your restaurant recover lost revenue and optimize delivery operations.
            </p>

            <div className="space-y-4">
              {[
                { icon: Clock, text: "15-minute personalized walkthrough" },
                { icon: Users, text: "Meet with a revenue recovery specialist" },
                { icon: Calendar, text: "Flexible scheduling to fit your needs" },
                { icon: ShieldCheck, text: "No prep, no pressure, no obligation" },
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
                Request Your Demo
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
                    placeholder="john@restaurant.com" 
                    className="bg-secondary/50 border-border"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Restaurant Name
                  </label>
                  <Input 
                    placeholder="Your Restaurant" 
                    className="bg-secondary/50 border-border"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Number of Locations
                  </label>
                  <Input 
                    type="number" 
                    placeholder="1" 
                    min="1"
                    className="bg-secondary/50 border-border"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full mt-2">
                  Schedule Demo
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  We'll reach out within 24 hours to confirm your demo time.
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
