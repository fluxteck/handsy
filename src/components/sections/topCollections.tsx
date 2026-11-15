'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Title from '@/components/ui/title'
import { ProductType } from '@/types/productType'
import ProductCarousel from './productCarousel'

const TopCollections = ({data}:{data:ProductType[]}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [slidesOffset, setSlidesOffset] = useState(0);

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
        <section className='bg-home-bg-1 pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5 group/section'>
            {/* Title centred; on desktop the link keeps its place at the right. */}
            <div className='container flex flex-col items-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center gap-4 mb-10' ref={containerRef}>
                <Title className='text-center md:col-start-2'>Top Collections</Title>
                <Link href={"/shop"} className='md:justify-self-end text-gray-1-foreground lg:text-xl text-lg border-b border-b-primary mt-0 inline-block hover:border-b-primary hover:text-secondary-foreground duration-500'>View All Collections</Link>
            </div>
            <ProductCarousel data={data} slidesOffset={slidesOffset} />
        </section>
    )
}

export default TopCollections

