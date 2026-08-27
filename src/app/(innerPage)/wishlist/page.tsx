import InstagramGallery from "@/components/sections/instagramGallery";
import Newsletter from "@/components/sections/newsletter";
import PageHeader from "@/components/sections/pageHeader";
import RecentlyViewed from "@/components/sections/recentlyViewed";
import RelatedProducts from "@/components/sections/shopDetails/relatedProducts";
import { Metadata } from "next";
import WishlistProductsTable from "./wishlistProductsTable";
import { getTopRatedProducts } from "@/lib/sdk";
import { getCategoryLinks } from "@/lib/categoryLinks";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your wishlist.",
};

const Wishlist = async () => {
  // Suggested categories for the empty state, from the catalogue.
  const categoryLinks = await getCategoryLinks();

  /* Suggestions come from the catalogue — the mock fallback would put sample
     products next to a real cart. */
  const suggestions = await getTopRatedProducts(4);
  return (
    <main>
      <PageHeader
        currentPage="Wishlist"
        pageTitle="Wishlist"
        breadcrumbLink="/shop"
        breadcrumbLabel="Shop"
      />
      <WishlistProductsTable categories={categoryLinks} />
      <RecentlyViewed />
      <RelatedProducts products={suggestions} />
      <Newsletter />
      <InstagramGallery />
    </main>
  );
};

export default Wishlist;
