import { ShopTheLookData } from "@/types/shopTheLookType";

export const shopTheLookData: ShopTheLookData = {
  eyebrow: "Shop The Look",
  title: "The considered living room.",
  ctaLabel: "Add The Room",
  rooms: [
    {
      id: "living-room",
      tabLabel: "Living Room",
      roomLabel: "Living Room",
      images: [
        {
          src: "/images/home-1/hero/img-1.webp",
          alt: "Bright living room with two white sectional sofas around a glass coffee table",
        },
      ],
      hotspots: [
        { id: 1, x: 22, y: 60, productIndex: 0 },
        { id: 2, x: 74, y: 54, productIndex: 1 },
        { id: 3, x: 49, y: 84, productIndex: 2 },
      ],
      products: [
        {
          id: "sofa-modular-sectional",
          title: "Modular Sectional Sofa",
          price: 68000,
          thumbnail: "/images/home-1/featured-products/img-1.webp",
        },
        {
          id: "sofa-accent",
          title: "Accent Sofa",
          price: 52000,
          thumbnail: "/images/home-1/featured-products/img-2.webp",
        },
        {
          id: "table-glass-coffee",
          title: "Glass Coffee Table",
          price: 24500,
          thumbnail: "/images/home-1/featured-products/img-3.webp",
        },
      ],
    },
    {
      id: "lounge",
      tabLabel: "Lounge",
      roomLabel: "Lounge Corner",
      images: [
        {
          src: "/images/home-1/hero/img-2.webp",
          alt: "Lounge corner with a tufted armchair beside a walnut console table",
        },
      ],
      hotspots: [
        { id: 1, x: 17, y: 62, productIndex: 0 },
        { id: 2, x: 53, y: 32, productIndex: 1 },
        { id: 3, x: 62, y: 53, productIndex: 2 },
        { id: 4, x: 82, y: 58, productIndex: 3 },
      ],
      products: [
        {
          id: "chair-tufted-lounge",
          title: "Tufted Lounge Chair",
          price: 38500,
          thumbnail: "/images/home-1/featured-products/img-4.webp",
        },
        {
          id: "lamp-arc-table",
          title: "Arc Table Lamp",
          price: 12800,
          thumbnail: "/images/home-1/featured-products/img-5.webp",
        },
        {
          id: "vase-ceramic",
          title: "Ceramic Vase",
          price: 4200,
          thumbnail: "/images/home-1/featured-products/img-6.webp",
        },
        {
          id: "table-walnut-console",
          title: "Walnut Console Table",
          price: 45600,
          thumbnail: "/images/home-1/featured-products/img-7.webp",
        },
      ],
    },
    {
      id: "decor-corner",
      tabLabel: "Decor Corner",
      roomLabel: "Decor Corner",
      images: [
        {
          src: "/images/about/img-1.webp",
          alt: "Decor corner with an oak sideboard, pendant lamp and potted plants",
        },
      ],
      hotspots: [
        { id: 1, x: 23, y: 26, productIndex: 0 },
        { id: 2, x: 22, y: 68, productIndex: 1 },
        { id: 3, x: 58, y: 58, productIndex: 2 },
      ],
      products: [
        {
          id: "lamp-wooden-pendant",
          title: "Wooden Pendant Lamp",
          price: 9600,
          thumbnail: "/images/home-1/top-collections/img-1.webp",
        },
        {
          id: "stand-potted-plant",
          title: "Potted Plant Stand",
          price: 5400,
          thumbnail: "/images/home-1/top-collections/img-2.webp",
        },
        {
          id: "sideboard-oak",
          title: "Oak Sideboard",
          price: 58000,
          thumbnail: "/images/home-1/top-collections/img-3.webp",
        },
      ],
    },
  ],
};
