export type CategoryType = {
    "id": number | string,
    "categoryImg": string,
    "categoryName": string,
    "value"?: string,
    /** Explicit destination, for tiles that aren't a plain category filter
     *  (e.g. "Bestsellers", which is a sort order). Defaults to the category
     *  page for `value`. */
    "href"?: string,
}

export const categoriesOneData: CategoryType[] = [
    {
        "id": 1,
        "categoryImg": "/images/home-1/category/img-1.webp",
        "categoryName": "bed room"
    },
    {
        "id": 2,
        "categoryImg": "/images/home-1/category/img-2.webp",
        "categoryName": "living room"
    },
    {
        "id": 3,
        "categoryImg": "/images/home-1/category/img-3.webp",
        "categoryName": "office"
    },
    {
        "id": 4,
        "categoryImg": "/images/home-1/category/img-4.webp",
        "categoryName": "accessories"
    },
    {
        "id": 5,
        "categoryImg": "/images/home-1/category/img-5.webp",
        "categoryName": "Kitchen Accessories"
    },
    {
        "id": 6,
        "categoryImg": "/images/home-1/category/img-3.webp",
        "categoryName": "office"
    },
]
