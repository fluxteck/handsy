"use client";

import { motion } from "framer-motion";
import { Boxes, Building2, Globe2, Percent, ShieldCheck, Wand2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const interiorSolutionsFaqData = [
  {
    id: "one",
    icon: Building2,
    title: "Do you work directly with architects and interior design firms?",
    ans: "Yes. We collaborate directly with architecture and interior design studios on bulk and project-based furniture and decor sourcing, including custom sizing, finishes, and sample approvals tailored to your specifications.",
  },
  {
    id: "two",
    icon: Boxes,
    title: "What is the minimum order for builder and hospitality projects?",
    ans: "Minimums vary by product category and project type, and typically start at 50 units per SKU. Our B2B team confirms exact minimums once we review your project brief.",
  },
  {
    id: "three",
    icon: Wand2,
    title: "Can Handsy Market manufacture custom interior pieces to our specifications?",
    ans: "Yes. Our state-of-the-art manufacturing capabilities and trusted partner network support full customization — sizing, wood species, joinery, finishes, and upholstery — built to your drawings or mood board.",
  },
  {
    id: "four",
    icon: ShieldCheck,
    title: "What quality standards do your manufacturing partners follow?",
    ans: "Every batch is quality-checked against agreed specifications before it leaves our workshops, ensuring consistent results across a single property or a multi-site rollout.",
  },
  {
    id: "five",
    icon: Globe2,
    title: "Do you support multi-property or phased hospitality rollouts?",
    ans: "Absolutely. We coordinate consistent, brand-aligned furnishing and delivery scheduling across multiple properties or development phases, with a dedicated account manager for ongoing collaboration.",
  },
  {
    id: "six",
    icon: Percent,
    title: "How does B2B pricing work for interior and home decor solutions?",
    ans: "Pricing is transparent and tiered, improving with project scale and order volume. Share your project brief and our team will respond with competitive B2B pricing within 1–2 business days.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: interiorSolutionsFaqData.map(({ title, ans }) => ({
    "@type": "Question",
    name: title,
    acceptedAnswer: {
      "@type": "Answer",
      text: ans,
    },
  })),
};

const InteriorSolutionsFaq = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="Frequently asked questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container max-w-4xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            FAQ <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h2 className="mt-3 text-heading capitalize text-secondary-foreground font-normal">
            Interior &amp; home decor sourcing, answered
          </h2>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Everything architects, builders, and hospitality teams ask us before starting a
            project.
          </p>
        </div>

        <div className="mt-10">
          <Accordion type="single" defaultValue="one" collapsible className="flex flex-col gap-4">
            {interiorSolutionsFaqData.map(({ ans, id, title, icon: Icon }, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
              >
                <AccordionItem
                  value={id}
                  className="group border-b-0 rounded-2xl border border-gray-2 bg-background overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-3xl data-[state=open]:border-primary/40 data-[state=open]:shadow-3xl"
                >
                  <AccordionTrigger className="px-5 lg:px-7 py-5 lg:py-6 hover:no-underline gap-4">
                    <span className="flex items-center gap-4 text-left">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground transition-colors duration-500 group-hover:bg-primary group-hover:text-white group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                        <Icon className="size-4.5" />
                      </span>
                      <span className="text-secondary-foreground text-lg lg:text-xl font-medium leading-[141%]">
                        {title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-1-foreground text-base lg:text-lg leading-[170%] px-5 lg:px-7 pl-[4.75rem] lg:pl-[5.25rem]">
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

export default InteriorSolutionsFaq;
