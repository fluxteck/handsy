import React from 'react'
import ProductDetailsTabView from '@/components/sections/shopDetails/productDetailsTabView'
import ProductShortInfo from '@/components/sections/shopDetails/productShortInfo'
import ProductPreviewTwo from '@/app/(innerPage)/product-details-3/productPreviewTwo'
import RelatedProducts from '@/components/sections/shopDetails/relatedProducts'
import Newsletter from '@/components/sections/newsletter'
import InstagramGallery from '@/components/sections/instagramGallery'
import PageHeader from '@/components/sections/pageHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Product Details",
    description: "View product details.",
    robots: { index: false, follow: false },
}

const ProductDetailsThree = () => {
    return (
        <main>
            <PageHeader
                pageTitle="Baxter Colette Chair"
                currentPage="Baxter Colette Chair"
                items={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/shop" },
                    { label: "Furniture", href: "/category/furniture" },
                    { label: "Baxter Colette Chair" },
                ]}
            />
            <div className='container pt-8 lg:pt-10'>
                <div className='grid lg:grid-cols-[51%_auto] md:grid-cols-2 grid-cols-1 items-start xl:gap-15 gap-10'>
                    <ProductPreviewTwo />
                    <ProductShortInfo
                        id={1}
                        price={219}
                        title='modern dark wood chair'
                        thumbnail='/images/product-details/img-1.webp'
                        stock={99}
                        discountPercentage={0}
                    />
                </div>
                <ProductDetailsTabView className='justify-center border-b-0' />
            </div>
            <RelatedProducts />
            <Newsletter />
            <InstagramGallery />
        </main>
    )
}

export default ProductDetailsThree