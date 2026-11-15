import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Newsletter from '@/components/sections/newsletter'
import PageHeader from '@/components/sections/pageHeader'
import ProductsView from '@/components/sections/shopDetails/productView'
import Image from 'next/image'
import Link from 'next/link'
import { socialLinks } from '@/components/sections/footer'
import { categorySlugLabels } from '@/db/menuList'
import { categoryContent } from '@/db/categoryContent'
import { parseCatalogQuery, type RawSearchParams } from '@/lib/catalog/filters'
import { getCatalogPage, getHomeCategories } from '@/lib/sdk'
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
 *  - a **nav slug** from `menuList` (`furniture`, `lighting`, …), which
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

  // The header image is the category's lead product, read from the unfiltered
  // listing so it stays put while the shopper filters or sorts. On the default
  // view that is the page already being fetched.
  const leadQuery = { ...parseCatalogQuery({}), ...(serverCategory ? { category: slug } : {}) }
  const isDefaultQuery = JSON.stringify(leadQuery) === JSON.stringify(query)

  const [page, leadPage] = await Promise.all([
    getCatalogPage(query),
    isDefaultQuery ? null : getCatalogPage(leadQuery),
  ])
  const headerImage = content?.bannerImage ?? (leadPage ?? page).items[0]?.thumbnail
  return (
    <main>
      <PageHeader pageTitle={label} currentPage={label} breadcrumbLink="/category" breadcrumbLabel="Category" renderHeading={false} />
      {/* Category banner: centred title (the page's only <h1>) over a grey
          copy panel and a wide image. Per-category heading and image come from
          `categoryContent`; without an image the panel spans the full width. */}
      <section className="container pt-6 lg:pt-8 pb-2 lg:pb-3">
        <h1 className="text-center text-heading uppercase tracking-[0.2em] text-secondary-foreground font-normal">{label}</h1>
        <div className={headerImage ? "mt-4 lg:mt-6 grid md:grid-cols-[2fr_3fr]" : "mt-4 lg:mt-6"}>
          <div className="flex flex-col justify-between gap-5 bg-[#F2F2F2] p-5 sm:p-6 lg:p-8">
            <div>
              <h2 className="text-lg lg:text-xl font-medium uppercase leading-[125%] text-secondary-foreground">
                {content?.bannerHeading ?? `Explore our range of ${label}`}
              </h2>
              {content && (
                <p className="mt-2 text-[15px] text-gray-1-foreground leading-[160%]">{content.intro}</p>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ Icon, href, label: network }) => (
                <Link
                  key={network}
                  href={href}
                  aria-label={network}
                  className="flex size-7 items-center justify-center rounded-full bg-primary text-white transition-opacity duration-300 hover:opacity-75"
                >
                  <Icon className="size-3" />
                </Link>
              ))}
            </div>
          </div>
          {headerImage && (
            <div className="relative aspect-[2/1] md:aspect-auto md:min-h-[220px] lg:min-h-[250px] bg-home-bg-1">
              <Image
                src={headerImage}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>
      <ProductsView
        isCategoryShow={false}
        isSortingProductTop={true}
        isGridDefaultView={true}
        isSidebarCategoryHide={true}
        isSidebarTagsHide={true}
        data={page.items}
        catalog={{
          basePath: `/category/${slug}`,
          query,
          total: page.total,
          totalPages: page.totalPages,
          categories: page.categories,
          tags: page.tags,
          priceBounds: page.priceBounds,
          currency: getStoreCurrency(),
          failed: page.failed,
        }}
      />
      <Newsletter />
    </main>
  )
}

export default CategoryLandingPage
