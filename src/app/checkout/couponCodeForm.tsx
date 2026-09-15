import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CouponCodeForm = () => {
  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="text"
        placeholder="Promo code"
        className="h-8 w-32 border-[1.5px] border-[#999796] px-2.5 text-xs bg-background"
      />
      <Button variant="outline" size="sm" className="shrink-0 h-8 px-3 text-xs">
        Apply
      </Button>
    </div>
  );
};

export default CouponCodeForm;
