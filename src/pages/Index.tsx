import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import WhyDifferentSection from "@/components/WhyDifferentSection";
import PricingSection from "@/components/PricingSection";
import BookDemoSection from "@/components/BookDemoSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyDifferentSection />
      <PricingSection />
      <BookDemoSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
};

export default Index;
