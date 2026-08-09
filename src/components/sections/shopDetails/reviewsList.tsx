"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "@/lib/icon";
import ReviewCard from "@/components/sections/shopDetails/reviewCard";
import { ReviewType } from "@/types/reviewType";

const ReviewsList = ({ reviews }: { reviews: ReviewType[] }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-secondary-foreground font-medium">No reviews yet</p>
        <p className="text-gray-1-foreground text-sm mt-1">Be the first to share what you think of this product.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-2.5 mb-6">
        <button
          type="button"
          aria-label="Previous review"
          className="review-prev-el size-11 shrink-0 rounded-full bg-background border border-gray-2 flex items-center justify-center text-gray-1-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-500"
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next review"
          className="review-next-el size-11 shrink-0 rounded-full bg-primary text-white flex items-center justify-center hover:bg-transparent hover:text-secondary-foreground hover:border hover:border-primary transition-all duration-500"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      <Swiper
        grabCursor
        loop={reviews.length > 2}
        speed={600}
        navigation={{ nextEl: ".review-next-el", prevEl: ".review-prev-el" }}
        pagination={{
          el: ".review-pagination",
          clickable: true,
          bulletClass: "testimonial-pagination-bullet",
          bulletActiveClass: "testimonial-pagination-bullet-active",
        }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1.05 },
          640: { slidesPerView: 1.4 },
          1024: { slidesPerView: 1.8 },
        }}
        modules={[Navigation, Pagination]}
        className="!pt-10 !pb-2"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="!h-auto">
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="review-pagination flex justify-center items-center gap-2 mt-8" />
    </div>
  );
};

export default ReviewsList;
