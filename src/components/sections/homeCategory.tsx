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

const CategoryCard = ({
    categoryName,
    categoryImg,
    imageSizes,
    imageClassName,
}: {
    categoryName: string;
    categoryImg: string;
    imageSizes: string;
    imageClassName: string;
}) => (
    <div className="group flex flex-col items-center text-center">
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
            className="mt-4 font-medium lg:text-lg text-base text-gray-1-foreground capitalize hover:text-secondary-foreground transition-all duration-500"
        >
            {categoryName}
        </Link>
    </div>
);

const HomeCategory = ({ categories }: { categories: CategoryType[] }) => {
    return (
        <div className="pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5">
            <div className="container">
                <Title>Shop by Category</Title>
                <p className="text-gray-1-foreground leading-[150%] font-light mt-1">Discover everything you need through the categories!</p>

                {/* Tablet & desktop: full grid, every category visible at once */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6 lg:gap-y-8 lg:mt-11 mt-8">
                    {categories.map(({ categoryName, id, categoryImg }) => (
                        <CategoryCard
                            key={id}
                            categoryName={categoryName}
                            categoryImg={categoryImg}
                            imageSizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            imageClassName="size-28 lg:size-36"
                        />
                    ))}
                </div>
            </div>

            {/* Mobile only: swipeable carousel with nav arrows + pagination dots */}
            <div className="sm:hidden container relative lg:mt-11 mt-8">
                <Swiper
                    spaceBetween={12}
                    slidesPerView={1.8}
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
                                imageSizes="50vw"
                                imageClassName="size-28"
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

                <div className="category-pagination flex justify-center items-center gap-2 mt-6" />
            </div>
        </div>
    );
};

export default HomeCategory;
