'use client'
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Title from "@/components/ui/title";
import Link from "next/link";
import { ProductType } from "@/types/productType";
import ProductCarousel from "./productCarousel";

const FeaturedProducts = ({ featuredProducts }: { featuredProducts: ProductType[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [slidesOffset, setSlidesOffset] = useState(0);
    let filterList: string[] = ["Best Sellers", "New arrivals", "featured"];

    useEffect(() => {
        function updateOffset() {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setSlidesOffset(rect.left + 15);
            }
        }
        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, []);

    return (
        <section className="bg-home-bg-1 pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5 group/section">
            <Tabs defaultValue={filterList[0] || ''} className="relative">
                <div className="container" ref={containerRef}>
                    <Title>Featured Products</Title>
                    <p className="text-gray-1-foreground mt-3 leading-[166.667%]">
                        Explore the best of Handsy Market Featured Collection.
                    </p>
                    <div className="mt-10">
                        <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center mb-5">
                            <TabsList className="w-full flex-nowrap justify-between gap-2 md:w-auto md:flex-wrap md:justify-start md:gap-5 lg:gap-7.5">
                                {filterList.map((item, index) => (
                                    <TabsTrigger
                                        key={index}
                                        value={item}
                                        className="data-[state=active]:text-secondary-foreground border-b border-b-transparent data-[state=active]:border-b-primary text-gray-1-foreground hover:text-secondary-foreground py-2 md:py-0 lg:text-xl transition-all duration-500"
                                    >
                                        {item}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <Link
                                href={"/shop-2"}
                                className="text-gray-1-foreground lg:text-xl text-lg border-b border-b-primary mt-2.5 md:mt-0 inline-block hover:border-b-primary hover:text-secondary-foreground duration-500"
                            >
                                View All
                            </Link>
                        </div>
                    </div>
                </div>

                {filterList.map((filter, index) => {
                    const filteredData = featuredProducts.filter((prd) => prd.filter === filter);
                    return (
                        <TabsContent key={index} value={filter}>
                            <ProductCarousel data={filteredData} slidesOffset={slidesOffset} />
                        </TabsContent>
                    );
                })}
            </Tabs>
        </section>
    );
};

export default FeaturedProducts;
