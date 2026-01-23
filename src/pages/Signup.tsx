import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Building2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import margixLogo from "@/assets/margix-logo.png";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration
    navigate("/uploads-pos");
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
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 transition-transform group-hover:scale-105">
              <img 
                src={margixLogo} 
                alt="MARGIX" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-3xl font-bold text-foreground tracking-tight">MARGIX</span>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Get your{" "}
            <span className="text-gradient">free revenue analysis</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            See exactly how much revenue you're losing on delivery platforms. No credit card required.
          </p>
          
          <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-primary">What you'll get</p>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Upload your delivery reports (read-only)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                30-day revenue analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                See missed refunds & pricing errors
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center lg:justify-start px-4 py-8 lg:pl-8 xl:pl-16 sm:px-12 lg:pr-12 relative z-10">
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="flex items-center gap-3 justify-center group">
              <div className="w-10 h-10 transition-transform group-hover:scale-105">
                <img 
                  src={margixLogo} 
                  alt="MARGIX" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-3xl font-bold text-foreground tracking-tight">MARGIX</span>
            </Link>
          </div>

          {/* Form Card */}
          <div 
            className="p-8 sm:p-10 rounded-2xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-1">Create your account</h2>
              <p className="text-muted-foreground text-base">
                Get a free analysis of your delivery revenue — no payment required
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

              <Button type="submit" className="w-full h-12 text-base brand-gradient border-0 text-white mt-2" data-testid="button-run-analysis">
                <Sparkles className="w-4 h-4 mr-2" />
                Run free analysis
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
                <Link to="/terms" className="underline">Terms of Service</Link> and{" "}
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
