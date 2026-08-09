import { cache } from "react";
import { adsData } from "@/db/adsData";
import { menuList } from "@/db/menuList";
import { categoriesOneData } from "@/db/categoriesData";
import { blogData } from "@/db/blogData";
import { faqData } from "@/db/faqData";
import { galleryDataOne } from "@/db/galleryData";
import { partnerData } from "@/db/partnerData";
import { brandsData } from "@/db/brandsData";
import { privacyPolicyData } from "@/db/privacyPolicyData";
import { termsAndConditionsData } from "@/db/termsAndConditionsData";
import { testimonialData } from "@/db/testimonialsData";
import { heroData } from "@/db/heroData";
import { promoCardsData } from "@/db/promoCardsData";
import { products } from "@/db/products";
import { shopTheLookData } from "@/db/shopTheLookData";
import { customerData } from "@/db/customerData";
import { ordersData } from "@/db/ordersData";
import { addressesData } from "@/db/addressesData";
import { paymentMethodsData } from "@/db/paymentMethodsData";
import { notificationsData } from "@/db/notificationsData";
import { couponsData } from "@/db/couponsData";
import { returnsData } from "@/db/returnsData";
import { customerReviewsData } from "@/db/customerReviewsData";
import { recentlyViewedData } from "@/db/recentlyViewedData";
import { productReviewsData } from "@/db/productReviewsData";

const baseUrl = 'https://furnisy.vercel.app';

export const getHeroData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/hero-content`);
            if (!res.ok) throw new Error('Failed to fetch hero data');
            return res.json();
        }
        return heroData;
    } catch (error) {
        throw new Error('Error in getHeroData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getPromoCardsData = cache(async () => {
    // Note: unlike the sibling fetchers above, this doesn't call `${baseUrl}/api/promo-cards` in
    // production yet. Those routes work because they were deployed in an earlier release, so
    // baseUrl (the live site) already serves them. /api/promo-cards is new in this release, so the
    // build would be fetching a route that doesn't exist on the live site until *after* this
    // deploy succeeds. Once this is live, switch this back to match the pattern above.
    return promoCardsData;
});

export const getAdsData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/ads`);
            if (!res.ok) throw new Error('Failed to fetch ads data');
            return res.json();
        }
        return adsData;
    } catch (error) {
        throw new Error('Error in getAdsData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getProductsData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/products`);
            if (!res.ok) throw new Error('Failed to fetch featured products');
            return res.json();
        }
        return products;
    } catch (error) {
        throw new Error('Error in getFeaturedData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getMenuData = cache(async () => {
    // Note: doesn't fetch `${baseUrl}/api/menu` like the sibling fetchers below. That fetch
    // targets the live production URL, which during a Vercel build is still the *previous*
    // deployment (the new one isn't live yet). Since Header is statically generated at build
    // time with no revalidation, that bakes in stale, one-deploy-behind menu data on every
    // release. Returning the local data keeps the deployed nav in sync with the committed code.
    return menuList;
});

export const getCategoriesData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/categories`);
            if (!res.ok) throw new Error('Failed to fetch categories data');
            return res.json();
        }
        return categoriesOneData;
    } catch (error) {
        throw new Error('Error in getCategoriesData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getBlogData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/blogs`);
            if (!res.ok) throw new Error('Failed to fetch blog data');
            return res.json();
        }
        return blogData;
    } catch (error) {
        throw new Error('Error in getBlogData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getFaqData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/faq`);
            if (!res.ok) throw new Error('Failed to fetch FAQ data');
            return res.json();
        }
        return faqData;
    } catch (error) {
        throw new Error('Error in getFaqData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getGalleryData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/gallery`);
            if (!res.ok) throw new Error('Failed to fetch gallery data');
            return res.json();
        }
        return galleryDataOne;
    } catch (error) {
        throw new Error('Error in getGalleryData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getPartnerData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/partners`);
            if (!res.ok) throw new Error('Failed to fetch partner data');
            return res.json();
        }
        return partnerData;
    } catch (error) {
        throw new Error('Error in getPartnerData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getBrandsData = cache(async () => {
    // Note: unlike the sibling fetchers above, this doesn't call `${baseUrl}/api/brands` in
    // production yet. Those routes work because they were deployed in an earlier release, so
    // baseUrl (the live site) already serves them. /api/brands is new in this release, so the
    // build would be fetching a route that doesn't exist on the live site until *after* this
    // deploy succeeds. Once this is live, switch this back to match the pattern above.
    return brandsData;
});

export const getPrivacyPolicyData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/privacy-policy`);
            if (!res.ok) throw new Error('Failed to fetch privacy policy data');
            return res.json();
        }
        return privacyPolicyData;
    } catch (error) {
        throw new Error('Error in getPrivacyPolicyData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getTermsAndConditionsData = cache(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const res = await fetch(`${baseUrl}/api/terms-and-conditions`);
            if (!res.ok) throw new Error('Failed to fetch terms and conditions data');
            return res.json();
        }
        return termsAndConditionsData;
    } catch (error) {
        throw new Error('Error in getTermsAndConditionsData: ' + (error instanceof Error ? error.message : String(error)));
    }
});

export const getShopTheLookData = cache(async () => {
    // Same reasoning as getBrandsData/getPromoCardsData above: no /api/shop-the-look route
    // exists on the live site yet, so this always serves the local data instead of fetching.
    return shopTheLookData;
});

// Note: like getBrandsData/getPromoCardsData/getShopTheLookData above, these don't fetch
// `${baseUrl}/api/...` in production yet — those routes are new in this release and don't exist
// on the live site until after this deploy succeeds. Once live, switch these to the fetch pattern.
// TODO: once real auth/session exists, source getCustomerData from the logged-in session instead
// of static mock data.
export const getCustomerData = cache(async () => {
    return customerData;
});

export const getOrdersData = cache(async () => {
    return ordersData;
});

export const getAddressesData = cache(async () => {
    return addressesData;
});

export const getPaymentMethodsData = cache(async () => {
    return paymentMethodsData;
});

export const getNotificationsData = cache(async () => {
    return notificationsData;
});

export const getCouponsData = cache(async () => {
    return couponsData;
});

export const getReturnsData = cache(async () => {
    return returnsData;
});

export const getCustomerReviewsData = cache(async () => {
    return customerReviewsData;
});

export const getRecentlyViewedData = cache(async () => {
    return recentlyViewedData;
});

export const getProductReviewsData = cache(async (productId: number | string) => {
    // Note: unlike the sibling fetchers above, this doesn't call `${baseUrl}/api/products/[id]/reviews`
    // in production yet. That route is new in this release, so it isn't served by baseUrl (the live
    // site) until this deploy goes live. Once it is, switch this back to match the pattern above.
    return productReviewsData.filter((review) => String(review.productId) === String(productId));
});

export const getTestimonialsData = cache(async () => {
    // Note: unlike the sibling fetchers above, this doesn't call `${baseUrl}/api/testimonials` in
    // production yet. Those routes work because they were deployed in an earlier release, so
    // baseUrl (the live site) already serves them in the matching shape. The testimonial data
    // shape (name/image/rating/title/review) is new in this release, so until this deploy is
    // live, baseUrl would still serve the old shape (userName/userImage/position/review) and
    // bake mismatched data into the static build. Once this is live, switch this back to match
    // the pattern above.
    return testimonialData;
});