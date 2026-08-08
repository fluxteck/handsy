'use client'
import React from 'react'
import Link from 'next/link'
import { Heart, IcHome, ShopBug, User } from '@/lib/icon'
import { usePathname } from 'next/navigation'

const navItems = [
    { href: '/', label: 'Home', icon: IcHome },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/shop', label: 'Shop', icon: ShopBug },
    { href: '/login', label: 'Account', icon: User },
]

const MobileNavbar = () => {
    const pathName = usePathname()
    const currentPathname = pathName.length > 1 && pathName.endsWith('/')
        ? pathName.substring(0, pathName.length - 1)
        : pathName

    return (
        <div className='fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 lg:hidden'>
            <div className='flex items-center justify-between gap-1 rounded-2xl border border-border/60 bg-home-bg-1/95 px-2 py-1.5 shadow-3xl backdrop-blur-md'>
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = currentPathname === href
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
                            <Icon className={isActive ? 'size-[18px]' : 'size-[18px] transition-transform duration-200 group-hover:scale-110'} />
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
