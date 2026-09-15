'use client';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Title from "@/components/ui/title";
import { ArrowLeft, ArrowRight } from "@/lib/icon";
import { CategoryType } from "@/db/categoriesData";
import { cn } from "@/lib/utils";

const CategoryCard = ({
    categoryName,
    categoryImg,
    imageSizes,
    imageClassName,
    compact = false,
}: {
    categoryName: string;
    categoryImg: string;
    imageSizes: string;
    imageClassName: string;
    /** Smaller label treatment to match a compact card. Same ring/hover/link
     *  behavior either way — only size changes. */
    compact?: boolean;
}) => (
    <div className={cn("group flex flex-col items-center text-center", compact && "sm:w-16 md:w-24 lg:w-[92px]")}>
        <Link
            href={`/category?name=${categoryName}`}
            aria-label={categoryName}
            className="block overflow-hidden rounded-full ring-1 ring-border transition-all duration-500 group-hover:ring-primary group-hover:shadow-3xl"
        >
            <Image
                width={200}
                height={200}
                sizes={imageSizes}
                src={categoryImg}
                alt={categoryName}
                className={`object-cover rounded-full transition-transform duration-500 group-hover:scale-110 ${imageClassName}`}
            />
        </Link>
        <Link
            href={`/category?name=${categoryName}`}
            className={cn(
                "font-medium text-gray-1-foreground capitalize hover:text-secondary-foreground transition-all duration-500",
                compact ? "mt-2 text-xs sm:text-sm" : "mt-4 lg:text-lg text-base"
            )}
        >
            {categoryName}
        </Link>
    </div>
);

const HomeCategory = ({
    categories,
    showHeading = true,
    compact = false,
}: {
    categories: CategoryType[];
    /** Hides the "Shop by Category" title and subtitle — for surfaces that
     *  just need the category strip itself. Defaults to showing them. */
    showHeading?: boolean;
    /** Smaller, denser cards (8 per row on desktop) — for surfaces where the
     *  category strip is a secondary element rather than the page's focus.
     *  Defaults to the original, larger card size. */
    compact?: boolean;
}) => {
    return (
        <div className={cn("pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5", compact && "pt-3 pb-0 md:pt-3.5 lg:pt-4")}>
            <div className="container">
                {showHeading && (
                    <>
                        <Title>Shop by Category</Title>
                        <p className="text-gray-1-foreground leading-[150%] font-light mt-1">Discover everything you need through the categories!</p>
                    </>
                )}

                {/* Tablet & desktop: full row, every category visible at once.
                    Compact mode uses flex-wrap with a fixed card width (rather
                    than a fixed column grid) so a row that doesn't fill every
                    slot — the common case — centers itself instead of hugging
                    the left edge. */}
                <div
                    className={cn(
                        "hidden sm:grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 lg:gap-y-8 mt-8 lg:mt-11",
                        compact ? "sm:flex sm:flex-wrap sm:justify-center gap-y-4 mt-0" : "lg:grid-cols-6"
                    )}
                >
                    {categories.map(({ categoryName, id, categoryImg }) => (
                        <CategoryCard
                            key={id}
                            categoryName={categoryName}
                            categoryImg={categoryImg}
                            imageSizes={
                                compact
                                    ? "(max-width: 768px) 20vw, (max-width: 1024px) 14vw, 9vw"
                                    : "(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            }
                            imageClassName={compact ? "size-12 sm:size-14 md:size-16 lg:size-16" : "size-28 lg:size-36"}
                            compact={compact}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile only: swipeable carousel with nav arrows + pagination dots */}
            <div className={cn("sm:hidden container relative", compact ? "mt-3" : "mt-8 lg:mt-11")}>
                <Swiper
                    spaceBetween={compact ? 8 : 12}
                    slidesPerView={compact ? 4.5 : 1.8}
                    grabCursor
                    navigation={{ nextEl: ".category-next", prevEl: ".category-prev" }}
                    pagination={{
                        el: ".category-pagination",
                        clickable: true,
                        bulletClass: "category-pagination-bullet",
                        bulletActiveClass: "category-pagination-bullet-active",
                    }}
                    modules={[Navigation, Pagination]}
                    className="!px-10"
                >
                    {categories.map(({ categoryName, id, categoryImg }) => (
                        <SwiperSlide key={id}>
                            <CategoryCard
                                categoryName={categoryName}
                                categoryImg={categoryImg}
                                imageSizes={compact ? "20vw" : "50vw"}
                                imageClassName={compact ? "size-12" : "size-28"}
                                compact={compact}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    aria-label="Previous category"
                    className="category-prev absolute top-[38%] -translate-y-1/2 left-0 z-10 w-9 h-9 rounded-full bg-background text-gray-1-foreground shadow-3xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500"
                >
                    <ArrowLeft className="size-4" />
                </button>
                <button
                    aria-label="Next category"
                    className="category-next absolute top-[38%] -translate-y-1/2 right-0 z-10 w-9 h-9 rounded-full bg-background text-gray-1-foreground shadow-3xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500"
                >
                    <ArrowRight className="size-4" />
                </button>

                <div className={cn("category-pagination flex justify-center items-center gap-2", compact ? "mt-3" : "mt-6")} />
            </div>
        </div>
    );
};

export default HomeCategory;
