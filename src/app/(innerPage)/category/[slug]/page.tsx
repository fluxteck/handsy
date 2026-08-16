import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InstagramGallery from '@/components/sections/instagramGallery'
import Newsletter from '@/components/sections/newsletter'
import PageHeader from '@/components/sections/pageHeader'
import ProductsView from '@/components/sections/shopDetails/productView'
import Link from 'next/link'
import { getProductsData } from '@/lib/data'
import { categorySlugLabels } from '@/db/menuList'
import { categoryContent } from '@/db/categoryContent'
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
  const content = categoryContent[slug]
  return {
    title: content?.metaTitle ?? label,
    description: content?.metaDescription ?? `Browse our ${label} collection.`,
  }
}

const CategoryLandingPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const label = categorySlugLabels[slug]
  if (!label) notFound()
  const content = categoryContent[slug]

  const { featuredProducts }: { featuredProducts: ProductType[] } = await getProductsData();
  return (
    <main>
      <PageHeader pageTitle={label} currentPage={label} breadcrumbLink="/category" breadcrumbLabel="Category" renderHeading={false} />
      {content && (
        <section className="container pt-8 lg:pt-10 pb-4 lg:pb-6">
          <h1 className="text-heading capitalize text-secondary-foreground font-normal">{label}</h1>
          <p className="mt-3 max-w-3xl text-gray-1-foreground leading-[170%]">{content.intro}</p>
          <div className="mt-4">
            <h2 className="text-lg font-medium text-secondary-foreground">Buying in Bulk</h2>
            <p className="mt-1 max-w-3xl text-gray-1-foreground leading-[170%]">
              {content.bulkNote}{" "}
              <Link href="/b2b" className="text-secondary-foreground underline underline-offset-2 hover:text-primary transition-colors duration-300">
                Get wholesale pricing →
              </Link>
            </p>
          </div>
        </section>
      )}
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
