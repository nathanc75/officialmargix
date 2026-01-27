import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does LeakDetector work?",
    answer: "Simply upload your financial documents — bank statements, invoices, payment processor exports, or any financial reports. Our AI scans the data to identify missing payments, duplicate charges, unused subscriptions, and other revenue leaks. You get a simple report showing what was found and how to fix it.",
  },
  {
    question: "What types of files can I upload?",
    answer: "We accept PDF and CSV files including bank statements, credit card statements, payment processor exports (Stripe, PayPal, Square, etc.), invoices, expense reports, and subscription billing summaries.",
  },
  {
    question: "Do I need to connect my bank account?",
    answer: "No! Unlike other financial tools, LeakDetector works entirely with file uploads. You never need to connect your bank account, POS system, or any third-party platform. Just upload the files you already have.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption for all file uploads and processing. Your files are analyzed in real-time and never stored permanently. We never share your data with third parties.",
  },
  {
    question: "What kind of leaks can you find?",
    answer: "We detect missing payments, underpayments, duplicate charges, failed recurring payments, unused subscriptions, pricing inconsistencies, fee overcharges, and unexpected cost increases. Any discrepancy between expected and actual financial outcomes.",
  },
  {
    question: "How much does it cost?",
    answer: "Your first leak scan is completely free. After that, you can subscribe for ongoing monitoring and detailed reports. See our pricing page for current plans.",
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
              Everything you need to know about finding revenue leaks in your business.
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
