import { cache } from "react";
import { menuList } from "@/db/menuList";
import { faqData } from "@/db/faqData";
import { partnerData } from "@/db/partnerData";
import { brandsData } from "@/db/brandsData";
import { privacyPolicyData } from "@/db/privacyPolicyData";
import { termsAndConditionsData } from "@/db/termsAndConditionsData";
import { testimonialData } from "@/db/testimonialsData";
import { heroData } from "@/db/heroData";
import { promoCardsData } from "@/db/promoCardsData";
import { shopTheLookData } from "@/db/shopTheLookData";
import { productReviewsData } from "@/db/productReviewsData";
import type {
  CouponType,
  NotificationType,
  PaymentMethodType,
  ReturnRequestType,
} from "@/types/accountType";

/**
 * Editorial and presentational content that has no catalogue behind it —
 * marketing copy, legal text, the FAQ.
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

export const getPartnerData = cache(async () => partnerData);

export const getBrandsData = cache(async () => brandsData);

export const getPrivacyPolicyData = cache(async () => privacyPolicyData);

export const getTermsAndConditionsData = cache(async () => termsAndConditionsData);

export const getShopTheLookData = cache(async () => shopTheLookData);

/**
 * Saved payment methods, coupons and return requests for the account pages.
 *
 * Empty for the same reason as notifications below: these rendered template
 * fixtures — someone else's cards, coupon codes that were never issued, returns
 * against orders that do not exist — identically for every signed-in customer.
 * Each page renders whatever its function returns and shows its empty state
 * when that is nothing, so these three are the places to wire the real reads.
 */
export const getPaymentMethodsData = cache(async (): Promise<PaymentMethodType[]> => []);

/**
 * Customer notifications.
 *
 * Empty until there is something real to show. The page and its unread badge
 * were rendering template fixtures — invented order numbers, a sale that never
 * ran — identically for every signed-in customer, and the badge pulled them
 * into it. A feed that says nothing is better than one that says something
 * untrue about their order.
 *
 * Nothing in the database backs this yet: there is no notifications table, and
 * the server's `notifications` module sends transactional email rather than
 * feeding an in-app list. When that arrives, this is the one place to wire it
 * — the page already renders whatever it returns, and shows its empty state
 * when that is nothing.
 */
export const getNotificationsData = cache(async (): Promise<NotificationType[]> => []);

export const getCouponsData = cache(async (): Promise<CouponType[]> => []);

export const getReturnsData = cache(async (): Promise<ReturnRequestType[]> => []);

export const getTestimonialsData = cache(async () => testimonialData);

export const getProductReviewsData = cache(async (productId: number | string) =>
  productReviewsData.filter((review) => String(review.productId) === String(productId)),
);
