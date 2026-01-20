import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import WhyDifferentSection from "@/components/WhyDifferentSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyDifferentSection />
      <PricingSection />
      <FAQSection />
    </div>
  );
};

export default Index;
