import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { UspBlockType } from '@/db/uspData'

/**
 * Colour schemes, all from existing theme tokens. `sand` is the warm
 * background the About teaser sits on; `dark` pairs the near-black primary
 * with the gold accent used on the testimonial avatars.
 */
const tones = {
    sand: {
        section: 'bg-home-bg-3',
        divider: 'divide-gray-2/70 xl:border-gray-2/70',
        icon: 'text-secondary-foreground/80 group-hover/usp:-translate-y-0.5 group-hover/usp:text-primary',
        title: 'text-secondary-foreground',
        text: 'text-gray-1-foreground',
    },
    light: {
        section: 'bg-background',
        divider: 'divide-border xl:border-border',
        icon: 'text-secondary-foreground/80 group-hover/usp:-translate-y-0.5 group-hover/usp:text-primary',
        title: 'text-secondary-foreground',
        text: 'text-gray-1-foreground',
    },
    dark: {
        section: 'bg-primary',
        divider: 'divide-white/15 xl:border-white/15',
        icon: 'text-[#C9A968] group-hover/usp:-translate-y-0.5 group-hover/usp:text-white',
        title: 'text-white',
        text: 'text-white/65',
    },
} as const

type UspStripProps = {
    items: UspBlockType[];
    tone?: keyof typeof tones;
    /** Vertical breathing room. */
    spacing?: 'compact' | 'comfortable';
    className?: string;
}

/**
 * Trust & benefits strip. A single row of hairline-divided blocks on desktop;
 * below `xl` (where five columns would truncate) it becomes a native scroll-snap row (no slider library) where
 * the next block peeks in to signal it can be swiped.
 */
const UspStrip = ({ items, tone = 'sand', spacing = 'comfortable', className }: UspStripProps) => {
    if (!items.length) return null;
    const colors = tones[tone];

    return (
        <section
            aria-label='Why shop with Handsy Market'
            className={cn(colors.section, spacing === 'compact' ? 'py-5 lg:py-5' : 'py-7 lg:py-8', className)}
        >
            <div className='container'>
                <ul
                    className={cn(
                        'scrollbar-hidden -mx-4 flex snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 divide-x',
                        'xl:mx-0 xl:grid xl:overflow-visible xl:px-0 xl:border-y',
                        colors.divider
                    )}
                    style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
                >
                    {items.map(({ id, icon: Icon, title, text, href }) => {
                        const content = (
                            <>
                                <Icon
                                    aria-hidden
                                    strokeWidth={1.25}
                                    className={cn('size-6 lg:size-7 shrink-0 transition-all duration-500', colors.icon)}
                                />
                                <span className='min-w-0'>
                                    <span className={cn('block truncate font-display text-[17px] leading-tight', colors.title)}>
                                        {title}
                                    </span>
                                    <span className={cn('mt-1 block truncate text-[13px] leading-snug', colors.text)}>
                                        {text}
                                    </span>
                                </span>
                            </>
                        )
                        const blockClass = 'group/usp flex h-full items-center gap-3.5 px-5 py-1 xl:px-6 xl:py-5'

                        return (
                            <li key={id} className='w-[72%] sm:w-[42%] md:w-[31%] lg:w-[27%] shrink-0 snap-start xl:w-auto first:*:pl-0'>
                                {href ? (
                                    <Link href={href} className={cn(blockClass, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm')}>
                                        {content}
                                    </Link>
                                ) : (
                                    <div className={blockClass}>{content}</div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default UspStrip
