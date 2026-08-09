import { Heart, MapPin, StarFill } from "@/lib/icon";
import {
    Bell,
    Clock,
    CreditCard,
    Gift,
    HelpCircle,
    LayoutGrid,
    Package,
    RotateCcw,
    Settings,
} from "lucide-react";
import { ComponentType } from "react";

export type AccountNavItemType = {
    href: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
};

// Wishlist reuses the site's existing /wishlist page instead of a duplicate account/wishlist route.
export const accountNavItems: AccountNavItemType[] = [
    { href: "/account", label: "Overview", icon: LayoutGrid },
    { href: "/account/orders", label: "My Orders", icon: Package },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
    { href: "/account/payment-methods", label: "Payment Methods", icon: CreditCard },
    { href: "/account/reviews", label: "Reviews & Ratings", icon: StarFill },
    { href: "/account/recently-viewed", label: "Recently Viewed", icon: Clock },
    { href: "/account/notifications", label: "Notifications", icon: Bell },
    { href: "/account/coupons", label: "Coupons & Offers", icon: Gift },
    { href: "/account/returns", label: "Returns & Refunds", icon: RotateCcw },
    { href: "/account/settings", label: "Account Settings", icon: Settings },
    { href: "/account/help", label: "Help & Support", icon: HelpCircle },
];

export const isAccountNavItemActive = (pathname: string, href: string) => {
    if (href === "/account") return pathname === "/account";
    return pathname === href || pathname.startsWith(`${href}/`);
};
