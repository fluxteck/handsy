export type ReviewType = {
    id: string;
    productId: number | string;
    name: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
    verifiedPurchase: boolean;
    images?: string[];
};
