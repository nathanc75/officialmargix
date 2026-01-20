import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import WhyDifferentSection from "@/components/WhyDifferentSection";
import PricingSection from "@/components/PricingSection";
import BookDemoSection from "@/components/BookDemoSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import SectionDivider from "@/components/SectionDivider";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <WhyDifferentSection />
      <SectionDivider />
      <PricingSection />
      <SectionDivider />
      <BookDemoSection />
      <SectionDivider />
      <FAQSection />
      <SectionDivider />
      <ContactSection />
    </div>
  );
};

export default Index;
