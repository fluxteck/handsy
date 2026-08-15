'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { menuType } from '@/db/menuList'
import { ChevronDown, ChevronRight, LayoutGrid, Sofa, BedDouble, Frame, Lamp, UtensilsCrossed, Gem, Building2, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Close } from '@/lib/icon'
import { usePathname } from 'next/navigation'
import MegaMenu from './megaMenu'
import { ProductType } from '@/types/productType'
import HeaderExtraInfo from './headerExtraInfo'
import { topHeaderLinks } from './topHeader'

// Purely presentational per-category icons for the mobile drawer — menuList
// stays data-only, so unmapped labels fall back to a generic tag icon.
const categoryIcons: Record<string, React.ElementType> = {
    'Furniture': Sofa,
    'Mattresses': BedDouble,
    'Home Decor': Frame,
    'Lamps & Lighting': Lamp,
    'Kitchen & Dining': UtensilsCrossed,
    'Luxury': Gem,
    'Modular': LayoutGrid,
    'B2B': Building2,
}

const MobileMenu = ({ data, featuredProducts }: { data: menuType[], featuredProducts: ProductType[] }) => {
    const pathName = usePathname()
    const [dropDownActive, setDropDownActive] = useState<boolean | string | number>(false)
    const [open, setOpen] = useState(false)

    const handleDropDown = (id: number | string, dropdownList: any, megaMenu: any) => {
        if (dropdownList?.length || megaMenu?.length) {
            setDropDownActive(dropDownActive === id ? false : id)
        }
        else {
            setDropDownActive(false)
        }
    }

    useEffect(() => {
        setOpen(false)
        setDropDownActive(false)
    }, [pathName])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                aria-label='Menu'
                aria-expanded={open}
                className='flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-1-foreground transition-colors duration-300 hover:bg-home-bg-1 active:bg-home-bg-1 active:scale-95'
            >
                <HamburgerIcon open={open} />
            </SheetTrigger>
            <SheetContent
                side={"left"}
                className='w-[86%] sm:max-w-[380px] gap-0 border-none bg-background p-0 shadow-3xl flex flex-col [&_.close-orginal]:hidden'
            >
                <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>

                <div className='flex shrink-0 items-center justify-between border-b border-border px-5 py-4'>
                    <Link href={"/"} aria-label='Handsy Market home' className='shrink-0'>
                        <Image width={64} height={40} src={"/images/logo.png"} alt='logo' className='h-8 w-auto' />
                    </Link>
                    <SheetClose
                        aria-label='Close menu'
                        className='flex h-9 w-9 items-center justify-center rounded-full text-gray-1-foreground transition-all duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground active:scale-95'
                    >
                        <Close className='w-4 h-4' />
                    </SheetClose>
                </div>

                <div className='flex-1 min-h-0 overflow-y-auto px-5 py-5'>
                    <p className='mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-2-foreground'>Shop</p>
                    <ul className='flex flex-col gap-0.5'>
                        {
                            data.map((item) => {
                                const isExpandable = Boolean(item.dropdownList || item.megaMenu)
                                const isExpanded = dropDownActive === item.id
                                const ItemIcon = categoryIcons[item.label] ?? Tag
                                return (
                                    <li key={item.id} className='relative'>
                                        <div className={cn('flex items-center rounded-xl transition-colors duration-300', isExpanded && 'bg-home-bg-1')}>
                                            <Link
                                                href={item.path}
                                                className={cn(
                                                    'flex flex-1 items-center gap-3 rounded-xl px-2.5 py-2.5 text-gray-1-foreground transition-colors duration-300 hover:text-secondary-foreground',
                                                    isExpanded && 'text-secondary-foreground'
                                                )}
                                            >
                                                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-home-bg-2'>
                                                    <ItemIcon className='size-4' strokeWidth={1.75} />
                                                </span>
                                                <span className={cn('text-[15px] capitalize', isExpanded && 'font-medium')}>
                                                    {item.label}
                                                </span>
                                            </Link>
                                            {isExpandable && (
                                                <button
                                                    type='button'
                                                    aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                                                    aria-expanded={isExpanded}
                                                    onClick={() => handleDropDown(item.id, item.dropdownList, item.megaMenu)}
                                                    className='p-3 text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300'
                                                >
                                                    <ChevronDown
                                                        size={16}
                                                        className={cn('transition-transform duration-300', isExpanded && 'rotate-180')}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                        {item.dropdownList && (
                                            <div className={cn('overflow-hidden transition-all duration-300 ease-in-out', isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                                                <ul className='flex flex-col gap-0.5 pb-1 pt-1'>
                                                    {
                                                        item.dropdownList?.map((dropItem) => {
                                                            return (
                                                                <li key={dropItem.id}>
                                                                    <Link
                                                                        href={dropItem.path}
                                                                        className='block rounded-lg py-2.5 pl-[58px] pr-3 text-[14px] text-gray-1-foreground capitalize transition-colors duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground'
                                                                    >
                                                                        {dropItem.label}
                                                                    </Link>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        )}
                                        {item.megaMenu && (
                                            <div className={cn('overflow-hidden transition-all duration-300 ease-in-out', isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0')}>
                                                <MegaMenu data={item.megaMenu} featuredProducts={featuredProducts} />
                                            </div>
                                        )}
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <Separator className='my-5' />

                    <p className='mb-2 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-2-foreground'>Quick Links</p>
                    <ul className='flex flex-col gap-0.5'>
                        {
                            topHeaderLinks.map(({ id, icon: Icon, label, href }) => (
                                <li key={id}>
                                    <Link
                                        href={href}
                                        className='group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-gray-1-foreground transition-colors duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground'
                                    >
                                        <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A968]/10'>
                                            <Icon className='size-4 text-[#C9A968]' strokeWidth={1.75} aria-hidden />
                                        </span>
                                        <span className='flex-1 text-[15px]'>{label}</span>
                                        <ChevronRight className='size-4 shrink-0 text-gray-2-foreground transition-transform duration-300 group-hover:translate-x-0.5' aria-hidden />
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>

                    <Separator className='my-5' />

                    <p className='mb-3 px-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-2-foreground'>Currency</p>
                    <HeaderExtraInfo />
                </div>
            </SheetContent>
        </Sheet>

    )
}

export default MobileMenu

const HamburgerIcon = ({ open }: { open: boolean }) => {
    return (
        <span className='relative flex h-3.5 w-4 flex-col justify-between'>
            <span className={cn('h-[1.5px] w-full origin-center rounded-full bg-current transition-all duration-300 ease-out', open && 'translate-y-[6px] rotate-45')} />
            <span className={cn('h-[1.5px] w-full rounded-full bg-current transition-opacity duration-200 ease-out', open && 'opacity-0')} />
            <span className={cn('h-[1.5px] w-full origin-center rounded-full bg-current transition-all duration-300 ease-out', open && '-translate-y-[6px] -rotate-45')} />
        </span>
    )
}
