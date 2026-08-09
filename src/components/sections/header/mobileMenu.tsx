'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { menuType } from '@/db/menuList'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Close } from '@/lib/icon'
import { usePathname } from 'next/navigation'
import MegaMenu from './megaMenu'
import { ProductType } from '@/types/productType'
import HeaderExtraInfo from './headerExtraInfo'


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
                aria-label='toggle-btn'
                className='text-gray-1-foreground lg:hidden block p-1.5 -m-1.5 rounded-full transition-colors duration-300 hover:bg-black/[0.04] active:bg-black/[0.06]'
            >
                <List />
            </SheetTrigger>
            <SheetContent side={"left"} className='overflow-y-auto [&_.close-orginal]:hidden flex flex-col'>
                <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>

                <div className='-mx-6 -mt-6 mb-2 px-6 py-4 flex items-center justify-between border-b border-border shrink-0'>
                    <Link href={"/"} aria-label='Handsy Market home' className='shrink-0'>
                        <Image width={70} height={44} src={"/images/logo.png"} alt='logo' />
                    </Link>
                    <SheetClose
                        aria-label='Close menu'
                        className='text-gray-1-foreground w-9 h-9 rounded-full flex justify-center items-center transition-all duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground active:scale-95'
                    >
                        <Close className='w-4 h-4' />
                    </SheetClose>
                </div>

                <ul className='flex flex-col gap-1'>
                    {
                        data.map((item) => {
                            const isExpandable = Boolean(item.dropdownList || item.megaMenu)
                            const isExpanded = dropDownActive === item.id
                            return (
                                <li key={item.id} className='relative'>
                                    <div className={cn('flex items-center justify-between rounded-lg transition-colors duration-300', isExpanded && 'bg-home-bg-1')}>
                                        <Link
                                            href={item.path}
                                            className={cn(
                                                'flex-1 px-3 py-3.5 text-gray-1-foreground capitalize transition-colors duration-300 hover:text-secondary-foreground',
                                                isExpanded && 'text-secondary-foreground font-medium'
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                        {isExpandable && (
                                            <button
                                                type='button'
                                                aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                                                aria-expanded={isExpanded}
                                                onClick={() => handleDropDown(item.id, item.dropdownList, item.megaMenu)}
                                                className='p-3.5 text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300'
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
                                            <ul className='flex flex-col gap-1 pl-6 pb-1 pt-1'>
                                                {
                                                    item.dropdownList?.map((dropItem) => {
                                                        return (
                                                            <li key={dropItem.id}>
                                                                <Link
                                                                    href={dropItem.path}
                                                                    className='block rounded-lg px-3 py-2.5 text-gray-1-foreground capitalize transition-colors duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground'
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

                <div className='mt-6 pt-5 border-t border-border'>
                    <p className='text-xs uppercase tracking-wider text-gray-2-foreground mb-3'>Currency</p>
                    <HeaderExtraInfo />
                </div>
            </SheetContent>
        </Sheet>

    )
}

export default MobileMenu

const List = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12" viewBox="0 0 17 12" fill="none">
            <path d="M1 6H16M1 1H16M1 11H16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="round" />
        </svg>
    )
}
