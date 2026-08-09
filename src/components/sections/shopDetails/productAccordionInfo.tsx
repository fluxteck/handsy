import { FileText, Hammer, HeartHandshake, Ruler, Truck, type LucideIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionTriggerLabel = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => (
  <span className="flex items-center gap-3">
    <Icon
      className="size-5 shrink-0 text-gray-1-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary"
      strokeWidth={1.5}
      aria-hidden="true"
    />
    <span>{label}</span>
  </span>
);

// Fields that describe how the piece is built, as opposed to its physical specs.
const MANUFACTURING_LABELS = new Set(["Material", "Assembly"]);

const ProductAccordionInfo = ({
  description,
  shippingAndReplacement,
  returnsPolicy,
  additionalInfo,
}: {
  description: string;
  shippingAndReplacement: string;
  returnsPolicy: string;
  additionalInfo: { label: string; value: string }[];
}) => {
  const specificationInfo = additionalInfo.filter((item) => !MANUFACTURING_LABELS.has(item.label));
  const manufacturingInfo = additionalInfo.filter((item) => MANUFACTURING_LABELS.has(item.label));

  return (
    <div className="mt-7.5 rounded-2xl border border-gray-2 bg-background p-5 transition-shadow duration-300 hover:shadow-sm lg:p-6">
      <Accordion type="single" collapsible defaultValue="specification">
        <AccordionItem value="specification" className="border-gray-2">
          <AccordionTrigger className="group text-secondary-foreground font-medium lg:text-lg">
            <AccordionTriggerLabel icon={Ruler} label="Specification" />
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2.5">
              {specificationInfo.map((item, index) => (
                <li key={index} className="flex gap-2 text-gray-1-foreground">
                  <span className="font-medium text-secondary-foreground min-w-32">{item.label}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="description" className="border-gray-2">
          <AccordionTrigger className="group text-secondary-foreground font-medium lg:text-lg">
            <AccordionTriggerLabel icon={FileText} label="Description" />
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-1-foreground leading-relaxed">{description}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manufacturing" className="border-gray-2">
          <AccordionTrigger className="group text-secondary-foreground font-medium lg:text-lg">
            <AccordionTriggerLabel icon={Hammer} label="Manufacturing Details" />
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2.5">
              {manufacturingInfo.map((item, index) => (
                <li key={index} className="flex gap-2 text-gray-1-foreground">
                  <span className="font-medium text-secondary-foreground min-w-32">{item.label}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shipping-replacement" className="border-gray-2">
          <AccordionTrigger className="group text-secondary-foreground font-medium lg:text-lg">
            <AccordionTriggerLabel icon={Truck} label="Shipping & Replacement" />
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-1-foreground leading-relaxed">{shippingAndReplacement}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="care-instructions" className="border-b-0">
          <AccordionTrigger className="group text-secondary-foreground font-medium lg:text-lg">
            <AccordionTriggerLabel icon={HeartHandshake} label="Care & Instructions" />
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-1-foreground leading-relaxed">{returnsPolicy}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductAccordionInfo;
