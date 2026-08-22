import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InstagramGallery from '@/components/sections/instagramGallery'
import Newsletter from '@/components/sections/newsletter'
import PageHeader from '@/components/sections/pageHeader'
import ProductsView from '@/components/sections/shopDetails/productView'
import Link from 'next/link'
import { categorySlugLabels } from '@/db/menuList'
import { categoryContent } from '@/db/categoryContent'
import { parseCatalogQuery, type RawSearchParams } from '@/lib/catalog/filters'
import { getCatalogPage, getHomeCategories, getTopRatedProducts } from '@/lib/sdk'
import { getStoreCurrency } from '@/lib/config'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<RawSearchParams>
}

/**
 * Category listing — the same catalogue machinery as /shop, pinned to one
 * category.
 *
 * Slug resolution accepts two sources, because they don't yet agree:
 *
 *  - a **real category slug** from the server (`lighting`, `chandeliers`, …),
 *    which filters the results; or
 *  - a **nav slug** from `menuList` (`furniture`, `lamps-lighting`, …), which
 *    the header links to but the catalogue has no category for. Those render
 *    the full catalogue under the nav's label rather than an empty page.
 *
 * Once the nav is rebuilt from real categories the second branch can go, and
 * an unknown slug can simply 404.
 *
 * `generateStaticParams` is gone: the filters live in the query string, which
 * makes this route dynamic — prerendering it would freeze one filter state.
 */
export const dynamic = 'force-dynamic'

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const categories = await getHomeCategories()
  const serverCategory = categories.find((c) => c.value === slug)
  const label = serverCategory?.categoryName ?? categorySlugLabels[slug]
  if (!label) return {}
  const content = categoryContent[slug]
  return {
    title: content?.metaTitle ?? label,
    description: content?.metaDescription ?? `Browse our ${label} collection.`,
  }
}

const CategoryLandingPage = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params
  const categories = await getHomeCategories()
  const serverCategory = categories.find((c) => c.value === slug)
  const label = serverCategory?.categoryName ?? categorySlugLabels[slug]
  if (!label) notFound()
  const content = categoryContent[slug]

  // Only a slug the catalogue recognises narrows the results.
  const baseQuery = parseCatalogQuery(await searchParams)
  const query = serverCategory ? { ...baseQuery, category: slug } : baseQuery

  const [page, bestSellers] = await Promise.all([
    getCatalogPage(query),
    getTopRatedProducts(3),
  ])
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
        data={page.items}
        catalog={{
          basePath: `/category/${slug}`,
          query,
          total: page.total,
          totalPages: page.totalPages,
          categories: page.categories,
          tags: page.tags,
          priceBounds: page.priceBounds,
          bestSellers,
          currency: getStoreCurrency(),
          failed: page.failed,
        }}
      />
      <Newsletter />
      <InstagramGallery />
    </main>
  )
}

export default CategoryLandingPage
