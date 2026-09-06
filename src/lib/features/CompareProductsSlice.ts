import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export type CompareType = {
    id: string | number,
    /** Purchasable variant, so "add to cart" from the compare table can reach
     *  the server's cart — which keys lines by variant, not product. Optional
     *  because the static sample data has no variants. */
    variantId?: string,
    /** Currency of `price`, so the compare table doesn't assume dollars. */
    currency?: string,
    price: number,
    discountPercentage: number,
    /** What the customer actually pays, when it is known exactly. */
    sellingPrice?: number,
    thumbnail: string,
    title: string,
    stock: number,
    /* ── Attributes worth comparing ──────────────────────────────────────────
       A snapshot taken when the product was added, not a live read: the table
       has to work from localStorage on a cold load, before anything has been
       fetched. The trade is that a price changed since adding shows the old
       one — acceptable for a shortlist the shopper built minutes ago, and the
       Add to cart button always prices server-side anyway. */
    /** Links each column back to the product page. */
    slug?: string,
    rating?: number,
    totalRating?: string,
    brand?: string,
    category?: string,
    /** Colour names/codes offered, for the "available in" row. */
    colors?: string[],
    sizes?: string[],
}

/**
 * How many products may be compared at once.
 *
 * Four, following the usability research: beyond three or four columns a
 * comparison stops being scannable and becomes a spreadsheet, and on a phone
 * even four is a stretch. Adding a fifth replaces nothing silently — it is
 * refused with a reason.
 */
export const MAX_COMPARE = 4;

// Function to load products from local storage
const loadFromLocalStorage = (): CompareType[] => {
    try {
        if (typeof window === "undefined" || !window.localStorage) {
            console.warn("localStorage is not available");
            return [];
        }

        const serializedState = localStorage.getItem("compareProducts");
        if (serializedState === null) {
            return [];
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Could not load from local storage", err);
        return [];
    }
};

// Function to save products to local storage
const saveToLocalStorage = (products: CompareType[]) => {
    try {
        const serializedState = JSON.stringify(products);
        localStorage.setItem("compareProducts", serializedState);
    } catch (err) {
        console.error("Could not save to local storage", err);
    }
};

const initialState = {
    products: loadFromLocalStorage(),
};

const CompareProductsSlice = createSlice({
    name: "productCompare",
    initialState,
    reducers: {
        addToCompare: (state, action: PayloadAction<CompareType>) => {
            const itemInCart = state.products.find((item) => item.id === action?.payload.id);
            if (itemInCart) {
                toast.success('Already in your comparison');
                return;
            } else if (state.products.length >= MAX_COMPARE) {
                toast.error(`Compare up to ${MAX_COMPARE} products — remove one first`);
                return;
            } else {
                toast.success('Added to compare');
                state.products.push({
                    ...action.payload,
                });
                saveToLocalStorage(state.products); // Save to local storage
            }
        },
        removeToCompare: (state, action) => {
            const itemsInCart = state.products.filter((item) => item.id !== action.payload);
            state.products = itemsInCart;
            saveToLocalStorage(state.products); // Save to local storage
        }
    }
});

export const { addToCompare, removeToCompare } = CompareProductsSlice.actions;

export default CompareProductsSlice.reducer;