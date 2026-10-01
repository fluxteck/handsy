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

/**
 * One mega-menu item. `slug` is the catalogue's own category slug, so the link
 * lands on a filtered `/category/<slug>` page; items the catalogue has no
 * category for yet omit it and fall back to their parent category's page.
 */
type MegaMenuItem = string | { label: string; slug: string };

/** One mega-menu column: an optional heading over a list of links. */
type MegaMenuColumn = {
    title?: string;
    items: MegaMenuItem[];
}

const buildMegaMenu = (categoryPath: string, columns: MegaMenuColumn[]): MegamenuType[] => [
    {
        "id": 1,
        "menus": columns.map((column, columnIndex) => ({
            "id": columnIndex,
            ...(column.title ? { "title": column.title } : {}),
            "items": column.items.map((item, index) => ({
                "id": index + 1,
                "label": typeof item === "string" ? item : item.label,
                "path": typeof item === "string" ? categoryPath : `/category/${encodeURIComponent(item.slug)}`,
            })),
        }))
    }
]

export const menuList: menuType[] = [
    {
        "id": 1,
        "label": "Furniture",
        "path": "/category/furniture",
        "megaMenu": buildMegaMenu("/category/furniture", [
            {
                title: "Seating",
                items: [
                    { label: "Sofas", slug: "sofas" },
                    { label: "Chairs", slug: "chairs" },
                    { label: "Benches", slug: "benches" },
                    { label: "Stools", slug: "stools" },
                    "Ottomans & Poufs",
                ],
            },
            {
                title: "Tables",
                items: [
                    { label: "Coffee Tables", slug: "coffee-tables" },
                    "Dining Tables",
                    { label: "Side Tables", slug: "side-tables" },
                    { label: "Console Tables", slug: "consoles" },
                    "Study Tables & Desks",
                ],
            },
            {
                title: "More Furniture",
                items: [
                    { label: "Beds", slug: "beds" },
                    "Cabinets",
                    "Shelves",
                    "Outdoor Furniture",
                ],
            },
        ])
    },
    {
        "id": 2,
        "label": "Lighting",
        "path": "/category/lighting",
        "megaMenu": buildMegaMenu("/category/lighting", [
            {
                title: "Lamps",
                items: [
                    { label: "Table Lamps", slug: "table-lamps" },
                    { label: "Floor Lamps", slug: "floor-lamps" },
                    "Portable & Cordless",
                ],
            },
            {
                title: "Ceiling & Hanging",
                items: [
                    { label: "Pendant Lights", slug: "pendant-lights" },
                    { label: "Chandeliers", slug: "chandeliers" },
                    { label: "Ceiling Lights", slug: "ceiling-lights" },
                ],
            },
            {
                title: "Wall",
                items: [{ label: "Wall Lights", slug: "wall-lights" }],
            },
        ])
    },
    {
        "id": 3,
        "label": "Decor",
        "path": "/category/decor",
        "megaMenu": buildMegaMenu("/category/decor", [
            {
                items: [
                    { label: "Vases", slug: "vases" },
                    { label: "Mirrors", slug: "mirrors" },
                    { label: "Clocks", slug: "clocks" },
                    { label: "Wall Art", slug: "wall-decor" },
                    { label: "Sculptures & Figurines", slug: "sculptures" },
                    { label: "Candles & Holders", slug: "candle-holders" },
                    // The catalogue's slug for this category carries a trailing space.
                    { label: "Planters & Pots", slug: "planters " },
                    "Tabletop",
                ],
            },
        ])
    },
    {
        "id": 4,
        "label": "Kitchen & Dining",
        "path": "/category/kitchen-dining",
        "megaMenu": buildMegaMenu("/category/kitchen-dining", [
            {
                items: [
                    "Plates",
                    { label: "Bowls", slug: "bowls" },
                    { label: "Platters & Trays", slug: "platters-trays" },
                    { label: "Cups & Mugs", slug: "cups-mugs" },
                    { label: "Glasses", slug: "glasses" },
                    "Cutlery",
                    "Dinner Table Setting",
                ],
            },
        ])
    },
    {
        "id": 6,
        "label": "B2B",
        "path": "/b2b",
    },
]

// Single source of truth for the `/category/[slug]` landing pages,
// so page titles always match the nav labels above.
export const categorySlugLabels: Record<string, string> = Object.fromEntries(
    menuList.map(({ label, path }) => [path.replace("/category/", ""), label])
)
