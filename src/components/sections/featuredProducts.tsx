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
    const filterList: string[] = ["Best Sellers", "New arrivals"];

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
                    <Title className="text-center">Curated collections</Title>
                    <div className="mt-10">
                        {/* Mobile: one row — tabs then "View All", evenly spaced, scrolling
                            sideways rather than wrapping when it can't fit. */}
                        <div className="scrollbar-hidden flex items-center gap-6 overflow-x-auto md:gap-0 md:overflow-visible md:justify-between mb-5">
                            <TabsList className="shrink-0 flex-nowrap justify-start gap-6 md:flex-wrap md:gap-5 lg:gap-7.5">
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
                                href={"/shop"}
                                className="text-gray-1-foreground lg:text-xl text-lg border-b border-b-primary shrink-0 whitespace-nowrap py-2 md:py-0 inline-block hover:border-b-primary hover:text-secondary-foreground duration-500"
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
