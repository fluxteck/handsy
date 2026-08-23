import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import { StatusBadge } from "@/components/sections/account/statusBadge";
import { getReturnsData } from "@/lib/data";
import currencyFormatter from "currency-formatter";
import { getStoreCurrency } from "@/lib/config";
import { RotateCcw } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Returns & Refunds",
    description: "Track the status of your return and refund requests.",
};

const ReturnsPage = async () => {
    const returns = await getReturnsData();

    return (
        <Panel>
            <PanelHeading
                title="Returns & Refunds"
                description="Requests are initiated from an eligible order's details page."
            />
            {returns.length ? (
                <div className="flex flex-col divide-y divide-border">
                    {returns.map((request) => (
                        <div key={request.id} className="flex flex-wrap items-center gap-4 py-5 first:pt-0 last:pb-0">
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-home-bg-1">
                                <Image
                                    src={request.thumbnail}
                                    alt={request.productTitle}
                                    fill
                                    sizes="64px"
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-secondary-foreground">{request.productTitle}</p>
                                <p className="text-sm text-gray-1-foreground">
                                    {request.id} · Order {request.orderId}
                                </p>
                                <p className="text-sm text-gray-1-foreground">Reason: {request.reason}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <StatusBadge status={request.status} />
                                <p className="text-sm font-medium text-secondary-foreground">
                                    {currencyFormatter.format(request.refundAmount, { code: getStoreCurrency() })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={RotateCcw}
                    title="No return requests"
                    description="Start a return from an eligible order in My Orders."
                />
            )}
        </Panel>
    );
};

export default ReturnsPage;
