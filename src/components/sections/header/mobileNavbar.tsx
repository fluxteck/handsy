'use client'
import React from 'react'
import Link from 'next/link'
import { Heart, IcHome, ShopBug, Shuffle, User } from '@/lib/icon'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/reduxHooks'

const navItems = [
    { href: '/', label: 'Home', icon: IcHome },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/shop', label: 'Shop', icon: ShopBug },
    /* Compare sits beside Wishlist because they are the same kind of thing —
       a shortlist the shopper is building — and because the compare icon on a
       product card previously led nowhere at all on a phone. */
    { href: '/compare', label: 'Compare', icon: Shuffle },
    { href: '/account', label: 'Account', icon: User },
]

const MobileNavbar = () => {
    const pathName = usePathname()
    // The count comes from localStorage, so it is only correct after mount;
    // rendering it on the server would be a hydration mismatch.
    const [isClient, setIsClient] = useState(false)
    useEffect(() => setIsClient(true), [])
    const compareCount = useAppSelector((state) => state.productCompare.products.length)

    const currentPathname = pathName.length > 1 && pathName.endsWith('/')
        ? pathName.substring(0, pathName.length - 1)
        : pathName

    return (
        <div className='fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 lg:hidden'>
            <div className='flex items-center justify-between gap-1 rounded-full border border-border/60 bg-home-bg-1/95 px-2 py-1.5 backdrop-blur-md'>
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = href === '/account'
                        ? currentPathname === href || currentPathname.startsWith(`${href}/`)
                        : currentPathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`group flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-all duration-200 ease-out active:scale-90 ${
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-gray-1-foreground hover:bg-secondary hover:text-primary'
                            }`}
                        >
                            <span className='relative'>
                                <Icon className={isActive ? 'size-[18px]' : 'size-[18px] transition-transform duration-200 group-hover:scale-110'} />
                                {href === '/compare' && isClient && compareCount > 0 && (
                                    <span className='absolute -right-2 -top-1.5 flex size-[14px] items-center justify-center rounded-full bg-primary text-[9px] text-white'>
                                        {compareCount}
                                    </span>
                                )}
                            </span>
                            <span className={`text-[10px] leading-none tracking-wide transition-opacity duration-200 ${isActive ? 'font-medium opacity-100' : 'font-normal opacity-80'}`}>
                                {label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default MobileNavbar
