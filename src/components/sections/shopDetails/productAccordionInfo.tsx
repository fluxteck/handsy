import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductAccordionInfo = ({
  description,
  returnsPolicy,
  additionalInfo,
}: {
  description: string;
  returnsPolicy: string;
  additionalInfo: { label: string; value: string }[];
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="description" className="mt-7.5">
      <AccordionItem value="description">
        <AccordionTrigger className="text-secondary-foreground font-medium lg:text-lg">
          Description & Specifications
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-1-foreground">{description}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="returns">
        <AccordionTrigger className="text-secondary-foreground font-medium lg:text-lg">
          Hassle-Free Returns & Exchanges
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-1-foreground">{returnsPolicy}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="additional-info">
        <AccordionTrigger className="text-secondary-foreground font-medium lg:text-lg">
          Additional Info
        </AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-2">
            {additionalInfo.map((item, index) => (
              <li key={index} className="flex gap-2 text-gray-1-foreground">
                <span className="font-medium text-secondary-foreground min-w-32">{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductAccordionInfo;
