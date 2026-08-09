import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const b2bFaqData = [
  {
    id: "one",
    title: "What is the minimum order quantity (MOQ) for wholesale?",
    ans: "MOQs typically start at 50 units per SKU, though this varies by product category and customization level. Our team will confirm exact MOQs when reviewing your quote request.",
  },
  {
    id: "two",
    title: "Can you produce custom or private-label designs?",
    ans: "Yes. We work with your specifications, sketches, or reference products to develop custom pieces, including size, wood species, finish, and branded packaging for private label.",
  },
  {
    id: "three",
    title: "What are your typical production and lead times?",
    ans: "Standard catalog items usually ship within 3–4 weeks of order confirmation. Custom orders range from 5–8 weeks depending on complexity and quantity, and are confirmed upfront in your quote.",
  },
  {
    id: "four",
    title: "Do you ship internationally?",
    ans: "Yes, we regularly export to over 30 countries. We handle export documentation, freight coordination, and can ship via sea or air depending on your timeline and budget.",
  },
  {
    id: "five",
    title: "Can we request product samples before placing a bulk order?",
    ans: "Absolutely. Samples can be arranged for a fee, which is typically credited back against your first bulk order once confirmed.",
  },
  {
    id: "six",
    title: "What payment terms do you offer B2B partners?",
    ans: "We generally require a deposit to confirm production, with the balance due before shipment. Established partners may qualify for extended terms — this is discussed during onboarding.",
  },
];

const B2bFaq = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="B2B frequently asked questions">
      <div className="container max-w-4xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            FAQ <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Business inquiries, answered</h5>
        </div>

        <div className="mt-10">
          <Accordion type="single" defaultValue="one" collapsible>
            {b2bFaqData.map(({ ans, id, title }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger className="text-secondary-foreground lg:text-2xl text-xl font-medium leading-[141%] py-5 hover:no-underline">
                  {title}
                </AccordionTrigger>
                <AccordionContent className="text-gray-3-foreground text-xl leading-[170%]">
                  {ans}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default B2bFaq;
