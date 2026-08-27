import React from 'react'
import { Metadata } from 'next'
import AboutTeaser from '@/components/sections/aboutTeaser'
import BrandCarousel from '@/components/sections/brandCarousel'
import FeaturedProducts from '@/components/sections/featuredProducts'
import InstagramGallery from '@/components/sections/instagramGallery'
import HomeCategory from '@/components/sections/homeCategory'
import Newsletter from '@/components/sections/newsletter'
import TestimonialSlider from '@/components/sections/testimonialSlider'
import TopCollections from '@/components/sections/topCollections'
import HeroSection from '@/components/sections/heroSection'
import ShopTheLook from '@/components/sections/shopTheLook'
import { getBrandsData, getHeroData, getPromoCardsData, getShopTheLookData, getTestimonialsData } from '@/lib/data'
import { getFeaturedProducts, getHomeCategories, getTopCollections } from '@/lib/sdk'

export const metadata: Metadata = {
  title: "Handcrafted Wooden Furniture & Home Decor",
  description: "Shop handcrafted wooden furniture and home decor from independent Indian artisans. Retail and wholesale/bulk orders, with export shipping worldwide."
}

/**
 * Catalogue sections (categories, top collections, featured products) come
 * from handsymarket-server through the SDK. The editorial sections — hero,
 * promo cards, brands, testimonials, shop-the-look — have no server
 * counterpart and keep reading local content from `src/db`.
 *
 * Revalidated hourly; the catalogue changes far less often than a request
 * arrives, and the admin can push an immediate invalidation later.
 */
export const revalidate = 3600;

const Home = async () => {
  // Fetched together rather than in sequence: these are independent, and three
  // of them (categories, top collections, featured products) are network reads
  // against the catalogue API. Awaiting them one at a time made the page's
  // time-to-first-byte the *sum* of every round trip instead of the slowest.
  const [
    categoriesData,
    testimonialData,
    topCollections,
    featuredProducts,
    heroData,
    promoCardsData,
    brandsData,
    shopTheLookData,
  ] = await Promise.all([
    getHomeCategories(),
    getTestimonialsData(),
    getTopCollections(),
    getFeaturedProducts(),
    getHeroData(),
    getPromoCardsData(),
    getBrandsData(),
    getShopTheLookData(),
  ]);

  return (
    <>
      <HeroSection heroData={heroData} promoCards={promoCardsData} />
      <HomeCategory categories={categoriesData} />
      <FeaturedProducts featuredProducts={featuredProducts} />
      <TopCollections data={topCollections} />
      <AboutTeaser />
      <ShopTheLook data={shopTheLookData} />
      <BrandCarousel brands={brandsData} />
      <TestimonialSlider testimonials={testimonialData} />
      <Newsletter />
      <InstagramGallery />
    </>
  )
}

export default Home