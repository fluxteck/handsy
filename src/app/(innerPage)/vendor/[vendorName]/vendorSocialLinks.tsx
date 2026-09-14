import Link from "next/link";
import { Facebook, Instagram, Twitter } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { VendorType } from "@/types/vendorType";

const socialIconMap = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
} as const;

/** A vendor's populated social links, as `[platform, href]` pairs. */
export function getVendorSocialEntries(vendor: VendorType) {
  return (Object.entries(vendor.social) as [keyof typeof socialIconMap, string | undefined][]).filter(
    ([, href]) => !!href
  );
}

/**
 * A vendor's social icon row — shared by the storefront hero and the About
 * section so both read as one design language rather than two copies that
 * could drift.
 */
const VendorSocialLinks = ({
  vendor,
  iconClassName = "size-9",
  className,
}: {
  vendor: VendorType;
  /** Sizes the circular icon button itself, e.g. "size-8". */
  iconClassName?: string;
  className?: string;
}) => {
  const socialEntries = getVendorSocialEntries(vendor);
  if (socialEntries.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socialEntries.map(([platform, href]) => {
        const Icon = socialIconMap[platform];
        return (
          <Link
            key={platform}
            href={href as string}
            aria-label={`${vendor.name} on ${platform}`}
            className={cn(
              "flex items-center justify-center rounded-full border border-gray-2 text-gray-1-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white",
              iconClassName
            )}
          >
            <Icon className="size-4" />
          </Link>
        );
      })}
    </div>
  );
};

export default VendorSocialLinks;
