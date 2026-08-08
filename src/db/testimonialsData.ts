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
        title: "Cozy & Chic",
        review: `"The velvet texture is incredibly soft and the color is exactly as shown. It adds a touch of luxury to my living room. Very happy with this purchase."`,
    },
    {
        id: 2,
        name: "Handwoven Jute Rug",
        image: "/images/home-1/featured-products/img-2.webp",
        rating: 5,
        title: "Natural Texture",
        review: `"This rug is beautifully crafted and ties the whole room together. The natural fibers have a great feel underfoot. Highly recommended for a bohemian style."`,
    },
    {
        id: 3,
        name: "Ceramic Vase Set",
        image: "/images/home-1/featured-products/img-3.webp",
        rating: 5,
        title: "Minimalist Art",
        review: `"These vases are simple yet elegant. They look great even without flowers, just as art pieces on my shelf. The quality is excellent."`,
    },
    {
        id: 4,
        name: "Lavender & Sage Candle",
        image: "/images/home-1/featured-products/img-4.webp",
        rating: 5,
        title: "Relaxing Aroma",
        review: `"The scent is amazing, not too overpowering, very calming. The glass jars are a lovely touch and look great on my coffee table. A wonderful product."`,
    },
    {
        id: 5,
        name: "Oak Wood Dining Table",
        image: "/images/home-1/featured-products/img-5.webp",
        rating: 4,
        title: "Sturdy & Elegant",
        review: `"Solid craftsmanship and the finish is gorgeous. Assembly was straightforward and it seats our whole family comfortably. Worth every penny."`,
    },
    {
        id: 6,
        name: "Linen Throw Pillow",
        image: "/images/home-1/featured-products/img-6.webp",
        rating: 5,
        title: "Soft & Stylish",
        review: `"These pillows instantly upgraded my sofa. The fabric feels premium and the color options matched my decor perfectly."`,
    },
    {
        id: 7,
        name: "Brass Table Lamp",
        image: "/images/home-1/featured-products/img-7.webp",
        rating: 5,
        title: "Warm Ambience",
        review: `"Beautiful lamp that gives the perfect warm glow in the evenings. Feels sturdy and well made, definitely a statement piece."`,
    },
    {
        id: 8,
        name: "Woven Storage Basket",
        image: "/images/home-1/featured-products/img-8.webp",
        rating: 4,
        title: "Functional Decor",
        review: `"Great size and beautifully handwoven. Keeps our living room organized while still looking like a design piece."`,
    },
];
