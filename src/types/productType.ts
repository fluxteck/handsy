export type ProductType = {
    "id": number | string,
    /** URL slug for the product-detail route. Present on catalog-backed
     *  products; absent on the static sample data, which links to the
     *  non-dynamic /product-details page instead. */
    "slug"?: string,
    /**
     * Default purchasable variant — what a card's add-to-cart uses, since the
     * server's cart keys line items by variant, never by product. The cheapest
     * variant, matching the `price` shown. Absent on the static sample data,
     * which has no variants and therefore cannot be added to a real cart.
     */
    "variantId"?: string,
    "title": string,
    "description": string,
    "price": number,
    "currency": string,
    "discountPercentage": number,
    "rating": number,
    "totalRating": string,
    "stock": number,
    "brand": string,
    "label": string,
    "category": string,
    "thumbnail": string,
    "colors": {
        "code": string,
        "image": string
    }[],
    "filter": string,
    "images": string[],
    "cardSize"?: string,
    "isSlider"?: boolean,
    "adsInfo"?: {
        "id": number | string,
        "discountPercentage": number,
        "banner": string,
    }[],
    "size"?:[""]
}
