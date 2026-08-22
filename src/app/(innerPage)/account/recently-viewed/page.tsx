import { Metadata } from "next";
import RecentlyViewedContent from "./recentlyViewedContent";

export const metadata: Metadata = {
    title: "Recently Viewed",
    description: "Products you've recently looked at.",
};

const RecentlyViewedPage = () => {
    return <RecentlyViewedContent />;
};

export default RecentlyViewedPage;
