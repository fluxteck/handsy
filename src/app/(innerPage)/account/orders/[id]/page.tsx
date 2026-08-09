import { Button } from "@/components/ui/button";
import { Panel } from "@/components/sections/account/panel";
import { StatusBadge } from "@/components/sections/account/statusBadge";
import { getOrdersData } from "@/lib/data";
import currencyFormatter from "currency-formatter";
import { Check, ChevronLeft, MapPin, RotateCcw, Wallet } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Order Details",
    description: "Track your order and view order details.",
};

const OrderDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const orders = await getOrdersData();
    const order = orders.find((o) => o.id === id);

    if (!order) notFound();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/account/orders"
                    className="flex items-center gap-1 text-sm text-gray-1-foreground transition-all duration-300 hover:text-secondary-foreground"
                >
                    <ChevronLeft className="size-4" />
                    Back to orders
                </Link>
                {order.status === "delivered" && (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/account/returns">
                            <RotateCcw className="size-4" />
                            Return / Refund
                        </Link>
                    </Button>
                )}
            </div>

            <Panel>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-medium text-secondary-foreground lg:text-2xl">{order.id}</h1>
                        <p className="mt-1 text-sm text-gray-1-foreground">
                            Placed on{" "}
                            {new Date(order.placedOn).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {order.status !== "cancelled" && (
                    <div className="mb-8">
                        {/* Vertical stepper — mobile/tablet, where 5 side-by-side steps have no room to breathe. */}
                        <div className="flex flex-col lg:hidden">
                            {order.tracking.map((step, index) => (
                                <div key={step.label} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <span
                                            className={
                                                "flex size-8 shrink-0 items-center justify-center rounded-full " +
                                                (step.completed
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-home-bg-2 text-gray-3-foreground")
                                            }
                                        >
                                            {step.completed ? <Check className="size-4" /> : index + 1}
                                        </span>
                                        {index < order.tracking.length - 1 && (
                                            <span
                                                className={
                                                    "my-1 w-0.5 min-h-6 flex-1 " +
                                                    (step.completed ? "bg-primary" : "bg-home-bg-2")
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className={index < order.tracking.length - 1 ? "pb-6" : ""}>
                                        <p className="text-sm font-medium text-secondary-foreground">{step.label}</p>
                                        <p className="text-xs text-gray-3-foreground">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Horizontal stepper — desktop, where all steps fit comfortably in one row. */}
                        <div className="hidden items-start lg:flex">
                            {order.tracking.map((step, index) => (
                                <div key={step.label} className="flex flex-1 items-start last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <span
                                            className={
                                                "flex size-8 shrink-0 items-center justify-center rounded-full " +
                                                (step.completed
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-home-bg-2 text-gray-3-foreground")
                                            }
                                        >
                                            {step.completed ? <Check className="size-4" /> : index + 1}
                                        </span>
                                        <p className="mt-2 max-w-[90px] text-center text-xs text-gray-1-foreground">
                                            {step.label}
                                        </p>
                                        <p className="text-center text-[11px] text-gray-3-foreground">{step.date}</p>
                                    </div>
                                    {index < order.tracking.length - 1 && (
                                        <div
                                            className={
                                                "mt-4 h-0.5 flex-1 " + (step.completed ? "bg-primary" : "bg-home-bg-2")
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {order.deliveryEstimate && (
                            <p className="mt-4 text-sm text-gray-1-foreground">{order.deliveryEstimate}</p>
                        )}
                    </div>
                )}

                <div className="flex flex-col divide-y divide-border">
                    {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-home-bg-1">
                                <Image src={item.thumbnail} alt={item.title} fill sizes="64px" className="object-contain p-1" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-secondary-foreground">{item.title}</p>
                                <p className="text-sm text-gray-1-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-secondary-foreground">
                                {currencyFormatter.format(item.price, { code: "USD" })}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-border pt-4">
                    <p className="font-medium text-secondary-foreground">Order Total</p>
                    <p className="font-medium text-secondary-foreground">
                        {currencyFormatter.format(order.total, { code: "USD" })}
                    </p>
                </div>
            </Panel>

            <div className="grid gap-6 sm:grid-cols-2">
                <Panel className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-secondary-foreground">
                        <MapPin className="size-4" />
                    </span>
                    <div>
                        <p className="font-medium text-secondary-foreground">Shipping Address</p>
                        <p className="mt-1 text-sm text-gray-1-foreground">{order.shippingAddress}</p>
                    </div>
                </Panel>
                <Panel className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-secondary-foreground">
                        <Wallet className="size-4" />
                    </span>
                    <div>
                        <p className="font-medium text-secondary-foreground">Payment Method</p>
                        <p className="mt-1 text-sm text-gray-1-foreground">{order.paymentMethod}</p>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
