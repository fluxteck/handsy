export interface testimonialType {
    id: number;
    name: string;
    image: string;
    rating: number;
    title: string;
    review: string;
}

export const testimonialData: testimonialType[] = [
    {
        id: 1,
        name: "Velvet Armchair",
        image: "/images/home-1/featured-products/img-1.webp",
        rating: 5,
        title: "Quality You Can Trust",
        review: `"Everything I've ordered from Handsy Market has matched the photos and felt well made. It's become the first place I look when I want something for my home."`,
    },
    {
        id: 2,
        name: "Handwoven Jute Rug",
        image: "/images/home-1/featured-products/img-2.webp",
        rating: 5,
        title: "So Much to Choose From",
        review: `"The range is what keeps me coming back. Furniture, lighting, decor and dining pieces all in one place, so I can furnish a whole room without hopping between sites."`,
    },
    {
        id: 3,
        name: "Ceramic Vase Set",
        image: "/images/home-1/featured-products/img-3.webp",
        rating: 5,
        title: "Easy to Shop",
        review: `"The site is simple to browse and checkout was quick. I found what I wanted in a few minutes and knew exactly what I was paying before I ordered."`,
    },
    {
        id: 4,
        name: "Lavender & Sage Candle",
        image: "/images/home-1/featured-products/img-4.webp",
        rating: 5,
        title: "Sellers Worth Discovering",
        review: `"I like that the pieces come from real artisans and independent sellers. You find things here that you simply don't see in the usual stores."`,
    },
    {
        id: 5,
        name: "Oak Wood Dining Table",
        image: "/images/home-1/featured-products/img-5.webp",
        rating: 4,
        title: "Helpful Support",
        review: `"I had a question about my order and the team replied clearly and politely. It was sorted without any back and forth, which I really appreciated."`,
    },
    {
        id: 6,
        name: "Linen Throw Pillow",
        image: "/images/home-1/featured-products/img-6.webp",
        rating: 5,
        title: "Packed with Care",
        review: `"My order arrived wrapped carefully and in perfect condition. You can tell that thought goes into how each piece is packed before it leaves."`,
    },
    {
        id: 7,
        name: "Brass Table Lamp",
        image: "/images/home-1/featured-products/img-7.webp",
        rating: 5,
        title: "Reliable Delivery",
        review: `"I was kept informed from the moment I ordered until it reached my door. No surprises and no chasing, just a smooth delivery."`,
    },
    {
        id: 8,
        name: "Woven Storage Basket",
        image: "/images/home-1/featured-products/img-8.webp",
        rating: 4,
        title: "A Marketplace I Trust",
        review: `"From browsing to unboxing, the whole experience felt dependable. I'm happy to recommend Handsy Market to friends and family."`,
    },
];
