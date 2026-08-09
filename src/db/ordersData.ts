import { OrderType } from "@/types/accountType";

const p = (n: number) => `/images/home-1/featured-products/img-${n}.webp`;

export const ordersData: OrderType[] = [
    {
        id: "ORD-98341",
        placedOn: "2026-08-02",
        status: "out-for-delivery",
        total: 249,
        paymentMethod: "Visa •••• 4821",
        shippingAddress: "204, Palm Residency, Bandra West, Mumbai, MH 400050",
        deliveryEstimate: "Arriving Aug 11",
        items: [
            { productId: 7, title: "Wooden Table lamp", thumbnail: p(7), price: 89, quantity: 1 },
            { productId: 1, title: "Modern dark wood chair", thumbnail: p(1), price: 160, quantity: 1 },
        ],
        tracking: [
            { label: "Order placed", date: "Aug 2", completed: true },
            { label: "Packed", date: "Aug 3", completed: true },
            { label: "Shipped", date: "Aug 5", completed: true },
            { label: "Out for delivery", date: "Aug 9", completed: true },
            { label: "Delivered", date: "Expected Aug 11", completed: false },
        ],
    },
    {
        id: "ORD-98107",
        placedOn: "2026-07-21",
        status: "delivered",
        total: 512,
        paymentMethod: "UPI • ayesha@okhdfc",
        shippingAddress: "204, Palm Residency, Bandra West, Mumbai, MH 400050",
        items: [
            { productId: 4, title: "Ergonomic Cabinet", thumbnail: p(4), price: 512, quantity: 1 },
        ],
        tracking: [
            { label: "Order placed", date: "Jul 21", completed: true },
            { label: "Packed", date: "Jul 22", completed: true },
            { label: "Shipped", date: "Jul 24", completed: true },
            { label: "Delivered", date: "Jul 28", completed: true },
        ],
    },
    {
        id: "ORD-97960",
        placedOn: "2026-07-05",
        status: "delivered",
        total: 138,
        paymentMethod: "Mastercard •••• 1190",
        shippingAddress: "204, Palm Residency, Bandra West, Mumbai, MH 400050",
        items: [
            { productId: 8, title: "Cherie Chair", thumbnail: p(8), price: 138, quantity: 1 },
        ],
        tracking: [
            { label: "Order placed", date: "Jul 5", completed: true },
            { label: "Packed", date: "Jul 6", completed: true },
            { label: "Shipped", date: "Jul 7", completed: true },
            { label: "Delivered", date: "Jul 10", completed: true },
        ],
    },
    {
        id: "ORD-97711",
        placedOn: "2026-06-18",
        status: "cancelled",
        total: 300,
        paymentMethod: "Visa •••• 4821",
        shippingAddress: "204, Palm Residency, Bandra West, Mumbai, MH 400050",
        items: [
            { productId: 3, title: "Modern Tolik Chair", thumbnail: p(3), price: 300, quantity: 1 },
        ],
        tracking: [
            { label: "Order placed", date: "Jun 18", completed: true },
            { label: "Cancelled", date: "Jun 19", completed: true },
        ],
    },
    {
        id: "ORD-97402",
        placedOn: "2026-05-30",
        status: "delivered",
        total: 180,
        paymentMethod: "UPI • ayesha@okhdfc",
        shippingAddress: "204, Palm Residency, Bandra West, Mumbai, MH 400050",
        items: [
            { productId: 2, title: "Modular sofa with wood", thumbnail: p(2), price: 180, quantity: 1 },
        ],
        tracking: [
            { label: "Order placed", date: "May 30", completed: true },
            { label: "Packed", date: "May 31", completed: true },
            { label: "Shipped", date: "Jun 1", completed: true },
            { label: "Delivered", date: "Jun 4", completed: true },
        ],
    },
];
