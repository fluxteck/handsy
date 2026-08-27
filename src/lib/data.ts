import { cache } from "react";
import { menuList } from "@/db/menuList";
import { faqData } from "@/db/faqData";
import { galleryDataOne } from "@/db/galleryData";
import { partnerData } from "@/db/partnerData";
import { brandsData } from "@/db/brandsData";
import { privacyPolicyData } from "@/db/privacyPolicyData";
import { termsAndConditionsData } from "@/db/termsAndConditionsData";
import { testimonialData } from "@/db/testimonialsData";
import { heroData } from "@/db/heroData";
import { promoCardsData } from "@/db/promoCardsData";
import { shopTheLookData } from "@/db/shopTheLookData";
import { paymentMethodsData } from "@/db/paymentMethodsData";
import { notificationsData } from "@/db/notificationsData";
import { couponsData } from "@/db/couponsData";
import { returnsData } from "@/db/returnsData";
import { productReviewsData } from "@/db/productReviewsData";

/**
 * Editorial and presentational content that has no catalogue behind it —
 * marketing copy, legal text, the FAQ, the gallery.
 *
 * Anything with a real backing store (products, categories, brands, reviews,
 * orders, addresses) goes through `lib/sdk/*` instead. This module must never
 * grow a product read.
 *
 * These previously fetched from `https://furnisy.vercel.app` — the template
 * author's demo deployment — whenever `NODE_ENV === "production"`. That made a
 * third party a hard, uncached, request-time dependency of the homepage and
 * both legal pages: if it went down those pages threw, and whoever controlled
 * it controlled Handsy's published privacy policy. The content is committed to
 * this repository, so it is served from here and reviewed like any other code.
 *
 * `react.cache` dedupes within a single render pass. No function here does I/O,
 * so none can fail; they stay `async` because the components awaiting them are
 * server components and the shape is part of their contract.
 */

export const getHeroData = cache(async () => heroData);

export const getPromoCardsData = cache(async () => promoCardsData);

export const getMenuData = cache(async () => menuList);

export const getFaqData = cache(async () => faqData);

export const getGalleryData = cache(async () => galleryDataOne);

export const getPartnerData = cache(async () => partnerData);

export const getBrandsData = cache(async () => brandsData);

export const getPrivacyPolicyData = cache(async () => privacyPolicyData);

export const getTermsAndConditionsData = cache(async () => termsAndConditionsData);

export const getShopTheLookData = cache(async () => shopTheLookData);

export const getPaymentMethodsData = cache(async () => paymentMethodsData);

export const getNotificationsData = cache(async () => notificationsData);

export const getCouponsData = cache(async () => couponsData);

export const getReturnsData = cache(async () => returnsData);

export const getTestimonialsData = cache(async () => testimonialData);

export const getProductReviewsData = cache(async (productId: number | string) =>
  productReviewsData.filter((review) => String(review.productId) === String(productId)),
);
