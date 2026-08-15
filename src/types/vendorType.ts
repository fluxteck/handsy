import { ProductType } from "./productType";

export type VendorHighlightType = {
  title: string;
  description: string;
};

export type VendorSocialLinks = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
};

export type VendorType = {
  id: number | string;
  /** Slug used in the public storefront route: /vendor/[vendorName] */
  slug: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  aboutImage: string;
  location: string;
  rating: number;
  totalReviews: string;
  sellingSince: number;
  isVerified: boolean;
  responseTime: string;
  description: string;
  highlights: VendorHighlightType[];
  social: VendorSocialLinks;
  /** Powers the storefront's category filter pills. */
  categories: string[];
};

/** A product as sold on a vendor storefront — a normal ProductType tagged with its vendor. */
export type VendorProductType = ProductType & {
  vendorSlug: string;
};
