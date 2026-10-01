import Newsletter from "@/components/sections/newsletter";
import PageHeader from "@/components/sections/pageHeader";
import RecentlyViewed from "@/components/sections/recentlyViewed";
import { Metadata } from "next";
import WishlistProductsGrid from "./wishlistProductsGrid";
import { getCategoryLinks } from "@/lib/categoryLinks";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your wishlist.",
};

const Wishlist = async () => {
  // Suggested categories for the empty state, from the catalogue.
  const categoryLinks = await getCategoryLinks();

  return (
    <main>
      <PageHeader
        currentPage="Wishlist"
        pageTitle="Wishlist"
        breadcrumbLink="/shop"
        breadcrumbLabel="Shop"
      />
      <WishlistProductsGrid categories={categoryLinks} />
      <RecentlyViewed />
      <Newsletter />
    </main>
  );
};

export default Wishlist;
