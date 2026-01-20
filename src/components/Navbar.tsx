import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#benefits" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10" style={{ background: 'linear-gradient(135deg, hsl(var(--hero-gradient-start) / 0.4) 0%, hsl(var(--hero-gradient-end) / 0.3) 100%)' }}>
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-[12px] flex items-center justify-center"
              style={{
                background: `
                  radial-gradient(12px 12px at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%),
                  linear-gradient(135deg, rgba(60,120,255,0.95), rgba(130,80,255,0.80))
                `,
                boxShadow: '0 10px 25px rgba(46,108,255,0.22)'
              }}
            >
              <span className="text-white font-semibold text-base" style={{ fontFamily: "'Orbitron', sans-serif" }}>M</span>
            </div>
            <span className="text-2xl font-bold text-foreground">MARGIX</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="default">
              Book Demo
            </Button>
            <Button size="default">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="flex-1 justify-start">
                  Book Demo
                </Button>
                <Button size="sm" className="flex-1">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
