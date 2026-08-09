import { CouponType } from "@/types/accountType";

export const couponsData: CouponType[] = [
    {
        id: "cpn_1",
        code: "HANDCRAFT20",
        title: "20% off wooden decor",
        description: "Applicable on all handcrafted wooden home decor items.",
        discount: "20% OFF",
        expiry: "2026-08-31",
        minOrder: "$99",
    },
    {
        id: "cpn_2",
        code: "WELCOME150",
        title: "Flat $15 off",
        description: "Valid on your next order, any category.",
        discount: "$15 OFF",
        expiry: "2026-09-15",
        minOrder: "$60",
    },
    {
        id: "cpn_3",
        code: "FREESHIP",
        title: "Free shipping",
        description: "Free standard shipping on orders above $50.",
        discount: "FREE SHIPPING",
        expiry: "2026-12-31",
        minOrder: "$50",
    },
];
