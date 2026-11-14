import type { PromoCardSlideType } from "./promoCardsData";

/**
 * The homepage bento: one tall banner, two stacked beside it. Same shape as a
 * promo card slide, with `subtitle` rendered as the small eyebrow above the
 * title.
 *
 * Artwork is the catalogue's own lifestyle photography (square, 1254px), so
 * each banner shows a product the link actually leads to. `imagePosition`
 * picks the focal point when a square photo is cropped to a wide tile.
 */
export type PromoBentoCardType = PromoCardSlideType & {
    imagePosition?: string;
};

const PRODUCT_MEDIA = "https://kferltyiqptruiingvpk.supabase.co/storage/v1/object/public/media/products";

export const promoBentoData: PromoBentoCardType[] = [
    {
        id: 1,
        image: `${PRODUCT_MEDIA}/1790221287291-cd6l4xuzxr.webp`,
        subtitle: "Lighting",
        title: "Light That Sets the Mood",
        buttonText: "Shop Lighting",
        buttonLink: "/collections/lighting",
        imagePosition: "50% 30%",
    },
    {
        id: 2,
        image: `${PRODUCT_MEDIA}/1790338054471-cu8c3i2mxm.webp`,
        subtitle: "Kitchen & Dining",
        title: "Hand-Carved Acacia for Your Table",
        buttonText: "Shop Kitchen & Dining",
        buttonLink: "/collections/kitchen-dining",
        imagePosition: "50% 60%",
    },
    {
        id: 3,
        image: `${PRODUCT_MEDIA}/1790412418368-en3jb7b3o0.png`,
        subtitle: "Furniture",
        title: "Statement Pieces, Made to Last",
        buttonText: "Shop Furniture",
        buttonLink: "/collections/furniture",
        imagePosition: "50% 55%",
    },
];
