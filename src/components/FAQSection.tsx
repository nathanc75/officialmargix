import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does MARGIX connect to my delivery platforms?",
    answer: "MARGIX securely connects to your delivery platform accounts (Uber Eats, DoorDash, Grubhub, etc.) through their official APIs. Setup takes just a few minutes — simply log in to each platform and authorize access.",
  },
  {
    question: "What kind of revenue issues does MARGIX detect?",
    answer: "MARGIX identifies pricing discrepancies, missing refunds, excessive platform fees, promotional losses, and menu pricing errors. Our AI analyzes every transaction to spot patterns that are costing you money.",
  },
  {
    question: "How quickly will I see ROI?",
    answer: "Most customers recover 3-10× their monthly subscription cost within the first month. The average restaurant discovers $500-$2,000 in recoverable revenue issues immediately after connecting.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption and never store your login credentials. All data is encrypted in transit and at rest. We're SOC 2 compliant and undergo regular security audits.",
  },
  {
    question: "Can I use MARGIX for multiple locations?",
    answer: "Yes! Our Enterprise plan is designed for multi-location restaurants and franchises. You'll get a unified dashboard to monitor all locations, with custom reporting and dedicated account management.",
  },
  {
    question: "Do I need technical knowledge to use MARGIX?",
    answer: "Not at all. MARGIX is designed for restaurant owners and operators, not tech experts. Our dashboard is intuitive, and our support team is always available to help you get the most out of the platform.",
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
                FAQ
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently{" "}
              <span className="text-gradient">Asked Questions</span>
            </h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Have questions? Our FAQ section has you covered with quick answers to the most common inquiries.
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
