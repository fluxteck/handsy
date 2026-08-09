import Rating from "@/components/ui/rating";
import { ReviewType } from "@/types/reviewType";

const ReviewsSummary = ({ reviews }: { reviews: ReviewType[] }) => {
  const totalReviews = reviews.length;
  const average = totalReviews
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => Math.round(review.rating) === star).length;
    return { star, count, percentage: totalReviews ? Math.round((count / totalReviews) * 100) : 0 };
  });

  return (
    <div>
      <div className="flex items-center gap-4">
        <p className="text-secondary-foreground text-4xl lg:text-5xl font-semibold">
          {average ? average.toFixed(1) : "0.0"}
        </p>
        <div>
          <Rating star={average} iconSize="size-4" />
          <p className="text-gray-1-foreground text-sm mt-1">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2 mt-6">
        {breakdown.map(({ star, count, percentage }) => (
          <li key={star} className="flex items-center gap-3">
            <span className="text-gray-1-foreground text-sm w-10 shrink-0">{star} star</span>
            <span className="flex-1 h-1.5 rounded-full bg-gray-2 overflow-hidden">
              <span
                className="block h-full rounded-full bg-[#FFA34E]"
                style={{ width: `${percentage}%` }}
              />
            </span>
            <span className="text-gray-1-foreground text-sm w-8 shrink-0 text-right">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsSummary;
