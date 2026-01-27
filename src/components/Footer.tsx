import { Mail, Search } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Search className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">LeakDetector</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Upload your financial documents and let AI find where your business is losing money. No account connections needed — just upload and discover hidden revenue leaks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#contact" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} LeakDetector. All rights reserved.
            </p>
          </div>
          
          {/* Legal Disclaimer */}
          <p className="mt-4 text-xs text-muted-foreground/60 text-center md:text-left">
            LeakDetector is a financial analysis tool. Results are based on the documents you upload and should be verified before taking action.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
