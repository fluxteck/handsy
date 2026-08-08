'use client'
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Title from '@/components/ui/title'
import Rating from '@/components/ui/rating'
import { ArrowLeft, ArrowRight } from '@/lib/icon'
import { testimonialType } from '@/db/testimonialsData'

type TestimonialSliderProps = {
    testimonials: testimonialType[];
    title?: string;
    className?: string;
}

const TestimonialSlider = ({ testimonials, title = 'Client Testimonials', className }: TestimonialSliderProps) => {
    return (
        <section className={cn('pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5 group/section', className)} aria-label="Client testimonials">
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
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            nextEl: '.testimonial-next-el',
                            prevEl: '.testimonial-prev-el',
                        }}
                        pagination={{
                            el: '.testimonial-pagination',
                            clickable: true,
                            bulletClass: 'testimonial-pagination-bullet',
                            bulletActiveClass: 'testimonial-pagination-bullet-active',
                        }}
                        spaceBetween={24}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                        modules={[Autoplay, Navigation, Pagination]}
                        className='!pt-10 !pb-2'
                    >
                        {testimonials.map(({ id, name, image, rating, title: caption, review }) => (
                            <SwiperSlide key={id} className='!h-auto'>
                                <article className='group/card relative flex flex-col items-center h-full rounded-2xl border border-border bg-background pt-13 pb-8 px-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl'>
                                    <div className='absolute -top-10 size-20 overflow-hidden rounded-full ring-4 ring-background shadow-3xl'>
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            sizes='80px'
                                            className='object-cover transition-transform duration-500 group-hover/card:scale-110'
                                        />
                                    </div>
                                    <h5 className='text-base text-secondary-foreground leading-[150%]'>{name}</h5>
                                    <Rating star={rating} iconSize='size-4' className='justify-center mt-2' />
                                    <h6 className='mt-4 text-lg text-secondary-foreground leading-[140%]'>{caption}</h6>
                                    <p className='mt-3 text-sm text-gray-1-foreground leading-[170%]'>{review}</p>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className='w-full invisible opacity-0 group-hover/section:visible group-hover/section:opacity-100 transition-all'>
                        <button
                            type='button'
                            aria-label='Previous testimonial'
                            className='testimonial-prev-el w-12.5 h-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-6 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500'
                        >
                            <ArrowLeft />
                        </button>
                        <button
                            type='button'
                            aria-label='Next testimonial'
                            className='testimonial-next-el w-12.5 h-12.5 rounded-full bg-home-bg-1 absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-6 z-40 drop-shadow-3xl cursor-pointer text-gray-1-foreground flex justify-center items-center hover:text-white hover:bg-primary transition-all duration-500'
                        >
                            <ArrowRight />
                        </button>
                    </div>

                    <div className='testimonial-pagination flex justify-center items-center gap-2 mt-10' />
                </div>
            </div>
        </section>
    )
}

export default TestimonialSlider
