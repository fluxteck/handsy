import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import Rating from "@/components/ui/rating";
import { getCustomerReviewsData } from "@/lib/data";
import { Star } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Reviews & Ratings",
    description: "Reviews you've written for products you've purchased.",
};

const ReviewsPage = async () => {
    const reviews = await getCustomerReviewsData();

    return (
        <Panel>
            <PanelHeading title="Reviews & Ratings" description="Reviews you've written for past purchases." />
            {reviews.length ? (
                <div className="flex flex-col divide-y divide-border">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                            <Link href="/product-details" className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-home-bg-1">
                                <Image src={review.thumbnail} alt={review.productTitle} fill sizes="64px" className="object-contain p-1" />
                            </Link>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Link
                                        href="/product-details"
                                        className="font-medium text-secondary-foreground transition-all duration-300 hover:text-gray-1-foreground"
                                    >
                                        {review.productTitle}
                                    </Link>
                                    <p className="text-xs text-gray-3-foreground">
                                        {new Date(review.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <Rating star={review.rating} className="mt-1.5" iconSize="size-4" />
                                <p className="mt-2 text-sm text-gray-1-foreground">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Star}
                    title="No reviews yet"
                    description="Reviews you write for your purchases will appear here."
                />
            )}
        </Panel>
    );
};

export default ReviewsPage;
