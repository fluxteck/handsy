import ReviewsSummary from "@/components/sections/shopDetails/reviewsSummary";
import ReviewsList from "@/components/sections/shopDetails/reviewsList";
import WriteReviewModal from "@/components/sections/shopDetails/writeReviewModal";
import { getProductReviewsData } from "@/lib/data";
import { cn } from "@/lib/utils";

const ProductReviews = async ({
  productId,
  productName,
  className,
}: {
  productId: number | string;
  productName?: string;
  className?: string;
}) => {
  const reviews = await getProductReviewsData(productId);

  return (
    <section className={cn("lg:mt-25 mt-15", className)}>
      <div className="container">
        <div className="grid lg:grid-cols-[340px_1fr] gap-y-7.5 gap-x-10 xl:gap-x-15">
          <div className="border border-gray-2 rounded-2xl bg-background p-6 lg:p-7.5 flex flex-col">
            <b className="text-heading text-secondary-foreground font-semibold block">Customer Reviews</b>
            <p className="text-gray-1-foreground text-sm mt-1">See what our customers are saying</p>

            <div className="mt-6">
              <ReviewsSummary reviews={reviews} />
            </div>

            <WriteReviewModal productId={productId} productName={productName} className="mt-7.5 lg:mt-auto w-full" />
          </div>

          <div className="min-w-0 border border-gray-2 rounded-2xl bg-background p-6 lg:p-7.5">
            <ReviewsList reviews={reviews} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
