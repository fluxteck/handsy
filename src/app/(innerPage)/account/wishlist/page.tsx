import { Metadata } from "next";
import { Panel } from "@/components/sections/account/panel";
import { getCategoryLinks } from "@/lib/categoryLinks";
import WishlistProductsGrid from "../../wishlist/wishlistProductsGrid";

export const metadata: Metadata = {
    title: "Wishlist",
    description: "View your wishlist.",
};

// The same grid the standalone /wishlist page renders, shown inside the
// account shell so the sidebar and breadcrumb stay in place.
const AccountWishlistPage = async () => {
    // Suggested categories for the empty state, from the catalogue.
    const categoryLinks = await getCategoryLinks();

    return (
        <Panel>
            <WishlistProductsGrid categories={categoryLinks} embedded />
        </Panel>
    );
};

export default AccountWishlistPage;
