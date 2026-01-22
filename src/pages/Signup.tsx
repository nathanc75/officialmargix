import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get plan from URL search params if it exists
  const queryParams = new URLSearchParams(location.search);
  const initialPlan = queryParams.get("plan");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
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

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-end pr-8 xl:pr-16">
        <div className="max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div 
              className="w-12 h-12 rounded-[16px] flex items-center justify-center"
              style={{
                background: `
                  radial-gradient(12px 12px at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
                  linear-gradient(135deg, rgba(60,120,255,0.95), rgba(130,80,255,0.80))
                `,
                boxShadow: '0 10px 25px rgba(46,108,255,0.22)'
              }}
            >
              <span className="text-white font-semibold text-xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>M</span>
            </div>
            <span className="text-3xl font-bold text-foreground">MARGIX</span>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Start your{" "}
            <span className="text-gradient">AI-powered</span> revenue recovery
          </h1>
          <p className="text-muted-foreground text-lg">
            Join thousands of restaurants using MARGIX to monitor delivery platforms and recover lost revenue.
          </p>
          
          {initialPlan && (
            <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <p className="text-sm font-medium text-primary">Selected Plan</p>
              <p className="text-xl font-bold text-foreground">{initialPlan}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center lg:justify-start px-4 py-8 lg:pl-8 xl:pl-16 sm:px-12 lg:pr-12 relative z-10">
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="flex items-center gap-3 justify-center">
              <div 
                className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                style={{
                  background: `
                    radial-gradient(12px 12px at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
                    linear-gradient(135deg, rgba(60,120,255,0.95), rgba(130,80,255,0.80))
                  `,
                  boxShadow: '0 10px 25px rgba(46,108,255,0.22)'
                }}
              >
                <span className="text-white font-semibold text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>M</span>
              </div>
              <span className="text-3xl font-bold text-foreground">MARGIX</span>
            </Link>
          </div>

          {/* Form Card */}
          <div 
            className="p-8 sm:p-10 rounded-2xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-1">Create account</h2>
              <p className="text-muted-foreground text-base">
                Start your 14-day free trial today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-foreground text-base">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 h-12 text-base bg-background/50 border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="restaurantName" className="text-foreground text-base">Restaurant Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="restaurantName"
                      placeholder="The Daily Bistro"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      className="pl-12 h-12 text-base bg-background/50 border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-foreground text-base">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@restaurant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 text-base bg-background/50 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-foreground text-base">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 text-base bg-background/50 border-border focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 px-1">
                  Must be at least 8 characters with a number and symbol.
                </p>
              </div>

              <Button type="submit" className="w-full h-12 text-base brand-gradient border-0 text-white mt-2">
                Create account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-base text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By signing up, you agree to our{" "}
                <a href="#" className="underline">Terms of Service</a> and{" "}
                <a href="#" className="underline">Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-3 text-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
