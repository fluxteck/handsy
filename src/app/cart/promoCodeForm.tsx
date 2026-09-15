import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PromoCodeForm = () => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Promo code"
        className="h-9 border-[1.5px] border-[#999796] px-3 text-xs bg-background"
      />
      <Button variant="outline" size="sm" className="shrink-0 h-9 px-3 text-xs">
        Apply
      </Button>
    </div>
  );
};

export default PromoCodeForm;
