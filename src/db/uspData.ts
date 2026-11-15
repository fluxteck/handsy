import { Boxes, HeartHandshake, MessageCircle, PackageCheck, Truck, type LucideIcon } from "lucide-react";

export type UspBlockType = {
    id: string;
    icon: LucideIcon;
    title: string;
    text: string;
    /** Optional destination; the whole block becomes a link when set. */
    href?: string;
};

/**
 * The homepage trust strip. Each point restates a promise the product page
 * already makes to every shopper — the "Shipping & Replacement" and
 * "Returns & Exchanges" policies passed to `ProductAccordionInfo`, and the
 * WhatsApp / bulk-quote actions in `NeedHelp` — with matching icons. No
 * statistics or reach claims: change the product page policy and this list
 * together.
 */
export const uspData: UspBlockType[] = [
    {
        id: "dispatch",
        icon: Truck,
        title: "Quick Dispatch",
        text: "Within 2–3 business days",
    },
    {
        id: "replacement",
        icon: PackageCheck,
        title: "Free Replacement",
        text: "If damaged, within 7 days",
    },
    {
        id: "returns",
        icon: HeartHandshake,
        title: "7-Day Returns",
        text: "Easy returns & exchanges",
        href: "/faq",
    },
    {
        id: "assistance",
        icon: MessageCircle,
        title: "Expert Assistance",
        text: "Help on WhatsApp or a call",
        href: "/contact-us",
    },
    {
        id: "bulk",
        icon: Boxes,
        title: "Bulk Quotes",
        text: "On every product",
        href: "/bulk-orders-and-gifting",
    },
];
