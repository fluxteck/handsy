import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InstagramGallery from '@/components/sections/instagramGallery'
import Newsletter from '@/components/sections/newsletter'
import PageHeader from '@/components/sections/pageHeader'
import ProductsView from '@/components/sections/shopDetails/productView'
import { getProductsData } from '@/lib/data'
import { categorySlugLabels } from '@/db/menuList'
import { ProductType } from '@/types/productType'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = () => {
  return Object.keys(categorySlugLabels).map((slug) => ({ slug }))
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const label = categorySlugLabels[slug]
  if (!label) return {}
  return {
    title: label,
    description: `Browse our ${label} collection.`,
  }
}

const CategoryLandingPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const label = categorySlugLabels[slug]
  if (!label) notFound()

  const { featuredProducts }: { featuredProducts: ProductType[] } = await getProductsData();
  return (
    <main>
      <PageHeader pageTitle={label} currentPage={label} />
      <ProductsView
        isCategoryShow={false}
        isSortingProductTop={true}
        isGridDefaultView={true}
        isSidebarCategoryHide={true}
        data={featuredProducts.slice(0, 3)}
      />
      <Newsletter />
      <InstagramGallery />
    </main>
  )
}

export default CategoryLandingPage
