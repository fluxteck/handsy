"use client";

import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import { StatusBadge } from "@/components/sections/account/statusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderType } from "@/types/accountType";
import currencyFormatter from "currency-formatter";
import { ChevronRight, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const filters: { value: string; label: string }[] = [
    { value: "all", label: "All" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "out-for-delivery", label: "Out for delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

const OrderRow = ({ order }: { order: OrderType }) => (
    <Link
        href={`/account/orders/${order.id}`}
        className="flex flex-col gap-4 py-5 transition-all duration-300 first:pt-0 last:pb-0 hover:opacity-70 sm:flex-row sm:items-center sm:justify-between"
    >
        <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item, index) => (
                    <div
                        key={item.productId}
                        className="relative size-14 shrink-0 overflow-hidden rounded-lg border-2 border-background bg-home-bg-1"
                        style={{ zIndex: order.items.length - index }}
                    >
                        <Image src={item.thumbnail} alt={item.title} fill sizes="56px" className="object-contain p-1" />
                    </div>
                ))}
            </div>
            <div>
                <p className="font-medium text-secondary-foreground">{order.id}</p>
                <p className="text-sm text-gray-1-foreground">
                    Placed on {new Date(order.placedOn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-sm text-gray-1-foreground">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
                    {currencyFormatter.format(order.total, { code: "USD" })}
                </p>
            </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
            <StatusBadge status={order.status} />
            <span className="flex items-center gap-1 text-sm text-gray-1-foreground">
                View details
                <ChevronRight className="size-4" />
            </span>
        </div>
    </Link>
);

const OrdersContent = ({ orders }: { orders: OrderType[] }) => {
    return (
        <Panel>
            <PanelHeading title="My Orders" description="Track, manage and review your orders." />
            <Tabs defaultValue="all">
                <TabsList className="mb-2 h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
                    {filters.map((filter) => (
                        <TabsTrigger
                            key={filter.value}
                            value={filter.value}
                            className="rounded-full border border-border px-4 py-1.5 text-sm capitalize md:text-sm lg:text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                        >
                            {filter.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {filters.map((filter) => {
                    const filteredOrders =
                        filter.value === "all" ? orders : orders.filter((order) => order.status === filter.value);
                    return (
                        <TabsContent key={filter.value} value={filter.value}>
                            {filteredOrders.length ? (
                                <div className="flex flex-col divide-y divide-border">
                                    {filteredOrders.map((order) => (
                                        <OrderRow key={order.id} order={order} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={PackageSearch} title="No orders here" description="Orders matching this status will show up here." />
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </Panel>
    );
};

export default OrdersContent;
