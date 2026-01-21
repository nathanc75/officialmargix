import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication
    console.log("Sign in attempt:", { email, password });
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
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
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
            Welcome back to your{" "}
            <span className="text-gradient">AI-powered</span> delivery analytics
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor your delivery platforms, detect pricing errors, and recover lost revenue — all in one dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:p-12 relative z-10">
        <div className="w-full max-w-lg">
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
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-foreground mb-1">Sign in</h2>
              <p className="text-muted-foreground text-base">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-foreground text-base">Email</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground text-base">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
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
              </div>

              <Button type="submit" className="w-full h-12 text-base brand-gradient border-0 text-white">
                Sign in
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-base text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Get started
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
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

export default SignIn;
