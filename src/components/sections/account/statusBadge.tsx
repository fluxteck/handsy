import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
    processing: "bg-[#FFF3E0] text-[#B26A00]",
    shipped: "bg-[#E3F2FD] text-[#0D5CAB]",
    "out-for-delivery": "bg-[#E3F2FD] text-[#0D5CAB]",
    delivered: "bg-[#E8F5E9] text-[#2E7D32]",
    cancelled: "bg-[#FDEDED] text-[#C62828]",
    requested: "bg-[#FFF3E0] text-[#B26A00]",
    approved: "bg-[#E3F2FD] text-[#0D5CAB]",
    "picked-up": "bg-[#E3F2FD] text-[#0D5CAB]",
    refunded: "bg-[#E8F5E9] text-[#2E7D32]",
    rejected: "bg-[#FDEDED] text-[#C62828]",
};

const statusLabels: Record<string, string> = {
    processing: "Processing",
    shipped: "Shipped",
    "out-for-delivery": "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    requested: "Requested",
    approved: "Approved",
    "picked-up": "Picked up",
    refunded: "Refunded",
    rejected: "Rejected",
};

export const StatusBadge = ({ status, className }: { status: string; className?: string }) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
            statusStyles[status] ?? "bg-home-bg-2 text-gray-1-foreground",
            className
        )}
    >
        {statusLabels[status] ?? status}
    </span>
);
