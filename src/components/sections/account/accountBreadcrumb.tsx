"use client";

import PageHeader from "@/components/sections/pageHeader";
import { usePathname } from "next/navigation";
import { accountNavItems, isAccountNavItemActive } from "./accountNavItems";

// Doubles as the mobile "back to account menu" affordance now that sub-pages no longer repeat
// the full nav list — matches Myntra's pattern of a top back link instead of a persistent menu.
// Reuses PageHeader (the same breadcrumb strip every other page uses) via its `items` escape
// hatch, since the trail here is built dynamically from the current route rather than static props.
export const AccountBreadcrumb = () => {
    const pathname = usePathname();
    const isOverview = pathname === "/account";
    const currentItem = accountNavItems.find(
        (item) => item.href !== "/account" && isAccountNavItemActive(pathname, item.href)
    );
    const currentLabel = isOverview ? "My Account" : currentItem?.label ?? "Account";

    const items = isOverview
        ? [{ label: "Home", href: "/" }, { label: "My Account" }]
        : [
              { label: "Home", href: "/" },
              { label: "My Account", href: "/account" },
              { label: currentLabel },
          ];

    return <PageHeader items={items} pageTitle={currentLabel} currentPage={currentLabel} renderHeading={false} />;
};
