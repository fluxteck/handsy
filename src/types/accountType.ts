export type CustomerType = {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    verified: boolean;
    memberSince: string;
};

export type OrderStatus = "processing" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";

export type OrderItemType = {
    productId: number | string;
    title: string;
    thumbnail: string;
    price: number;
    quantity: number;
    color?: string;
};

export type OrderTrackingStepType = {
    label: string;
    date: string;
    completed: boolean;
};

export type OrderType = {
    /** Stable identifier used for routing and `orders.get`. */
    id: string;
    /** Human-facing reference shown to the customer (e.g. "#1042"). Optional
     *  so the static sample data, which only has a display id, still fits. */
    number?: string;
    placedOn: string;
    status: OrderStatus;
    total: number;
    paymentMethod: string;
    shippingAddress: string;
    items: OrderItemType[];
    tracking: OrderTrackingStepType[];
    deliveryEstimate?: string;
};

export type AddressType = {
    id: string;
    label: string;
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
};

export type PaymentMethodType = {
    id: string;
    type: "card" | "upi" | "netbanking";
    brand?: string;
    last4?: string;
    expiry?: string;
    upiId?: string;
    bankName?: string;
    isDefault?: boolean;
};

export type NotificationCategory = "order" | "offer" | "account" | "wishlist";

export type NotificationType = {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
    category: NotificationCategory;
};

export type CouponType = {
    id: string;
    code: string;
    title: string;
    description: string;
    discount: string;
    expiry: string;
    minOrder?: string;
};

export type ReturnStatus = "requested" | "approved" | "picked-up" | "refunded" | "rejected";

export type ReturnRequestType = {
    id: string;
    orderId: string;
    productTitle: string;
    thumbnail: string;
    reason: string;
    status: ReturnStatus;
    requestedOn: string;
    refundAmount: number;
};

export type CustomerReviewType = {
    id: string;
    productId: number | string;
    productTitle: string;
    thumbnail: string;
    rating: number;
    comment: string;
    date: string;
    /** Product slug, so the row can link to the product. */
    slug?: string;
    /** Moderation state — `pending` means it isn't public yet. */
    status?: "pending" | "published" | "rejected";
};

export type RecentlyViewedType = {
    productId: number | string;
    viewedOn: string;
};
