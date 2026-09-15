export type CategoryContentType = {
    metaTitle: string;
    metaDescription: string;
    intro: string;
    bulkNote: string;
};

// SEO/AEO content for the /category/[slug] landing pages. Keyed by the same
// slugs as `categorySlugLabels` in menuList.ts.
export const categoryContent: Record<string, CategoryContentType> = {
    "furniture": {
        metaTitle: "Wooden Furniture Online — Sofas, Tables, Beds & More",
        metaDescription: "Shop handcrafted wooden furniture — sofas, dining tables, beds, and storage — from independent Indian artisans. Retail and bulk/wholesale orders, shipped worldwide.",
        intro: "Solid wood furniture for every room, handcrafted by independent artisans rather than mass-produced in a factory. Browse sofas and couches, chairs and recliners, dining and coffee tables, beds, and wardrobe storage — each piece shaped, joined, and finished by hand. Furnishing a single home or sourcing for a hospitality project or retail floor, we support both individual orders and bulk/wholesale purchasing with export shipping available.",
        bulkNote: "Interior designers, retailers, and hospitality buyers can order wooden furniture at wholesale volumes with tiered pricing and custom production. See our wholesale & B2B program for minimum order quantities and lead times.",
    },
    "decor": {
        metaTitle: "Wooden Home Decor — Wall Art, Mirrors, Vases & Rugs",
        metaDescription: "Shop handcrafted home decor — wall art, mirrors, vases and bowls, rugs, and curtains — made by independent Indian artisans, for retail and bulk orders.",
        intro: "Finishing touches for a home, showroom, or hospitality project, handmade rather than factory-printed or molded. Browse wall art and paintings, mirrors, vases and bowls, rugs and carpets, and curtains and blinds — each piece chosen for real craftsmanship, not mass production.",
        bulkNote: "Boutiques, interior designers, and hospitality buyers can order home decor in bulk with custom finishes and tiered wholesale pricing through our B2B program.",
    },
    "lighting": {
        metaTitle: "Wooden Lamps & Lighting — Table, Floor & Wall Lights",
        metaDescription: "Shop handcrafted wooden table lamps, floor lamps, ceiling and wall lights, and chandeliers from independent Indian artisans, for retail and bulk orders.",
        intro: "Warm, handcrafted lighting to complement solid wood furniture and decor. Browse table lamps, floor lamps, ceiling lights, wall lights, and chandeliers, shaped and finished by independent artisan workshops.",
        bulkNote: "Hospitality and retail buyers can order lighting in bulk, with custom finishes and export shipping, through our wholesale & B2B program.",
    },
    "kitchen-dining": {
        metaTitle: "Wooden Kitchen & Dining Furniture — Tables, Storage & More",
        metaDescription: "Shop handcrafted wooden dining tables and chairs, kitchen storage, crockery and cutlery, bar furniture, and kitchen islands, for retail and bulk orders.",
        intro: "Solid wood furniture built for daily use in the kitchen and dining room. Browse dining tables and chairs, kitchen storage, crockery and cutlery, bar furniture, and kitchen islands, handcrafted by independent artisans.",
        bulkNote: "Restaurants, cafés, and hospitality buyers can order kitchen and dining furniture in bulk with custom production through our B2B program.",
    },
    "luxury": {
        metaTitle: "Luxury Wooden Furniture & Statement Decor",
        metaDescription: "Shop premium handcrafted wooden furniture — luxury sofas, designer chairs, statement lighting, and curated decor — for retail and bulk/hospitality orders.",
        intro: "A curated selection of premium handcrafted pieces — luxury sofas, designer chairs, premium bedroom sets, statement lighting, and curated decor — for homes, showrooms, and hospitality projects that call for something beyond standard furniture.",
        bulkNote: "Hospitality and design projects can source luxury wooden furniture at wholesale volumes, with custom production, through our B2B program.",
    },
};
