import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRightLong } from '@/lib/icon'
import { PromoBentoCardType } from '@/db/promoBentoData'

type PromoBentoProps = {
    cards: PromoBentoCardType[];
    className?: string;
}

const BentoCard = ({ card, featured, className }: { card: PromoBentoCardType; featured?: boolean; className?: string }) => {
    const { image, title, subtitle, buttonText, buttonLink, imagePosition } = card;

    return (
        <Link
            href={buttonLink}
            className={cn('group/bento relative block min-h-0 overflow-hidden rounded-3xl bg-home-bg-1 isolate', className)}
        >
            <Image
                src={image}
                alt=''
                fill
                sizes={featured ? '(max-width: 1024px) 100vw, 45vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 55vw'}
                style={imagePosition ? { objectPosition: imagePosition } : undefined}
                className='-z-10 object-cover transition-transform duration-700 ease-out group-hover/bento:scale-105 motion-reduce:transition-none motion-reduce:group-hover/bento:scale-100'
            />
            {/* Same near-black scrim as the hero promo cards, heavier where the copy sits. */}
            <div
                aria-hidden
                className='absolute inset-0 -z-10 bg-gradient-to-t from-[rgba(26,26,25,0.8)] via-[rgba(26,26,25,0.3)] via-45% to-transparent transition-opacity duration-500 group-hover/bento:opacity-90'
            />
            <div className={cn('flex h-full flex-col justify-end text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.25)]', featured ? 'p-6 sm:p-8 lg:p-10' : 'p-6 sm:p-7 lg:p-8')}>
                <p className='flex items-center gap-2.5 text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/80'>
                    {subtitle} <span className='h-px w-8 bg-white/50' aria-hidden />
                </p>
                <h3
                    className={cn(
                        'mt-2.5 max-w-md text-balance',
                        featured
                            ? 'text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)]/[1.12]'
                            : 'text-[clamp(1.375rem,1.05rem+1vw,2rem)]/[1.15]'
                    )}
                >
                    {title}
                </h3>
                <span className='mt-4 lg:mt-5 inline-flex w-fit items-center gap-2 border-b border-white/60 pb-1 text-sm font-medium transition-colors duration-500 group-hover/bento:border-white'>
                    {buttonText}
                    <ArrowRightLong className='transition-transform duration-500 group-hover/bento:translate-x-1' />
                </span>
            </div>
        </Link>
    )
}

/**
 * Editorial bento: one tall banner on the left, two stacked on the right.
 *
 * On desktop the grid is sized off the viewport (capped at 620px) so the whole
 * section, padding included, always fits on one screen. Below `lg` it falls
 * back to fixed aspect ratios: three stacked cards on mobile, the tall card
 * full-width above a pair on tablet.
 */
const PromoBento = ({ cards, className }: PromoBentoProps) => {
    const [featured, ...rest] = cards;
    if (!featured) return null;

    return (
        <section className={cn('pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5', className)} aria-label='Featured collections'>
            <div className='container'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[0.85fr_1fr] lg:grid-rows-2 gap-4 lg:gap-6 lg:h-[clamp(380px,calc(100svh-12rem),620px)]'>
                    <BentoCard
                        card={featured}
                        featured
                        className='aspect-[4/3] md:col-span-2 md:aspect-[16/9] lg:col-span-1 lg:row-span-2 lg:aspect-auto'
                    />
                    {rest.slice(0, 2).map((card) => (
                        <BentoCard key={card.id} card={card} className='aspect-[4/3] md:aspect-[4/3] lg:aspect-auto' />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PromoBento
