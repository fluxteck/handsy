import { PaymentMethodType } from "@/types/accountType";

export const paymentMethodsData: PaymentMethodType[] = [
    {
        id: "pm_1",
        type: "card",
        brand: "Visa",
        last4: "4821",
        expiry: "09/28",
        isDefault: true,
    },
    {
        id: "pm_2",
        type: "card",
        brand: "Mastercard",
        last4: "1190",
        expiry: "02/27",
        isDefault: false,
    },
    {
        id: "pm_3",
        type: "upi",
        upiId: "ayesha@okhdfc",
        isDefault: false,
    },
];
