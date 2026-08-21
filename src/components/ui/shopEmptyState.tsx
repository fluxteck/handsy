import { Button } from "@/components/ui/button";
import { menuList } from "@/db/menuList";
import { Close } from "@/lib/icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentType } from "react";

type ShopEmptyStateProps = {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  className?: string;
};

const ShopEmptyState = ({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref = "/shop-2",
  className,
}: ShopEmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center border rounded-lg px-6 py-14 lg:py-20 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both",
        className
      )}
    >
      <h3 className="text-heading text-secondary-foreground">{title}</h3>
      <p className="mt-1.5 lg:text-xl text-lg text-gray-1-foreground">
        {description}
      </p>

      <div className="relative my-8 lg:my-10 flex size-32 lg:size-40 items-center justify-center animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-home-bg-1 after:absolute after:inset-0 after:rounded-full after:bg-[rgba(138,138,138,0.25)] after:animate-spring-one"
        />
        <Icon className="relative size-14 lg:size-16 text-gray-1-foreground" />
        <span className="absolute right-2 bottom-2 lg:right-3 lg:bottom-3 flex size-8 lg:size-10 items-center justify-center rounded-full bg-primary text-white shadow-md ring-4 ring-background">
          <Close className="size-3.5 lg:size-4" strokeWidth="3" />
        </span>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-1 duration-700 delay-300 fill-mode-both">
        <p className="font-medium text-secondary-foreground">
          What would you like to buy? Pick from our best-selling categories
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {menuList.map(({ id, label, path }) => (
            <li key={id}>
              <Link
                href={path}
                className="multiline-hover text-gray-1-foreground hover:text-secondary-foreground capitalize transition-colors duration-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Button
        asChild
        className="mt-9 w-full max-w-sm uppercase tracking-wide hover:scale-[1.02] transition-transform duration-300"
      >
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>

      <Link
        href="/b2b"
        className="mt-4 text-sm text-gray-1-foreground hover:text-secondary-foreground underline underline-offset-4 transition-colors duration-300"
      >
        Buying in bulk for your business? Get wholesale pricing
      </Link>
    </div>
  );
};

export default ShopEmptyState;
