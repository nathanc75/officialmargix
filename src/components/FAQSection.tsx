import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I get started with MARGIX?",
    answer: "Simply connect your POS system and we'll automatically sync your order data across all channels — dine-in, takeout, and delivery. No manual uploads needed. Our AI starts analyzing your performance right away.",
  },
  {
    question: "What kind of insights will I get?",
    answer: "Our AI provides performance analysis, sales trends, efficiency insights, and actionable recommendations. When delivery platforms like Uber Eats or DoorDash are connected to your POS, we include those insights in the same unified analysis.",
  },
  {
    question: "Which POS systems do you support?",
    answer: "We support most popular POS systems used in the restaurant industry. Contact us to confirm compatibility with your specific system and get started with the integration.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption for all POS connections and data storage. Your restaurant data is protected at all times and never shared with third parties.",
  },
  {
    question: "Can I use MARGIX for multiple restaurant locations?",
    answer: "Yes! Our Custom plan is designed for multi-location restaurants and franchise groups. Connect each location's POS and get a unified view of performance across all sites.",
  },
  {
    question: "Do I need technical knowledge to use MARGIX?",
    answer: "Not at all. Our platform is designed for restaurant owners, not tech experts. Once your POS is connected, everything syncs automatically and insights appear in an easy-to-understand dashboard.",
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
              Common{" "}
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Everything you need to know about how MARGIX analyzes your data.
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
