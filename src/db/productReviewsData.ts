import { ReviewType } from "@/types/reviewType";

export const productReviewsData: ReviewType[] = [
    {
        id: "prev_1",
        productId: 1,
        name: "Jannie Schumm",
        rating: 5,
        title: "Exceeded every expectation",
        comment:
            "The craftsmanship is outstanding — the wood grain finish is stunning in person and it feels far more premium than the price suggests. Assembly was quick and the fit and finish is flawless.",
        date: "2026-07-18",
        verifiedPurchase: true,
        images: ["/images/product-details/img-2.webp", "/images/product-details/img-3.webp"],
    },
    {
        id: "prev_2",
        productId: 1,
        name: "Marcus Reyes",
        rating: 4,
        title: "Great value, minor delivery delay",
        comment:
            "Sturdy build and looks even better than the photos. Only reason it's not five stars is delivery took a couple of extra days, but support was responsive throughout.",
        date: "2026-06-30",
        verifiedPurchase: true,
    },
    {
        id: "prev_3",
        productId: 1,
        name: "Priya Nair",
        rating: 5,
        title: "Perfect centerpiece for our living room",
        comment:
            "Comfortable, well padded, and the color matched our decor perfectly. Already ordered a second one for the guest room.",
        date: "2026-06-05",
        verifiedPurchase: false,
    },
    {
        id: "prev_4",
        productId: 2,
        name: "Elena Brooks",
        rating: 4,
        title: "Comfortable and sturdy",
        comment:
            "Really happy with this piece — solid construction and comfortable cushioning. Took a bit of time to assemble but instructions were clear.",
        date: "2026-07-02",
        verifiedPurchase: true,
    },
];
