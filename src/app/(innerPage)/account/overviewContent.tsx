"use client";

import { Button } from "@/components/ui/button";
import { Call, Email, Heart } from "@/lib/icon";
import { cn } from "@/lib/utils";
import { CustomerType } from "@/types/accountType";
import currencyFormatter from "currency-formatter";
import { ChevronRight, PackageCheck, PackageSearch, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountMobileMenu } from "@/components/sections/account/accountSidebar";
import { Panel } from "@/components/sections/account/panel";
import { StatusBadge } from "@/components/sections/account/statusBadge";
import { useMyOrders, useMyProfile } from "@/lib/account/use-account";
import { getStoreCurrency } from "@/lib/config";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { productPath } from "@/lib/productPath";

/** Orders are priced in the store's currency, not a hardcoded dollar. */
const storeCurrency = getStoreCurrency();

const StatCard = ({
    icon: Icon,
    label,
    shortLabel,
    value,
    hint,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    shortLabel: string;
    value: number | string;
    hint: string;
}) => (
    <Panel className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-secondary-foreground sm:size-12">
            <Icon className="size-4 sm:size-5" />
        </span>
        <div className="min-w-0">
            <p className="truncate text-xs text-gray-1-foreground sm:hidden">{shortLabel}</p>
            <p className="hidden truncate text-sm text-gray-1-foreground sm:block">{label}</p>
            <p className="text-xl font-medium text-secondary-foreground sm:text-2xl">{value}</p>
            <p className="hidden text-xs text-gray-3-foreground sm:block">{hint}</p>
        </div>
    </Panel>
);

const OverviewContent = ({ unreadCount }: { unreadCount: number }) => {
    // Owner-scoped reads happen in the browser — see use-account.ts.
    const { data: profile } = useMyProfile();
    const { data: orders } = useMyOrders();
    /* The profile arrives asynchronously. Rather than sprinkle null checks
       through the markup, fall back to a blank record with the same shape so
       the panels render their normal skeleton of labels while it loads. */
    const customer: CustomerType = profile ?? {
        id: "",
        name: "",
        email: "",
        phone: "",
        avatar: "",
        verified: false,
        memberSince: "",
    };
    const [isClient, setIsClient] = useState(false);
    const { products: wishlistProducts } = useWishlist();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const activeOrders = orders.filter((o) => ["processing", "shipped", "out-for-delivery"].includes(o.status));
    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const wishlistCount = isClient ? wishlistProducts.length : 0;
    const initials = customer.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="flex flex-col gap-6">
            <Panel className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                    <p className="text-gray-1-foreground">Welcome back,</p>
                    <h1 className="mt-1 font-display text-3xl italic text-secondary-foreground lg:text-4xl">
                        {customer.name}
                    </h1>
                    <p className="mt-2 text-sm text-gray-1-foreground">
                        Manage your account and track your activity.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-1-foreground">
                        <span className="flex items-center gap-2">
                            <Email className="size-4" />
                            {customer.email}
                        </span>
                        <span className="flex items-center gap-2">
                            <Call className="size-4" />
                            {customer.phone}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end lg:justify-start">
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            {customer.avatar ? (
                                <Image
                                    src={customer.avatar}
                                    alt={customer.name}
                                    width={64}
                                    height={64}
                                    className="size-14 rounded-full object-cover sm:size-16"
                                />
                            ) : (
                                <span className="flex size-14 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground sm:size-16 sm:text-lg">
                                    {initials}
                                </span>
                            )}
                            {customer.verified && (
                                <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background lg:hidden">
                                    <ShieldCheck className="size-3" />
                                </span>
                            )}
                        </div>
                        {customer.verified && (
                            <span className="hidden items-center gap-1 rounded-full bg-home-bg-2 px-3 py-1 text-xs font-medium text-secondary-foreground lg:flex">
                                <ShieldCheck className="size-3.5" />
                                Verified
                            </span>
                        )}
                    </div>
                    <Button asChild size="sm">
                        <Link href="/account/settings">Edit Profile</Link>
                    </Button>
                </div>
            </Panel>

            <AccountMobileMenu unreadCount={unreadCount} />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard
                    icon={ShoppingBag}
                    label="Total Orders"
                    shortLabel="Orders"
                    value={orders.length}
                    hint="All time orders"
                />
                <StatCard
                    icon={PackageSearch}
                    label="Active Orders"
                    shortLabel="Active"
                    value={activeOrders.length}
                    hint="In progress"
                />
                <StatCard
                    icon={PackageCheck}
                    label="Delivered Orders"
                    shortLabel="Delivered"
                    value={deliveredOrders.length}
                    hint="Successfully delivered"
                />
                <StatCard
                    icon={Heart}
                    label="Wishlist Items"
                    shortLabel="Wishlist"
                    value={wishlistCount || 0}
                    hint="Saved for later"
                />
            </div>

            <Panel>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-medium text-secondary-foreground">Recent Orders</h2>
                    <Link
                        href="/account/orders"
                        className="flex items-center gap-1 text-sm text-gray-1-foreground transition-all duration-300 hover:text-secondary-foreground"
                    >
                        View all
                        <ChevronRight className="size-4" />
                    </Link>
                </div>
                <div className="flex flex-col divide-y divide-border">
                    {orders.slice(0, 3).map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className="flex flex-col gap-2 py-4 transition-all duration-300 first:pt-0 last:pb-0 hover:opacity-70 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-home-bg-1">
                                    <Image
                                        src={order.items[0].thumbnail}
                                        alt={order.items[0].title}
                                        fill
                                        sizes="56px"
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-secondary-foreground">{order.number ?? order.id}</p>
                                    <p className="text-sm text-gray-1-foreground">
                                        {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
                                        {currencyFormatter.format(order.total, { code: storeCurrency })}
                                    </p>
                                </div>
                            </div>
                            <StatusBadge status={order.status} className="ml-[72px] self-start sm:ml-0 sm:self-auto" />
                        </Link>
                    ))}
                </div>
            </Panel>

            {isClient && wishlistProducts.length > 0 && (
                <Panel>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-medium text-secondary-foreground">From Your Wishlist</h2>
                        <Link
                            href="/wishlist"
                            className="flex items-center gap-1 text-sm text-gray-1-foreground transition-all duration-300 hover:text-secondary-foreground"
                        >
                            View all
                            <ChevronRight className="size-4" />
                        </Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hidden">
                        {wishlistProducts.slice(0, 6).map((product) => (
                            <Link
                                key={product.id}
                                href={productPath(product)}
                                className={cn(
                                    "flex w-24 shrink-0 flex-col items-center gap-2 text-center transition-all duration-300 hover:opacity-70"
                                )}
                            >
                                <div className="relative size-24 overflow-hidden rounded-xl bg-home-bg-1">
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.title}
                                        fill
                                        sizes="96px"
                                        className="object-contain p-2"
                                    />
                                </div>
                                <p className="line-clamp-1 w-full text-xs text-gray-1-foreground">{product.title}</p>
                            </Link>
                        ))}
                    </div>
                </Panel>
            )}
        </div>
    );
};

export default OverviewContent;
