'use client'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { GridView, List, Search } from '@/lib/icon'
import type { SortKey } from '@/lib/catalog/filters'

interface Props {
    isGridView: boolean,
    setIsGridView?: React.Dispatch<React.SetStateAction<boolean>>
    /** Current search term, from the URL. Uncontrolled when omitted. */
    searchTerm?: string
    /** Current sort key, from the URL. */
    sort?: SortKey
    /** Called on submit (Enter) — debouncing every keystroke into the URL
     *  would push a history entry per character. */
    onSearch?: (value: string) => void
    onSortChange?: (value: SortKey) => void
}
const ProductSorting = ({ isGridView, setIsGridView, searchTerm, sort, onSearch, onSortChange }: Props) => {
    const [term, setTerm] = useState(searchTerm ?? '')

    // Keep in step when the URL changes underneath us (back/forward, or a
    // filter elsewhere resetting the query).
    useEffect(() => { setTerm(searchTerm ?? '') }, [searchTerm])

    return (
        <div className='flex flex-wrap sm:flex-nowrap items-center justify-between gap-5'>
            <div className='relative max-w-[330px] w-full'>
                <Input
                    placeholder='Search Products'
                    className='px-5 py-2 border-[#999796] text-gray-1-foreground'
                    value={onSearch ? term : undefined}
                    onChange={onSearch ? (e) => setTerm(e.target.value) : undefined}
                    onKeyDown={onSearch ? (e) => { if (e.key === 'Enter') onSearch(term) } : undefined}
                />
                <div
                    className='absolute top-1/2 -translate-y-1/2 right-5 text-gray-1-foreground'
                    onClick={onSearch ? () => onSearch(term) : undefined}
                    role={onSearch ? 'button' : undefined}
                    aria-label={onSearch ? 'Search products' : undefined}
                >
                    <Search />
                </div>
            </div>
            <div className='flex items-center gap-5'>
                <div className={` ${isGridView ? 'text-secondary-foreground' : 'text-[#999796]'} cursor-pointer`} onClick={() => setIsGridView && setIsGridView(true)}>
                    <GridView />
                </div>
                <div className={` ${isGridView ? 'text-[#999796]' : 'text-secondary-foreground'} cursor-pointer`} onClick={() => setIsGridView && setIsGridView(false)}>
                    <List />
                </div>
                <div>
                    <Select value={sort} onValueChange={onSortChange ? (v) => onSortChange(v as SortKey) : undefined}>
                        <SelectTrigger className="border-none rounded-sm bg-home-bg-1 text-gray-1-foreground py-2 text-base leading-[162%] min-w-[218px]">
                            <SelectValue placeholder="Default sorting" />
                        </SelectTrigger>
                        <SelectContent className='text-gray-1-foreground bg-home-bg-1 rounded-sm p-0'>
                            <SelectItem value="default" className='rounded-sm focus:bg-primary focus:text-white'>Default sorting</SelectItem>
                            <SelectItem value="popularity" className='rounded-sm focus:bg-primary focus:text-white'>Sort by popularity</SelectItem>
                            <SelectItem value="average" className='rounded-sm focus:bg-primary focus:text-white'>Sort by average rating</SelectItem>
                            <SelectItem value="latest" className='rounded-sm focus:bg-primary focus:text-white'>Sort by Latest</SelectItem>
                            <SelectItem value="low-to-high" className='rounded-sm focus:bg-primary focus:text-white'>Sort by price: low to high</SelectItem>
                            <SelectItem value="high-to-low" className='rounded-sm focus:bg-primary focus:text-white'>Sort by price: high to low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default ProductSorting
