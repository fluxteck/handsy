'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
// Banner text & CTA hidden — only used by the commented-out JSX below.
// import { ArrowRightLong } from '@/lib/icon'
import { PromoCardSlideType } from '@/db/promoCardsData'

type PromoCardSliderProps = {
    slides: PromoCardSlideType[];
    className?: string;
}

const PromoCardSlider = ({ slides, className }: PromoCardSliderProps) => {
    if (!slides.length) return null;
    const hasMultiple = slides.length > 1;

    return (
        <div className={cn('group/promo relative h-full w-full overflow-hidden rounded-3xl', className)}>
            <Swiper
                loop={hasMultiple}
                grabCursor={hasMultiple}
                speed={800}
                autoplay={hasMultiple ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                pagination={hasMultiple ? {
                    el: '.promo-pagination',
                    clickable: true,
                    bulletClass: 'category-pagination-bullet',
                    bulletActiveClass: 'category-pagination-bullet-active',
                } : false}
                modules={[Autoplay, Pagination]}
                className='h-full'
            >
                {/* Banner text & CTA hidden — restore `subtitle` and `buttonText` below together with the commented JSX. */}
                {slides.map(({ id, image, mobileImage, title, buttonLink /* , subtitle, buttonText */ }) => (
                    <SwiperSlide key={id} className='relative h-full'>
                        <div className='relative h-full w-full overflow-hidden'>
                            {mobileImage ? (
                                <>
                                    {/* The stacked card (below lg) is 4:3 like the mobile artwork. The wide
                                        desktop artwork is anchored left so `object-cover` crops its empty
                                        right side, never the headline built into the image. */}
                                    <Image
                                        src={mobileImage}
                                        alt={title}
                                        fill
                                        sizes='100vw'
                                        className='object-cover transition-transform duration-700 group-hover/promo:scale-105 lg:hidden'
                                    />
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        sizes='40vw'
                                        className='hidden object-cover object-left transition-transform duration-700 group-hover/promo:scale-105 lg:block'
                                    />
                                </>
                            ) : (
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    sizes='(max-width: 1024px) 100vw, 40vw'
                                    className='object-cover transition-transform duration-700 group-hover/promo:scale-105'
                                />
                            )}
                            <div className='absolute inset-0 bg-gradient-to-t from-[rgba(26,26,25,0.75)] via-[rgba(26,26,25,0.15)] to-transparent' />
                            <div className='absolute inset-0 flex flex-col justify-end p-6 lg:p-8'>
                                {/* Banner text & CTA hidden — uncomment to restore.
                                <h3 className='text-white text-[clamp(1.25rem,1.05rem+0.85vw,1.75rem)] leading-[125%] max-w-[280px]'>
                                    {title}
                                </h3>
                                <p className='text-white/80 text-sm mt-2 max-w-[260px]'>
                                    {subtitle}
                                </p>
                                <Link
                                    href={buttonLink}
                                    className='group/link inline-flex items-center gap-2 text-white text-sm font-medium mt-5 w-fit border-b border-white/70 pb-1 hover:border-white transition-all duration-500'
                                >
                                    {buttonText}
                                    <ArrowRightLong className='transition-transform duration-500 group-hover/link:translate-x-1' />
                                </Link>
                                */}
                            </div>
                            {/* Whole-card link; `draggable={false}` keeps the browser's native
                                link-drag from interfering with the slider. */}
                            <Link
                                href={buttonLink}
                                aria-label={title}
                                draggable={false}
                                className='absolute inset-0 z-10'
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {hasMultiple && (
                <div className='promo-pagination absolute bottom-4 right-6 z-10 flex justify-center items-center gap-2' />
            )}
        </div>
    )
}

export default PromoCardSlider
