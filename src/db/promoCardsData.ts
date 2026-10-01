export type PromoCardSlideType = {
    id: number;
    image: string;
    /** Artwork for the stacked (below lg) card; falls back to `image`. */
    mobileImage?: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
};

export type PromoCardGroupType = {
    id: number;
    slides: PromoCardSlideType[];
};

const BANNER_BASE = "https://kferltyiqptruiingvpk.supabase.co/storage/v1/object/public/media/Website";

export const promoCardsData: PromoCardGroupType[] = [
    {
        id: 1,
        slides: [
            {
                id: 1,
                image: `${BANNER_BASE}/B4d.webp`,
                mobileImage: `${BANNER_BASE}/B4m.webp`,
                title: "Business gets the VIP treatment — exclusive perks for trade partners",
                subtitle: "Interior designers, architects, and builders.",
                buttonText: "Explore Trade Benefits",
                buttonLink: "/b2b",
            },
        ],
    },
    {
        id: 2,
        slides: [
            {
                id: 1,
                image: `${BANNER_BASE}/B5d.webp`,
                mobileImage: `${BANNER_BASE}/B5m.webp`,
                title: "Buying in bulk? Décor, lighting and furniture in volume",
                subtitle: "Get a quote for bulk orders and gifting.",
                buttonText: "Get a Quote",
                buttonLink: "/bulk-orders-and-gifting",
            },
        ],
    },
];
