'use client'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from '@/lib/icon'
import Card, { CardDiscount, CardFooter, CardHeader, CardIcons, CardImg, CardLabel, CardTitle, CardPriceEnhanced } from '@/components/ui/card'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as TypeSwiper } from 'swiper'
import 'swiper/css';
import { ProductType } from '@/types/productType'

// Shared product-card carousel used by every home section that slides through products
// (Top Collections, Featured Products' Best Sellers/New Arrivals/Featured tabs). Nav buttons
// are wired via refs assigned in onBeforeInit — Swiper's documented pattern for per-instance
// nav elements — rather than the `.next-el`/`.prev-el` class selectors this started out with,
// so multiple carousel instances can safely coexist on the same page without one instance's
// buttons driving another instance's swiper.
const ProductCarousel = ({ data, slidesOffset }: { data: ProductType[]; slidesOffset: number }) => {
    const nextElRef = useRef<HTMLDivElement>(null)
    const prevElRef = useRef<HTMLDivElement>(null)

    return (
        <div className='relative'>
            <Swiper
                navigation={{ prevEl: prevElRef.current, nextEl: nextElRef.current }}
                onBeforeInit={(swiper: TypeSwiper) => {
                    if (typeof swiper.params.navigation === 'object') {
                        swiper.params.navigation.prevEl = prevElRef.current
                        swiper.params.navigation.nextEl = nextElRef.current
                    }
                }}
                grabCursor
                spaceBetween={20}
                slidesOffsetBefore={slidesOffset}
                breakpoints={{
                    320: {
                        slidesPerView: 1.5,
                    },
                    640: {
                        slidesPerView: 2.5,
                    },
                    768: {
                        slidesPerView: 3.5,
                    },
                    1024: {
                        slidesPerView: 4.5,
                    },
                    1280: {
                        slidesPerView: 5.3472,
                    },
                    1536: {
                        slidesPerView: 5.3472,
                    },
                }}

                modules={[Navigation]}

            >
                {data.map((prd) => {
                    return (
                        <SwiperSlide key={prd.id}>
                            <Card key={prd.id}>
                                <CardHeader>
                                    <CardImg src={prd.thumbnail} height={400} width={340} path="/product-details" />
                                    <CardLabel isLabel={prd.label ? prd.label : false}>{prd.label}</CardLabel>
                                    <CardDiscount isDiscountTrue={prd.discountPercentage ? prd.discountPercentage : false}>-{prd.discountPercentage}%</CardDiscount>
                                    <CardIcons product={prd} />
                                </CardHeader>
                                <CardFooter>
                                    <CardTitle path="/product-details">{prd.title}</CardTitle>
                                    <CardPriceEnhanced price={prd.price} discountPercentage={prd.discountPercentage} />
                                </CardFooter>
                            </Card>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className='w-full lg:invisible lg:opacity-0 lg:group-hover/section:visible lg:group-hover/section:opacity-100 transition-all '>
                <div ref={nextElRef} className='size-9 lg:size-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 2xl:right-[11.5vw] right-0 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500 [&_svg]:size-4 lg:[&_svg]:size-5'><ArrowRight /></div>
                <div ref={prevElRef} className='size-9 lg:size-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 2xl:left-[11.5vw] left-0 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500 [&_svg]:size-4 lg:[&_svg]:size-5'><ArrowLeft /></div>
            </div>
        </div>
    )
}

export default ProductCarousel
