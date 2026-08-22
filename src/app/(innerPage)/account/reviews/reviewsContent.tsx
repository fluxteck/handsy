"use client";

import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import Rating from "@/components/ui/rating";
import { useMyReviews } from "@/lib/account/use-account";
import { productPath } from "@/lib/productPath";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ReviewsContent = () => {
    // Owner-scoped read, so it needs the customer's JWT — which only exists in
    // the browser. Same reason orders and addresses are fetched here.
    const { data: reviews, loading, error } = useMyReviews();

    return (
        <Panel>
            <PanelHeading title="Reviews & Ratings" description="Reviews you've written for past purchases." />
            {reviews.length ? (
                <div className="flex flex-col divide-y divide-border">
                    {reviews.map((review) => {
                        const href = productPath({ slug: review.slug });
                        return (
                            <div key={review.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                                <Link href={href} className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-home-bg-1">
                                    <Image src={review.thumbnail} alt={review.productTitle} fill sizes="64px" className="object-contain p-1" />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <Link
                                            href={href}
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
                        );
                    })}
                </div>
            ) : (
                /* "No reviews yet" is only true once the fetch has finished and
                   succeeded — saying it while loading, or after a failure, tells
                   the customer something false about their account. */
                <EmptyState
                    icon={Star}
                    title={loading ? "Loading your reviews…" : error ? "Couldn't load your reviews" : "No reviews yet"}
                    description={
                        loading
                            ? "One moment."
                            : error
                              ? "Please refresh to try again."
                              : "Reviews you write for your purchases will appear here."
                    }
                />
            )}
        </Panel>
    );
};

export default ReviewsContent;
