import React from 'react'
import PageHeader from '@/components/sections/pageHeader'
import FaqSection from '@/components/sections/faqSection'
import Newsletter from '@/components/sections/newsletter'
import InstagramGallery from '@/components/sections/instagramGallery'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "FAQ — Shipping, Returns, Payments & Orders",
    description: "Answers to common questions about shipping, returns, payments, and ordering — for retail and wholesale/bulk buyers at Handsy Market."
}

const Faq = () => {
    return (
        <main>
            <PageHeader pageTitle='FAQ' currentPage='Faq' />
            <FaqSection />
            <Newsletter />
            <InstagramGallery />
        </main>
    )
}

export default Faq