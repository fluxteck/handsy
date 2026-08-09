"use client";

import { CouponType } from "@/types/accountType";
import { Copy, Ticket } from "lucide-react";
import toast from "react-hot-toast";

const CouponsContent = ({ coupons }: { coupons: CouponType[] }) => {
    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success(`Copied "${code}"`);
        } catch {
            toast.error("Couldn't copy code");
        }
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {coupons.map((coupon) => (
                <div
                    key={coupon.id}
                    className="flex flex-col justify-between rounded-xl border border-dashed border-border bg-home-bg-1 p-5"
                >
                    <div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2 font-medium text-secondary-foreground">
                                <Ticket className="size-4" />
                                {coupon.discount}
                            </span>
                            <span className="text-xs text-gray-3-foreground">
                                Expires{" "}
                                {new Date(coupon.expiry).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                        </div>
                        <p className="mt-2 font-medium text-secondary-foreground">{coupon.title}</p>
                        <p className="mt-1 text-sm text-gray-1-foreground">{coupon.description}</p>
                        {coupon.minOrder && (
                            <p className="mt-1 text-xs text-gray-3-foreground">Min. order {coupon.minOrder}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleCopy(coupon.code)}
                        className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:border-primary"
                    >
                        {coupon.code}
                        <Copy className="size-4 text-gray-1-foreground" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CouponsContent;
