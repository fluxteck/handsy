"use client";

import { ChevronRight } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth/otp";
import { accountNavItems, isAccountNavItemActive } from "./accountNavItems";

const NavLink = ({
    href,
    label,
    icon: Icon,
    isActive,
    unreadCount,
    className,
}: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    unreadCount?: number;
    className?: string;
}) => (
    <Link
        href={href}
        className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-all duration-300",
            isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-1-foreground hover:bg-home-bg-2 hover:text-secondary-foreground",
            className
        )}
    >
        <Icon
            className={cn(
                "size-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110",
                isActive && "text-primary-foreground"
            )}
        />
        <span className="flex-1 truncate">{label}</span>
        {!!unreadCount && (
            <span
                className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                    isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                )}
            >
                {unreadCount}
            </span>
        )}
    </Link>
);

// Ends the real Supabase session, not just the appearance of one. `refresh()`
// after navigating re-runs the server components so anything that rendered as
// signed-in re-renders as a guest; without it the account shell would keep
// showing stale, cached customer data.
const handleLogout = async (router: ReturnType<typeof useRouter>) => {
    try {
        await signOut();
        toast.success("Logged out successfully");
    } catch {
        toast.error("Couldn't sign you out. Please try again.");
        return;
    }
    router.push("/");
    router.refresh();
};

export const AccountSidebar = ({ unreadCount = 0 }: { unreadCount?: number }) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="hidden shrink-0 lg:block lg:w-[280px]">
            <nav className="sticky top-28 flex flex-col gap-1 rounded-2xl border border-border bg-background p-3 shadow-3xl">
                {accountNavItems.map((item) => (
                    <NavLink
                        key={item.href}
                        {...item}
                        isActive={isAccountNavItemActive(pathname, item.href)}
                        unreadCount={item.href === "/account/notifications" ? unreadCount : undefined}
                    />
                ))}
                <div className="my-2 border-t border-border" />
                <button
                    type="button"
                    aria-label="Logout"
                    onClick={() => handleLogout(router)}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 text-base text-gray-1-foreground transition-all duration-300 hover:bg-home-bg-2 hover:text-secondary-foreground"
                >
                    <LogOut className="size-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <span>Logout</span>
                </button>
            </nav>
        </aside>
    );
};

// Myntra-style account menu: a single vertical list of full-width rows, rendered only on the
// /account overview page (the "hub"). Sub-pages rely on AccountBreadcrumb's "My Account" link to
// get back here, matching how Myntra's own sub-screens use a back arrow instead of repeating the
// full menu on every screen.
export const AccountMobileMenu = ({ unreadCount = 0 }: { unreadCount?: number }) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <nav className="overflow-hidden rounded-2xl border border-border bg-background lg:hidden">
            {accountNavItems.map((item, index) => {
                const isActive = isAccountNavItemActive(pathname, item.href);
                const count = item.href === "/account/notifications" ? unreadCount : 0;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3.5 transition-colors duration-200 active:bg-home-bg-2",
                            index !== 0 && "border-t border-border",
                            isActive ? "bg-home-bg-1" : "hover:bg-home-bg-1"
                        )}
                    >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-secondary-foreground">
                            <item.icon className="size-[18px]" />
                        </span>
                        <span className="flex-1 text-[15px] text-secondary-foreground">{item.label}</span>
                        {!!count && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                                {count}
                            </span>
                        )}
                        <ChevronRight className="size-4 shrink-0 text-gray-3-foreground" />
                    </Link>
                );
            })}
            <button
                type="button"
                onClick={() => handleLogout(router)}
                className="flex w-full items-center gap-4 border-t border-border px-4 py-3.5 text-left transition-colors duration-200 hover:bg-home-bg-1 active:bg-home-bg-2"
            >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-secondary-foreground">
                    <LogOut className="size-[18px]" />
                </span>
                <span className="flex-1 text-[15px] text-secondary-foreground">Logout</span>
            </button>
        </nav>
    );
};
