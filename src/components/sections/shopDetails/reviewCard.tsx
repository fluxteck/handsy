import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Rating from "@/components/ui/rating";
import { ReviewType } from "@/types/reviewType";

const ReviewCard = ({ review }: { review: ReviewType }) => {
  const initial = review.name.trim().charAt(0).toUpperCase();

  return (
    <article className="group/card relative flex flex-col items-center h-full rounded-2xl border border-gray-2 bg-background pt-13 pb-8 px-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl">
      <span className="absolute -top-10 size-20 shrink-0 rounded-full ring-4 ring-background shadow-3xl bg-primary text-white flex items-center justify-center text-2xl font-medium">
        {initial}
      </span>

      <h5 className="text-base text-secondary-foreground font-medium leading-[150%]">{review.name}</h5>
      {review.verifiedPurchase && (
        <span className="inline-flex items-center gap-1 text-primary text-xs font-medium mt-1">
          <BadgeCheck className="size-3.5" />
          Verified Purchase
        </span>
      )}

      <Rating star={review.rating} iconSize="size-4" className="justify-center mt-3" />

      <h6 className="mt-4 text-lg text-secondary-foreground font-medium leading-[140%]">{review.title}</h6>
      <p className="mt-3 text-sm text-gray-1-foreground italic leading-[170%]">&ldquo;{review.comment}&rdquo;</p>

      {review.images && review.images.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-2 mt-5">
          {review.images.slice(0, 3).map((image, index) => (
            <li key={index} className="size-9 rounded-lg overflow-hidden border border-gray-2">
              <Image
                src={image}
                alt={`${review.name}'s photo ${index + 1}`}
                width={36}
                height={36}
                sizes="36px"
                className="w-full h-full object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default ReviewCard;
