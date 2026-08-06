import Link from "next/link";
import { ChevronRight } from "@/lib/icon";
import { cn } from "@/lib/utils";

export type BreadcrumbItemType = {
  label: string;
  href?: string;
};

const Breadcrumb = ({
  items,
  className,
}: {
  items: BreadcrumbItemType[];
  className?: string;
}) => {
  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center flex-wrap gap-0.5", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-0.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-3-foreground text-base hover:text-gray-1-foreground transition-all duration-500"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-base",
                  isLast ? "text-gray-1-foreground font-medium" : "text-gray-3-foreground"
                )}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="text-gray-3-foreground">
                <ChevronRight className="size-4" />
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
