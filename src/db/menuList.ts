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

/** One mega-menu column: an optional bold heading over a list of links. */
type MegaMenuColumn = {
    title?: string;
    items: string[];
}

const buildMegaMenu = (categoryPath: string, columns: MegaMenuColumn[]): MegamenuType[] => [
    {
        "id": 1,
        "menus": columns.map((column, columnIndex) => ({
            "id": columnIndex,
            ...(column.title ? { "title": column.title } : {}),
            "items": column.items.map((label, index) => ({
                "id": index + 1,
                "label": label,
                "path": categoryPath,
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
                items: ["Sofa", "Chair", "Stools", "Console", "Beds", "Outdoor Furniture", "Shelves", "Cabinet"],
            },
            {
                title: "Tables",
                items: ["Coffee Tables / Center Table", "Side Table", "Study Table"],
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
                items: ["Table Lamp", "Floor Lamp", "Desk Lamp", "Reading Lamp", "Wall Lamp"],
            },
            {
                title: "Hanging Lights",
                items: ["Chandelier", "Ceiling Lights", "Pendant"],
            },
            {
                items: ["Outdoor Lights"],
            },
        ])
    },
    {
        "id": 3,
        "label": "Decor",
        "path": "/category/decor",
        "megaMenu": buildMegaMenu("/category/decor", [
            {
                items: ["Arts", "Vases", "Mirrors", "Tabletop Decor", "Wall Hanging", "Objects & Sculptures"],
            },
            {
                items: ["Candles", "Clocks", "Rugs & Carpets", "Cushions", "Decor Accessories"],
            },
        ])
    },
    {
        "id": 4,
        "label": "Kitchen & Dining",
        "path": "/category/kitchen-dining",
        "megaMenu": buildMegaMenu("/category/kitchen-dining", [
            {
                items: ["Cutlery", "Dinnerware", "Serveware", "Jugs & Glasses", "Bowls", "Drinkware"],
            },
        ])
    },
    {
        "id": 5,
        "label": "Luxury",
        "path": "/category/luxury",
        "megaMenu": buildMegaMenu("/category/luxury", [
            {
                items: ["Lights", "Furniture"],
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
