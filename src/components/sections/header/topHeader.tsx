'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Globe, Headphones, Package, PackageSearch, Percent, Store, Truck, Building2 } from 'lucide-react'

type PromoItem = {
    id: number
    icon: React.ElementType
    content: React.ReactNode
}

const promoItems: PromoItem[] = [
    {
        id: 1,
        icon: Truck,
        content: <>Fast &amp; Free Shipping</>,
    },
    {
        id: 2,
        icon: Percent,
        content: <>15% Off First Order - <Link href={"/login"} className='multiline-hover hover:text-[#C9A968]'>Sign Up</Link> Today</>,
    },
    {
        id: 3,
        icon: Headphones,
        content: <>Exclusive Deals for Bulk Orders</>,
    },
    {
        id: 4,
        icon: Package,
        content: <>Shop Handmade. Support Artisans.</>,
    },
    {
        id: 5,
        icon: Globe,
        content: <>Worldwide Shipping Available</>,
    },
]

export type TopHeaderLink = {
    id: number
    icon: React.ElementType
    label: string
    href: string
}

export const topHeaderLinks: TopHeaderLink[] = [
    { id: 1, icon: Store, label: 'Sell on Handsy', href: '/vendor' },
    { id: 2, icon: Building2, label: 'Handsy for Business', href: '/b2b' },
    { id: 3, icon: PackageSearch, label: 'Track Order', href: '/account/orders' },
]

const ROTATE_INTERVAL_MS = 4500

const TopHeader = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const isPausedRef = useRef(false)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const timer = setInterval(() => {
            if (!isPausedRef.current) {
                setActiveIndex((prev) => (prev + 1) % promoItems.length)
            }
        }, ROTATE_INTERVAL_MS)

        return () => clearInterval(timer)
    }, [])

    const activeItem = promoItems[activeIndex]
    const ActiveIcon = activeItem.icon

    return (
        <div className='bg-home-bg-1 border-b border-b-[#C9A968]/20'>
            <div className='container flex flex-col lg:flex-row items-center lg:justify-between gap-1 lg:gap-4 py-1.5 lg:h-7 lg:py-0'>
                <nav aria-label="Seller and order links" className='hidden lg:block lg:w-auto overflow-x-auto scrollbar-hidden'>
                    <ul className='flex items-center justify-center lg:justify-start gap-4 lg:gap-6 whitespace-nowrap'>
                        {topHeaderLinks.map(({ id, icon: Icon, label, href }) => (
                            <li key={id} className='shrink-0'>
                                <Link
                                    href={href}
                                    className='flex items-center gap-1.5 text-[11px] lg:text-xs uppercase tracking-[0.12em] font-medium text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300'
                                >
                                    <Icon className='size-3.5 text-black shrink-0' strokeWidth={1.75} aria-hidden />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div
                    className='w-full lg:w-auto lg:max-w-xs flex items-center justify-center lg:justify-end overflow-hidden min-w-0'
                    onPointerEnter={() => { isPausedRef.current = true }}
                    onPointerLeave={() => { isPausedRef.current = false }}
                    onTouchStart={() => { isPausedRef.current = true }}
                    onTouchEnd={() => { isPausedRef.current = false }}
                >
                    <p
                        key={activeItem.id}
                        className='flex items-center gap-1.5 text-[11px] lg:text-xs uppercase tracking-[0.12em] font-medium leading-[150%] text-gray-1-foreground min-w-0 animate-in fade-in slide-in-from-top-1 duration-500 fill-mode-both'
                    >
                        <ActiveIcon className='size-3.5 text-black shrink-0' strokeWidth={1.75} />
                        <span className='truncate'>{activeItem.content}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TopHeader
