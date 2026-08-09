import { ReturnRequestType } from "@/types/accountType";

export const returnsData: ReturnRequestType[] = [
    {
        id: "RET-4021",
        orderId: "ORD-97711",
        productTitle: "Modern Tolik Chair",
        thumbnail: "/images/home-1/featured-products/img-3.webp",
        reason: "Ordered by mistake",
        status: "refunded",
        requestedOn: "2026-06-20",
        refundAmount: 300,
    },
    {
        id: "RET-4118",
        orderId: "ORD-97960",
        productTitle: "Cherie Chair",
        thumbnail: "/images/home-1/featured-products/img-8.webp",
        reason: "Slight damage on arrival",
        status: "picked-up",
        requestedOn: "2026-07-12",
        refundAmount: 138,
    },
];
