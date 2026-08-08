import React from 'react'
import Hero from '@/components/sections/hero'
import PromoCardSlider from '@/components/sections/promoCardSlider'
import { HeroDataType } from '@/db/heroData'
import { PromoCardGroupType } from '@/db/promoCardsData'

type HeroSectionProps = {
    heroData: HeroDataType[];
    promoCards: PromoCardGroupType[];
}

const HeroSection = ({ heroData, promoCards }: HeroSectionProps) => {
    const [primaryCard, secondaryCard] = promoCards;

    return (
        <section className='container lg:pt-6 pt-4 pb-4 lg:pb-6' aria-label="Hero">
            <div className='grid lg:grid-cols-5 grid-cols-1 gap-4 lg:gap-6'>
                <div className='lg:col-span-3 rounded-3xl overflow-hidden'>
                    <Hero data={heroData} />
                </div>
                {(primaryCard || secondaryCard) && (
                    <div className='lg:col-span-2 flex lg:flex-col flex-col gap-4 lg:gap-6'>
                        {primaryCard && (
                            <PromoCardSlider slides={primaryCard.slides} className='lg:flex-1 aspect-[4/3] lg:aspect-auto' />
                        )}
                        {secondaryCard && (
                            <PromoCardSlider slides={secondaryCard.slides} className='lg:flex-1 aspect-[4/3] lg:aspect-auto' />
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default HeroSection
