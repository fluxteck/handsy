import PageHeader from '@/components/sections/pageHeader'
import Newsletter from '@/components/sections/newsletter'
import InstagramGallery from '@/components/sections/instagramGallery'

import React from 'react'
import ContactHero from './contactHero'
import ContactInfoCards from './contactInfoCards'
import ContactForm from './contactForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Handsy Market team for orders, custom pieces, and wholesale enquiries."
}

const ContactUs = () => {
    return (
        <main>
            <PageHeader pageTitle='Contact Us' currentPage='Contact Us' />
            <ContactHero />
            <ContactInfoCards />
            <ContactForm />
            <Newsletter />
            <InstagramGallery />
        </main>
    )
}

export default ContactUs