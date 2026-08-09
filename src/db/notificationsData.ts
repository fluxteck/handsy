import { NotificationType } from "@/types/accountType";

export const notificationsData: NotificationType[] = [
    {
        id: "ntf_1",
        title: "Order out for delivery",
        message: "Your order ORD-98341 is out for delivery and will arrive by Aug 11.",
        date: "2026-08-09",
        read: false,
        category: "order",
    },
    {
        id: "ntf_2",
        title: "Festive sale is live",
        message: "Get flat 20% off on handcrafted wooden decor this week only.",
        date: "2026-08-07",
        read: false,
        category: "offer",
    },
    {
        id: "ntf_3",
        title: "Order delivered",
        message: "ORD-98107 was delivered successfully. We'd love your feedback.",
        date: "2026-07-28",
        read: true,
        category: "order",
    },
    {
        id: "ntf_4",
        title: "Profile verified",
        message: "Your account email has been verified successfully.",
        date: "2026-07-15",
        read: true,
        category: "account",
    },
    {
        id: "ntf_5",
        title: "Item back in stock",
        message: "Wooden Table Lamp from your wishlist is back in stock.",
        date: "2026-07-10",
        read: true,
        category: "wishlist",
    },
];
