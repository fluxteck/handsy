import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MegamenuType } from '@/db/menuList'
import calcluteDiscount from '@/lib/calcluteDiscount'
import currencyFormatter from 'currency-formatter';
import { cn } from '@/lib/utils'
import { ProductType } from '@/types/productType'
import { productPath } from '@/lib/productPath';

/** Small-caps section label — the same treatment the mobile drawer already
 *  uses for "Shop" / "Quick Links", reused here for column and rail headings
 *  so the two surfaces read as one design language. */
const sectionLabelClass = 'mb-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-2-foreground'

const MegaMenu = ({ data, featuredProducts, forceClosed, onNavigate }: { data: MegamenuType[], featuredProducts: ProductType[], forceClosed?: boolean, onNavigate?: () => void }) => {

    return (
        <div
            className={cn(
                // The triggering `<li>` goes `static` at `lg:` (see navbar.tsx), so
                // this `absolute` box bubbles up to the nav row's own `relative`
                // wrapper — the same `container` the nav bar itself spans — and
                // `inset-x-0`/`w-full` stretch it to that exact width, aligned with
                // the full bar regardless of which item triggered it.
                'static lg:absolute lg:z-50 lg:top-full lg:inset-x-0 lg:w-full bg-home-bg-1 shadow-xl rounded-b-xl overflow-hidden',
                // `grid-template-rows: 0fr -> 1fr` (desktop only) sizes the panel's
                // height to its own content too — a short menu opens compact, a
                // taller one opens taller, with no fixed box and no leftover space.
                'lg:grid lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out',
                forceClosed && 'lg:grid-rows-[0fr]!'
            )}
        >
            <div className='overflow-hidden lg:min-h-0'>
                <div className='flex flex-col gap-y-5 px-6 py-5 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-x-10 lg:gap-y-6 lg:px-8 lg:py-6'>
                    {
                        data.map(({ menus, id }) => {
                            return (
                                <div key={id} className='flex flex-col gap-y-4 lg:flex-row lg:flex-wrap lg:gap-x-10 lg:gap-y-6'>
                                    {
                                        menus.map(({ id, items, title }) => {
                                            return (
                                                <div key={id}>
                                                    {/* Rendered even when a column has no heading, so every column's
                                                        link list starts on the same baseline instead of the headed
                                                        columns sitting visibly lower than the headless ones. */}
                                                    <p className={sectionLabelClass} aria-hidden={!title}>{title || ' '}</p>
                                                    <ul>
                                                        {
                                                            items.map(({ id, path, label }) => {
                                                                return (
                                                                    <li key={id}>
                                                                        <Link
                                                                            aria-label='nav'
                                                                            href={path}
                                                                            onClick={onNavigate}
                                                                            className='inline-flex items-center py-1 text-sm text-gray-1-foreground capitalize transition-all duration-200 hover:translate-x-0.5 hover:text-secondary-foreground'
                                                                        >
                                                                            {label}
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })}
                    {featuredProducts.length > 0 && (
                    <div className='lg:w-[190px] lg:shrink-0'>
                        <p className={sectionLabelClass}>Best Sellers</p>
                        <div className='flex flex-col gap-3'>
                            {
                                featuredProducts.slice(0, 3).map(({ id, title, thumbnail, price, discountPercentage, currency, slug }) => {
                                    const finalPrice = discountPercentage ? calcluteDiscount(price, discountPercentage) : price;

                                    return (
                                        <div key={id} className='flex items-center gap-3'>
                                            <Link href={productPath({ slug })} onClick={onNavigate} className='inline-block shrink-0 overflow-hidden rounded-md bg-slate-100 group/img'>
                                                <Image width={52} height={52} sizes='100vw' src={thumbnail} alt='img' className='group-hover/img:scale-110 transition-all duration-500' />
                                            </Link>
                                            <div className='min-w-0'>
                                                <Link href={productPath({ slug })} onClick={onNavigate} className='block truncate text-sm text-gray-1-foreground hover:text-secondary-foreground transition-all duration-300 capitalize'>
                                                    {title}
                                                </Link>
                                                <p className='text-gray-1-foreground text-xs'>
                                                    {discountPercentage ? <del className='text-gray-2-foreground font-normal'>{currencyFormatter.format(price, { code: currency || 'USD' })}</del> : null} {' '}
                                                    <span>{currencyFormatter.format(finalPrice, { code: currency || 'USD' })}</span>
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    )}
                    <div className='lg:shrink-0'>
                        <div className='relative h-[150px] w-full overflow-hidden rounded-lg bg-[url("/images/header-megamenu.webp")] bg-cover bg-center lg:h-[172px] lg:w-[180px]'>
                            <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent' />
                            <div className='relative flex h-full flex-col justify-end p-4'>
                                <p className='text-[11px] text-white/80'>Special Offer</p>
                                <p className='text-base font-semibold leading-tight text-white'>
                                    Up to <span className='text-orange-400'>30% off</span>
                                </p>
                                <Button asChild size='sm' className='mt-3 w-fit text-xs uppercase'>
                                    <Link href={"/shop"} onClick={onNavigate}>Shop Now</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MegaMenu
