import PageHeader from '@/components/sections/pageHeader'
import TestimonialSlider from '@/components/sections/testimonialSlider';
import BrandCarousel from '@/components/sections/brandCarousel';
import Newsletter from '@/components/sections/newsletter';
import InstagramGallery from '@/components/sections/instagramGallery';
import AboutHero from './aboutHero';
import AboutValues from './aboutValues';
import AboutCraftsmanship from './aboutCraftsmanship';
import AboutJourney from './aboutJourney';
import AboutVideo from './aboutVideo';
import AboutCta from './aboutCta';
import { Metadata } from 'next'
import { getBrandsData, getTestimonialsData } from '@/lib/data';

export const metadata: Metadata = {
    title: "About Us",
    description: "Handsy Market connects skilled artisans and vendors with retail and wholesale buyers worldwide, offering authentic handcrafted wooden furniture and home decor built to last."
}

const AboutUs = async () => {
    const brandsData = await getBrandsData();
    const testimonialData = await getTestimonialsData();

    return (
        <main>
            <PageHeader pageTitle='About Us' currentPage='About Us' renderHeading={false} />
            <AboutHero />
            <AboutValues />
            <AboutCraftsmanship />
            <AboutJourney />
            <AboutVideo />
            <TestimonialSlider testimonials={testimonialData} />
            <BrandCarousel brands={brandsData} title="Trusted by Retailers & Homes Worldwide" />
            <AboutCta />
            <Newsletter />
            <InstagramGallery />
        </main>
    )
}

export default AboutUs
