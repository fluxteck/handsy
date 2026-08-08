'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation } from 'swiper/modules'
import Title from '@/components/ui/title'
import { ArrowLeft, ArrowRight } from '@/lib/icon'
import { BrandType } from '@/db/brandsData'

type BrandCarouselProps = {
    brands: BrandType[];
    title?: string;
    className?: string;
}

const BrandCarousel = ({ brands, title = "Brands You'll Love", className }: BrandCarouselProps) => {
    return (
        <section className={cn('lg:pb-25 pb-15 group/section', className)} aria-label="Brands we carry">
            <div className='container'>
                {title && (
                    <Title className='mb-10'>{title}</Title>
                )}
                <div className='relative'>
                    <Swiper
                        grabCursor
                        loop
                        speed={800}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            nextEl: '.brand-next-el',
                            prevEl: '.brand-prev-el',
                        }}
                        spaceBetween={20}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                            },
                            480: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1024: {
                                slidesPerView: 5,
                            },
                            1280: {
                                slidesPerView: 6,
                            },
                        }}
                        modules={[Autoplay, Navigation]}
                    >
                        {brands.map(({ id, name, logo, href }) => {
                            const content = (
                                <div className='group/card flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-background px-6 py-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl'>
                                    <div className='relative h-10 w-full'>
                                        <Image
                                            src={logo}
                                            alt={name}
                                            fill
                                            sizes='160px'
                                            className='object-contain grayscale opacity-70 transition-all duration-500 group-hover/card:grayscale-0 group-hover/card:opacity-100'
                                        />
                                    </div>
                                    <span className='text-sm font-medium text-gray-1-foreground tracking-wide text-center transition-colors duration-500 group-hover/card:text-secondary-foreground'>
                                        {name}
                                    </span>
                                </div>
                            )

                            return (
                                <SwiperSlide key={id} className='!h-auto'>
                                    {href ? (
                                        <Link href={href} aria-label={name} className='block h-full'>
                                            {content}
                                        </Link>
                                    ) : content}
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                    <div className='w-full invisible opacity-0 group-hover/section:visible group-hover/section:opacity-100 transition-all'>
                        <button
                            type='button'
                            aria-label='Previous brand'
                            className='brand-prev-el w-12.5 h-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 2xl:left-[11.5vw] left-0 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500'
                        >
                            <ArrowLeft />
                        </button>
                        <button
                            type='button'
                            aria-label='Next brand'
                            className='brand-next-el w-12.5 h-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 2xl:right-[11.5vw] right-0 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500'
                        >
                            <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BrandCarousel
