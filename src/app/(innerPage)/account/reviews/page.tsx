import { Metadata } from "next";
import ReviewsContent from "./reviewsContent";

export const metadata: Metadata = {
    title: "Reviews & Ratings",
    description: "Reviews you've written for products you've purchased.",
};

const ReviewsPage = () => {
    return <ReviewsContent />;
};

export default ReviewsPage;
