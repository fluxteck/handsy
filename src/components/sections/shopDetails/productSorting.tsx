'use client'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { GridView, List } from '@/lib/icon'
import type { SortKey } from '@/lib/catalog/filters'

/** The catalogue's sort choices — the default when a page passes none. */
const productSortOptions: { value: SortKey; label: string }[] = [
    { value: 'default', label: 'Default sorting' },
    { value: 'popularity', label: 'Sort by popularity' },
    { value: 'average', label: 'Sort by average rating' },
    { value: 'latest', label: 'Sort by Latest' },
    { value: 'low-to-high', label: 'Sort by price: low to high' },
    { value: 'high-to-low', label: 'Sort by price: high to low' },
]

interface Props<S extends string = SortKey> {
    isGridView: boolean,
    setIsGridView?: React.Dispatch<React.SetStateAction<boolean>>
    /** Current sort key. */
    sort?: S
    onSortChange?: (value: S) => void
    /** Sort choices; defaults to the catalogue's. */
    sortOptions?: { value: S; label: string }[]
    /** Rendered at the start of the row — the listing's Filter drawer trigger. */
    filterSlot?: React.ReactNode
}
const ProductSorting = <S extends string = SortKey>({ isGridView, setIsGridView, sort, onSortChange, sortOptions, filterSlot }: Props<S>) => {
    const options = sortOptions ?? (productSortOptions as { value: S; label: string }[])
    return (
        <div className='flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-5'>
            <div>{filterSlot}</div>
            <div className='flex items-center gap-3 sm:gap-5'>
                {setIsGridView && (
                    <>
                        <div className={` ${isGridView ? 'text-secondary-foreground' : 'text-[#999796]'} cursor-pointer`} onClick={() => setIsGridView && setIsGridView(true)}>
                            <GridView />
                        </div>
                        <div className={` ${isGridView ? 'text-[#999796]' : 'text-secondary-foreground'} cursor-pointer`} onClick={() => setIsGridView && setIsGridView(false)}>
                            <List />
                        </div>
                    </>
                )}
                <div>
                    <Select value={sort} onValueChange={onSortChange ? (v) => onSortChange(v as S) : undefined}>
                        <SelectTrigger className="border-none rounded-sm bg-home-bg-1 text-gray-1-foreground py-2 text-sm sm:text-base leading-[162%] min-w-[132px] sm:min-w-[218px]">
                            <SelectValue placeholder={options[0]?.label} />
                        </SelectTrigger>
                        <SelectContent className='text-gray-1-foreground bg-home-bg-1 rounded-sm p-0'>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value} className='rounded-sm focus:bg-primary focus:text-white'>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default ProductSorting
