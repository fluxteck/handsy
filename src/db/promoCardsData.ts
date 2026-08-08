export type PromoCardSlideType = {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
};

export type PromoCardGroupType = {
    id: number;
    slides: PromoCardSlideType[];
};

export const promoCardsData: PromoCardGroupType[] = [
    {
        id: 1,
        slides: [
            {
                id: 1,
                image: "/images/home-1/gallery/img-1.webp",
                title: "Curated Selection Designer Lamps",
                subtitle: "Statement lighting picked to bring warmth into every room.",
                buttonText: "Shop Now",
                buttonLink: "/shop?category=lamps-lighting",
            },
        ],
    },
    {
        id: 2,
        slides: [
            {
                id: 1,
                image: "/images/home-1/gallery/img-3.webp",
                title: "Elegant Decor Accessories",
                subtitle: "Timeless pieces that elevate every corner of your home.",
                buttonText: "Shop Now",
                buttonLink: "/shop?category=home-decor",
            },
        ],
    },
];
