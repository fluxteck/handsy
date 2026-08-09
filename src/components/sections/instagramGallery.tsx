import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Instagram } from '@/lib/icon'
import { getGalleryData } from '@/lib/data'
import Title from '@/components/ui/title'
import { GalleryType } from '@/db/galleryData'

const InstagramGallery = async () => {
    const galleryData: GalleryType[] = await getGalleryData();
    return (
        <section className='pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5'>
            <div className='container'>
                <div className='md:flex justify-between items-center'>
                    <Title className='mb-5 md:mb-0 font-medium'>Furniture Gallery</Title>
                    <Button asChild className='lg:[&_svg]:size-5 [&_svg]:size-4'>
                        <Link href={"#"}><Instagram /> Follow</Link>
                    </Button>
                </div>
                <div className='pt-7.5 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5'>
                    {
                        galleryData.map(({ id, thumbnail, title }) => {
                            return (
                                <div key={id} className='relative group'>
                                    <Image width={340} height={340} sizes='100vw' src={thumbnail} alt='img' className='w-full rounded-[15px]' />
                                    <div className='rounded-[15px] absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col bg-[linear-gradient(0deg,_rgba(26,25,25,0.80)_0%,_rgba(26,25,25,0.80)_100%)] transition-all duration-500 scale-0 group-hover:scale-100'>
                                        <span className='lg:text-2xl text-xl font-medium text-[#E5E2E1] block text-center'>View more in</span>
                                        <Link href={"#"} className='lg:text-2xl text-xl font-medium text-[#E5E2E1] text-center'>@handsymarket</Link>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default InstagramGallery