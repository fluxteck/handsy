'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Headphones, Percent, Truck } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

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
        content: <>15% Off First Order - <Link href={"/register"} className='multiline-hover hover:text-[#C9A968] transition-colors duration-500'>Sign Up</Link> Today</>,
    },
    {
        id: 3,
        icon: Headphones,
        content: <>24/7 Customer Support</>,
    },
]

const ROTATE_INTERVAL_MS = 4000

const PromoMessage = ({
    icon: Icon,
    children,
    delay = 0,
}: {
    icon: React.ElementType
    children: React.ReactNode
    delay?: number
}) => (
    <p
        style={{ animationDelay: `${delay}ms` }}
        className='group flex items-center gap-1.5 text-[11px] lg:text-xs uppercase tracking-[0.12em] font-medium leading-[150%] text-gray-1-foreground shrink-0 animate-in fade-in slide-in-from-top-1 duration-500 fill-mode-both'
    >
        <Icon
            className='size-3.5 text-[#C9A968] shrink-0 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-px'
            strokeWidth={1.75}
        />
        {children}
    </p>
)

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

    const pause = () => { isPausedRef.current = true }
    const resume = () => { isPausedRef.current = false }

    const activeItem = promoItems[activeIndex]

    return (
        <div className='relative overflow-hidden bg-home-bg-1 border-b border-b-[#C9A968]/20'>
            <div
                aria-hidden
                className='promo-shimmer animate-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#C9A968]/10 to-transparent'
            />
            <div className='container'>
                {/* Desktop / tablet: full horizontal row */}
                <div className='hidden lg:flex items-center justify-center gap-8 h-8'>
                    {promoItems.map(({ id, icon, content }, index) => (
                        <React.Fragment key={id}>
                            <PromoMessage icon={icon} delay={index * 150}>{content}</PromoMessage>
                            {index < promoItems.length - 1 && (
                                <Separator orientation="vertical" className='bg-[#C9A968]/25 data-[orientation=vertical]:h-3 shrink-0' />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Mobile: one message at a time, auto-rotating */}
                <div
                    className='lg:hidden flex items-center justify-center text-center px-6 py-2 min-h-9'
                    onPointerEnter={pause}
                    onPointerLeave={resume}
                    onTouchStart={pause}
                    onTouchEnd={resume}
                >
                    <PromoMessage key={activeItem.id} icon={activeItem.icon}>
                        {activeItem.content}
                    </PromoMessage>
                </div>
            </div>
        </div>
    )
}

export default TopHeader
