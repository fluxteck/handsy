import { ChevronLeft, ChevronRight } from '@/lib/icon'
import React from 'react'

/**
 * Numbered pager.
 *
 * Works against the catalogue because the server's `cursor` is really a
 * numeric offset, so any page can be addressed directly rather than only
 * stepped through. Without props it renders the original static markup, which
 * the pages still on sample data rely on.
 *
 * Long result sets are windowed to five numbers around the current page so the
 * row never wraps; the arrows still reach the ends.
 */
const WINDOW = 5

function pageWindow(current: number, total: number): number[] {
    const half = Math.floor(WINDOW / 2)
    let start = Math.max(1, current - half)
    const end = Math.min(total, start + WINDOW - 1)
    start = Math.max(1, end - WINDOW + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

const inactive = 'bg-[#F2F2F2] hover:bg-primary hover:text-white transition-all duration-500 text-gray-1-foreground font-medium w-10 h-10 rounded-full flex items-center justify-center cursor-pointer'
const active = 'bg-primary text-white hover:bg-primary hover:text-white transition-all font-medium w-10 h-10 rounded-full flex items-center justify-center cursor-pointer'
const arrow = 'bg-[#F2F2F2] hover:bg-primary hover:text-white transition-all duration-500 text-gray-1-foreground font-medium w-10 h-10 rounded-full flex items-center justify-center cursor-pointer'
const arrowDisabled = 'bg-[#F2F2F2] text-gray-3-foreground font-medium w-10 h-10 rounded-full flex items-center justify-center cursor-not-allowed opacity-50'

const Pagination = ({
    page,
    totalPages,
    onPageChange,
}: {
    page?: number
    totalPages?: number
    onPageChange?: (page: number) => void
} = {}) => {
    // Uncontrolled: the original static markup, for pages not yet wired up.
    if (page === undefined || totalPages === undefined) {
        return (
            <ul className='flex gap-2.5 mt-15'>
                <li className={arrow}><ChevronLeft className='size-6' /></li>
                <li className={active}>1</li>
                <li className={inactive}>2</li>
                <li className={inactive}>3</li>
                <li className={inactive}>4</li>
                <li className={arrow}><ChevronRight className='size-6' /></li>
            </ul>
        )
    }

    const go = (next: number) => {
        if (!onPageChange) return
        if (next < 1 || next > totalPages || next === page) return
        onPageChange(next)
    }

    return (
        <ul className='flex gap-2.5 mt-15'>
            <li
                className={page <= 1 ? arrowDisabled : arrow}
                onClick={() => go(page - 1)}
                role='button'
                aria-label='Previous page'
                aria-disabled={page <= 1}
            >
                <ChevronLeft className='size-6' />
            </li>
            {pageWindow(page, totalPages).map((n) => (
                <li
                    key={n}
                    className={n === page ? active : inactive}
                    onClick={() => go(n)}
                    role='button'
                    aria-label={`Page ${n}`}
                    aria-current={n === page ? 'page' : undefined}
                >
                    {n}
                </li>
            ))}
            <li
                className={page >= totalPages ? arrowDisabled : arrow}
                onClick={() => go(page + 1)}
                role='button'
                aria-label='Next page'
                aria-disabled={page >= totalPages}
            >
                <ChevronRight className='size-6' />
            </li>
        </ul>
    )
}

export default Pagination
