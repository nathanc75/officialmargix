import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does MARGIX connect to my restaurant's delivery platforms?",
    answer: "MARGIX securely connects to your delivery platform accounts (Uber Eats, DoorDash, Grubhub, etc.) through their official APIs. Setup takes just a few minutes — simply log in to each platform and authorize access for automated revenue tracking.",
  },
  {
    question: "What types of restaurant revenue losses does MARGIX detect?",
    answer: "MARGIX identifies pricing discrepancies, missed refunds, excessive platform fees, promotional losses, and menu pricing errors across all connected delivery platforms. Our AI analyzes every transaction to spot patterns costing your restaurant money.",
  },
  {
    question: "How quickly will my restaurant see revenue recovery ROI?",
    answer: "Most restaurants recover 3-10× their monthly subscription cost within the first month. The average restaurant discovers $500-$2,000 in recoverable revenue issues immediately after connecting their delivery platforms.",
  },
  {
    question: "Is my restaurant's delivery platform data secure?",
    answer: "Absolutely. We use bank-level encryption and never store your delivery platform login credentials. All data is encrypted in transit and at rest. We're SOC 2 compliant and undergo regular security audits.",
  },
  {
    question: "Can I use MARGIX for multiple restaurant locations?",
    answer: "Yes! Our Enterprise plan is designed for multi-location restaurants and franchise groups. You'll get a unified dashboard to monitor delivery platform performance across all locations, with custom reporting and dedicated account management.",
  },
  {
    question: "Do I need technical knowledge for restaurant delivery analytics?",
    answer: "Not at all. MARGIX is designed for restaurant owners and operators, not tech experts. Our delivery analytics dashboard is intuitive, and our support team is always available to help you maximize revenue recovery.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Header */}
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Restaurant Revenue Recovery FAQ
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Delivery Platform{" "}
              <span className="text-gradient">Analytics Questions</span>
            </h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Common questions about restaurant revenue recovery and delivery platform management.
            </p>
          </div>

          {/* Right Column - Accordion */}
          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl backdrop-blur-xl border border-white/20 dark:border-white/10 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] data-[state=open]:shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_30px_-10px_hsl(221,83%,53%,0.2)] dark:data-[state=open]:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_-10px_hsl(221,83%,53%,0.25)]"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.5) 100%)' }}
                >
                  <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
