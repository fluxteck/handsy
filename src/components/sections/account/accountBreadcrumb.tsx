"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { accountNavItems, isAccountNavItemActive } from "./accountNavItems";

// Doubles as the mobile "back to account menu" affordance now that sub-pages no longer repeat
// the full nav list — matches Myntra's pattern of a top back link instead of a persistent menu.
export const AccountBreadcrumb = ({ className }: { className?: string }) => {
    const pathname = usePathname();
    const isOverview = pathname === "/account";
    const currentItem = accountNavItems.find(
        (item) => item.href !== "/account" && isAccountNavItemActive(pathname, item.href)
    );

    const items = isOverview
        ? [{ label: "Home", href: "/" }, { label: "My Account" }]
        : [
              { label: "Home", href: "/" },
              { label: "My Account", href: "/account" },
              { label: currentItem?.label ?? "Account" },
          ];

    return <Breadcrumb items={items} className={className} />;
};
