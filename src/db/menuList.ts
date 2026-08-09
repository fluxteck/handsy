export type MegamenuType = {
    "id": string | number;
    "menus": {
        "id": string | number;
        "title"?: string;
        "items": {
            "id": string | number;
            "label": string;
            "path": string;
            "img"?: string;
        }[]

    }[]
}

export type menuType = {
    "id": string | number;
    "label": string;
    "path": string;
    "dropdownList"?: {
        "id": string | number;
        "label": string;
        "path": string;
    }[];
    "megaMenu"?: MegamenuType[]
}

const buildCategoryMegaMenu = (categoryPath: string, subCategories: string[]): MegamenuType[] => [
    {
        "id": 1,
        "menus": [
            {
                "id": 0,
                "title": "Shop by Category",
                "items": subCategories.map((label, index) => ({
                    "id": index + 1,
                    "label": label,
                    "path": categoryPath,
                }))
            }
        ]
    }
]

export const menuList: menuType[] = [
    {
        "id": 1,
        "label": "Furniture",
        "path": "/category/furniture",
        "megaMenu": buildCategoryMegaMenu("/category/furniture", [
            "Sofas & Couches",
            "Chairs & Recliners",
            "Tables",
            "Beds & Bed Frames",
            "Wardrobes & Storage",
            "Outdoor Furniture",
        ])
    },
    {
        "id": 2,
        "label": "Mattresses",
        "path": "/category/mattresses",
        "megaMenu": buildCategoryMegaMenu("/category/mattresses", [
            "Memory Foam Mattresses",
            "Spring Mattresses",
            "Hybrid Mattresses",
            "Mattress Toppers",
            "Kids Mattresses",
        ])
    },
    {
        "id": 3,
        "label": "Home Decor",
        "path": "/category/home-decor",
        "megaMenu": buildCategoryMegaMenu("/category/home-decor", [
            "Wall Art & Paintings",
            "Mirrors",
            "Vases & Bowls",
            "Rugs & Carpets",
            "Curtains & Blinds",
        ])
    },
    {
        "id": 4,
        "label": "Lamps & Lighting",
        "path": "/category/lamps-lighting",
        "megaMenu": buildCategoryMegaMenu("/category/lamps-lighting", [
            "Table Lamps",
            "Floor Lamps",
            "Ceiling Lights",
            "Wall Lights",
            "Chandeliers",
        ])
    },
    {
        "id": 5,
        "label": "Kitchen & Dining",
        "path": "/category/kitchen-dining",
        "megaMenu": buildCategoryMegaMenu("/category/kitchen-dining", [
            "Dining Tables & Chairs",
            "Kitchen Storage",
            "Crockery & Cutlery",
            "Bar Furniture",
            "Kitchen Islands",
        ])
    },
    {
        "id": 6,
        "label": "Luxury",
        "path": "/category/luxury",
        "megaMenu": buildCategoryMegaMenu("/category/luxury", [
            "Luxury Sofas",
            "Designer Chairs",
            "Premium Bedroom Sets",
            "Statement Lighting",
            "Curated Decor",
        ])
    },
    {
        "id": 7,
        "label": "Modular",
        "path": "/category/modular",
        "megaMenu": buildCategoryMegaMenu("/category/modular", [
            "Modular Sofas",
            "Modular Kitchens",
            "Modular Wardrobes",
            "Modular Shelving",
            "Modular Bedroom Sets",
        ])
    },
    {
        "id": 8,
        "label": "B2B",
        "path": "/b2b",
    },
]

// Single source of truth for the `/category/[slug]` landing pages,
// so page titles always match the nav labels above.
export const categorySlugLabels: Record<string, string> = Object.fromEntries(
    menuList.map(({ label, path }) => [path.replace("/category/", ""), label])
)
