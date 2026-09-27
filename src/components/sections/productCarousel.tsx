'use client'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from '@/lib/icon'
import Card, { CardFooter, CardHeader, CardIcons, CardImg, CardLabel, CardTitle, CardPriceEnhanced } from '@/components/ui/card'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import { ProductType } from '@/types/productType'
import { productPath } from '@/lib/productPath'

// Shared product-card carousel used by every home section that slides through products
// (Top Collections, Featured Products' Best Sellers/New Arrivals/Featured tabs). Each instance
// owns its nav buttons, so several carousels can coexist on one page. The buttons are held in
// state, not refs: they render after the Swiper, so a ref is still null when Swiper initialises
// — which left every tab mounted after the first (e.g. New Arrivals) with dead arrows. State
// re-renders once they exist, and Swiper wires navigation up then.
const ProductCarousel = ({ data, slidesOffset }: { data: ProductType[]; slidesOffset: number }) => {
    const [nextEl, setNextEl] = useState<HTMLDivElement | null>(null)
    const [prevEl, setPrevEl] = useState<HTMLDivElement | null>(null)

    return (
        <div className='relative'>
            <Swiper
                navigation={{ prevEl, nextEl }}
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
                                    <CardImg src={prd.thumbnail} height={400} width={340} path={productPath(prd)} />
                                    <CardLabel isLabel={prd.label ? prd.label : false}>{prd.label}</CardLabel>
                                    <CardIcons product={prd} />
                                </CardHeader>
                                <CardFooter>
                                    <CardTitle path={productPath(prd)}>{prd.title}</CardTitle>
                                    <CardPriceEnhanced price={prd.price} discountPercentage={prd.discountPercentage} finalPrice={prd.sellingPrice} currency={prd.currency} />
                                </CardFooter>
                            </Card>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className='w-full lg:invisible lg:opacity-0 lg:group-hover/section:visible lg:group-hover/section:opacity-100 transition-all '>
                <div ref={setNextEl} className='size-9 lg:size-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 2xl:right-[11.5vw] right-0 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500 [&_svg]:size-4 lg:[&_svg]:size-5'><ArrowRight /></div>
                <div ref={setPrevEl} className='size-9 lg:size-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 2xl:left-[11.5vw] left-0 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500 [&_svg]:size-4 lg:[&_svg]:size-5'><ArrowLeft /></div>
            </div>
        </div>
    )
}

export default ProductCarousel
