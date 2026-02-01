import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnalysisProvider } from "@/context/AnalysisContext";
import { UserProvider } from "@/context/UserContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TrialDashboard from "./pages/TrialDashboard";
import FreeAnalysis from "./pages/FreeAnalysis";
import FreeAnalysisResults from "./pages/FreeAnalysisResults";

import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Pricing from "./pages/Pricing";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import LeakResults from "./pages/LeakResults";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <SubscriptionProvider>
          <AnalysisProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trial" element={<TrialDashboard />} />
              <Route path="/free-analysis" element={<FreeAnalysis />} />
              <Route path="/pricing" element={<Pricing />} />
              
              
              <Route path="/results" element={<LeakResults />} />
              
              <Route path="/free-results" element={<FreeAnalysisResults />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </AnalysisProvider>
        </SubscriptionProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

