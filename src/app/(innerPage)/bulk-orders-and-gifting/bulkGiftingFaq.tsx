"use client";

import { motion } from "framer-motion";
import { Boxes, Clock3, Globe2, Palette, Percent, Ruler } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Answers mirror the terms already published on the B2B page.
const faqs = [
  {
    id: "moq",
    icon: Boxes,
    title: "What is the minimum order quantity?",
    ans: "Minimums typically start at 50 units per SKU, though this varies by product and customisation. Share your quantity in the enquiry and our team will confirm what's possible for your order.",
  },
  {
    id: "custom",
    icon: Palette,
    title: "Can the gifts be personalised or branded?",
    ans: "Yes. Engravings, finishes, and branded packaging can be adapted to your brand or occasion. Tell us what you have in mind and we'll confirm the options for your chosen products in your quote.",
  },
  {
    id: "lead-time",
    icon: Clock3,
    title: "How long does a bulk order take?",
    ans: "Standard catalogue items usually ship within 3–4 weeks of order confirmation. Custom orders take 5–8 weeks depending on complexity and quantity, and lead times are confirmed upfront in your quote — so for weddings and festive seasons, we recommend enquiring early.",
  },
  {
    id: "international",
    icon: Globe2,
    title: "Do you deliver bulk orders internationally?",
    ans: "Yes. We regularly export to over 30 countries, handle export documentation and freight coordination, and can ship by sea or air depending on your timeline and budget.",
  },
  {
    id: "samples",
    icon: Ruler,
    title: "Can I see a sample before placing the order?",
    ans: "Absolutely. Samples can be arranged for a fee, which is typically credited back against your first bulk order once confirmed.",
  },
  {
    id: "payment",
    icon: Percent,
    title: "What are the payment terms?",
    ans: "We generally require a deposit to confirm production, with the balance due before shipment. Your quote sets out the exact terms for your order.",
  },
];

const BulkGiftingFaq = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="Bulk orders and gifting FAQ">
      <div className="container max-w-4xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            FAQ <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Bulk orders &amp; gifting, answered</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            What companies, couples, and event planners ask us before placing a bulk order.
          </p>
        </div>

        <div className="mt-10">
          <Accordion type="single" defaultValue="moq" collapsible className="flex flex-col gap-4">
            {faqs.map(({ ans, id, title, icon: Icon }, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
              >
                <AccordionItem
                  value={id}
                  className="group overflow-hidden rounded-2xl border border-b-0 border-gray-2 bg-background transition-all duration-500 hover:border-primary/30 hover:shadow-3xl data-[state=open]:border-primary/40 data-[state=open]:shadow-3xl"
                >
                  <AccordionTrigger className="gap-4 px-5 py-5 hover:no-underline lg:px-7 lg:py-6">
                    <span className="flex items-center gap-4 text-left">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground transition-colors duration-500 group-hover:bg-primary group-hover:text-white group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                        <Icon className="size-4.5" />
                      </span>
                      <span className="text-lg font-medium leading-[141%] text-secondary-foreground lg:text-xl">
                        {title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pl-[4.75rem] text-base leading-[170%] text-gray-1-foreground lg:px-7 lg:pl-[5.25rem] lg:text-lg">
                    {ans}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default BulkGiftingFaq;
