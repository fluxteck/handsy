import InstagramGallery from "@/components/sections/instagramGallery";
import Newsletter from "@/components/sections/newsletter";
import PageHeader from "@/components/sections/pageHeader";
import RecentlyViewed from "@/components/sections/recentlyViewed";
import RelatedProducts from "@/components/sections/shopDetails/relatedProducts";
import { Metadata } from "next";
import WishlistProductsTable from "./wishlistProductsTable";
import { getTopRatedProducts } from "@/lib/sdk";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your wishlist.",
};

const Wishlist = async () => {
  /* Suggestions come from the catalogue — the mock fallback would put sample
     products next to a real cart. */
  const suggestions = await getTopRatedProducts(4);
  return (
    <main>
      <PageHeader
        currentPage="Wishlist"
        pageTitle="Wishlist"
        breadcrumbLink="/shop-2"
        breadcrumbLabel="Shop"
      />
      <WishlistProductsTable />
      <RecentlyViewed />
      <RelatedProducts products={suggestions} />
      <Newsletter />
      <InstagramGallery />
    </main>
  );
};

export default Wishlist;
