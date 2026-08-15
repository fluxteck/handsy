import React from 'react'
import { Metadata } from 'next'
import AboutTeaser from '@/components/sections/aboutTeaser'
import BlogSlider from '@/components/sections/blogs/blogSlider'
import BrandCarousel from '@/components/sections/brandCarousel'
import FeaturedProducts from '@/components/sections/featuredProducts'
import InstagramGallery from '@/components/sections/instagramGallery'
import HomeCategory from '@/components/sections/homeCategory'
import Newsletter from '@/components/sections/newsletter'
import TestimonialSlider from '@/components/sections/testimonialSlider'
import TopCollections from '@/components/sections/topCollections'
import HeroSection from '@/components/sections/heroSection'
import ShopTheLook from '@/components/sections/shopTheLook'
import { getBlogData, getBrandsData, getCategoriesData, getHeroData, getPromoCardsData, getProductsData, getShopTheLookData, getTestimonialsData } from '@/lib/data'

export const metadata: Metadata = {
  title: "Handcrafted Wooden Furniture & Home Decor",
  description: "Shop handcrafted wooden furniture and home decor from independent Indian artisans. Retail and wholesale/bulk orders, with export shipping worldwide."
}

const Home = async () => {
  const categoriesData = await getCategoriesData();
  const blogData = await getBlogData();
  const testimonialData = await getTestimonialsData();
 const { topCollections, featuredProducts } = await getProductsData();
  const heroData = await getHeroData()
  const promoCardsData = await getPromoCardsData()
  const brandsData = await getBrandsData()
  const shopTheLookData = await getShopTheLookData()

  return (
    <>
      <HeroSection heroData={heroData} promoCards={promoCardsData} />
      <HomeCategory categories={categoriesData} />
      <FeaturedProducts featuredProducts={featuredProducts} />
      <TopCollections data={topCollections} />
      <AboutTeaser />
      <ShopTheLook data={shopTheLookData} />
      <BrandCarousel brands={brandsData} />
      <BlogSlider blogs={blogData} />
      <TestimonialSlider testimonials={testimonialData} />
      <Newsletter />
      <InstagramGallery />
    </>
  )
}

export default Home