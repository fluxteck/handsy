export type HeroDataType = {
    id: number | string,
    title: string,
    description: string,
    thumbnail: string,
    /** Portrait artwork for phones; falls back to `thumbnail` when absent. */
    mobileThumbnail?: string,
}

const BANNER_BASE = "https://kferltyiqptruiingvpk.supabase.co/storage/v1/object/public/media/Website";

export const heroData: HeroDataType[] = [
    {
        "id": 1,
        "title": "Handcrafted Wooden Furniture, Made to Last",
        "description": "Solid wood furniture and home decor crafted by independent Indian artisans — shop single pieces or order in bulk for your business.",
        "thumbnail": `${BANNER_BASE}/B1d.webp`,
        "mobileThumbnail": `${BANNER_BASE}/B1m.webp`,
    },
    {
        "id": 2,
        "title": "Home Decor With Real Craftsmanship",
        "description": "From dining tables to wall art, every piece is shaped and finished by hand — not mass-produced.",
        "thumbnail": `${BANNER_BASE}/B2d.webp`,
        "mobileThumbnail": `${BANNER_BASE}/B2m.webp`,
    },
    {
        "id": 3,
        "title": "Wholesale Wooden Furniture, Shipped Worldwide",
        "description": "Retailers, hospitality buyers, and designers source handcrafted wood furniture from us in bulk, with export shipping to 30+ countries.",
        "thumbnail": `${BANNER_BASE}/B3d.webp`,
        "mobileThumbnail": `${BANNER_BASE}/B3m.webp`,
    },
]