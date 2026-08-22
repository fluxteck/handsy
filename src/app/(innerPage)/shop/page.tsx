
import React from 'react'
import { Metadata } from 'next'
import PageHeader from '@/components/sections/pageHeader'
import ProductsView from '@/components/sections/shopDetails/productView'
import Newsletter from '@/components/sections/newsletter'
import InstagramGallery from '@/components/sections/instagramGallery'
import { parseCatalogQuery, type RawSearchParams } from '@/lib/catalog/filters'
import { getCatalogPage, getTopRatedProducts } from '@/lib/sdk'
import { getStoreCurrency } from '@/lib/config'

export const metadata: Metadata = {
    title: "Shop Wooden Furniture & Home Decor",
    description: "Shop handcrafted wooden furniture and home decor online — filter by category, price, and style. Retail and bulk orders available."
}

/**
 * The collections page — every product, with working search, category, price,
 * tag, sort and pagination, all served from handsymarket-server via the SDK.
 *
 * Filter state lives in the query string, so this stays a server component:
 * each change is a normal navigation that re-renders on the server with fresh
 * results. That keeps the filtered view shareable and the back button honest,
 * and avoids shipping the catalogue to the browser to filter it there.
 *
 * Dynamic rather than ISR — the output depends on the query string, and
 * caching one variant would serve the wrong products for every other.
 */
export const dynamic = 'force-dynamic'

const ShopOne = async ({ searchParams }: { searchParams: Promise<RawSearchParams> }) => {
    const query = parseCatalogQuery(await searchParams)
    const [page, bestSellers] = await Promise.all([
        getCatalogPage(query),
        getTopRatedProducts(3),
    ])
    return (
        <main>
            <PageHeader pageTitle='Shop' currentPage='Shop' />
            <ProductsView
                isCategoryShow={false}
                isSortingProductTop={true}
                isGridDefaultView={true}
                isSidebarCategoryHide={false}
                data={page.items}
                catalog={{
                    basePath: '/shop',
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

export default ShopOne