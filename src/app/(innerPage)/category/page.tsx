import React from 'react'
import { Metadata } from 'next'
import InstagramGallery from '@/components/sections/instagramGallery'
import Newsletter from '@/components/sections/newsletter'
import PageHeader from '@/components/sections/pageHeader'
import ProductsView from '@/components/sections/shopDetails/productView'
import { parseCatalogQuery, type RawSearchParams } from '@/lib/catalog/filters'
import { getCatalogPage, getTopRatedProducts } from '@/lib/sdk'
import { getStoreCurrency } from '@/lib/config'

export const metadata: Metadata = {
  title: "Category",
  description: "Browse products by category."
}

/**
 * Category index. The sidebar's category list is hidden here (as it always
 * was), so the category itself is chosen through the `?category=` parameter —
 * which is what the older `/category?name=` links were reaching for.
 */
export const dynamic = 'force-dynamic'

const page = async ({ searchParams }: { searchParams: Promise<RawSearchParams> }) => {
  const raw = await searchParams
  // The template's sidebar linked here as `/category?name=<value>`; honour it
  // so those links narrow the results instead of being ignored.
  const query = parseCatalogQuery({ ...raw, category: raw.category ?? raw.name })
  const [catalog, bestSellers] = await Promise.all([
    getCatalogPage(query),
    getTopRatedProducts(3),
  ])
  return (
    <main>
      <PageHeader pageTitle='Shop by Category' currentPage='Category' />
      <ProductsView
        isCategoryShow={false}
        isSortingProductTop={true}
        isGridDefaultView={true}
        isSidebarCategoryHide={true}
        data={catalog.items}
        catalog={{
          basePath: '/category',
          query,
          total: catalog.total,
          totalPages: catalog.totalPages,
          categories: catalog.categories,
          tags: catalog.tags,
          priceBounds: catalog.priceBounds,
          bestSellers,
          currency: getStoreCurrency(),
          failed: catalog.failed,
        }}
      />
      <Newsletter />
      <InstagramGallery />
    </main>
  )
}

export default page