import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Email } from '@/lib/icon'
import { cn } from '@/lib/utils'
import React from 'react'

const Newsletter = ({ className }: { className?: string }) => {
    return (
        <div className={cn('bg-home-bg-1 py-7.5 lg:py-10', className)}>
            <div className='container'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-8 rounded-2xl border border-gray-2 bg-background px-6 py-6 lg:px-10 lg:py-7 shadow-3xl'>
                    <div className='flex items-center gap-4'>
                        <span className='hidden sm:flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                            <Email className='size-4.5' />
                        </span>
                        <div>
                            <p className='text-lg lg:text-xl font-medium leading-tight text-secondary-foreground'>
                                Subscribe &amp; grab <span className='font-display italic'>30% off</span>
                            </p>
                            <p className='mt-1 text-sm text-gray-1-foreground'>Fresh arrivals and offers, straight to your inbox.</p>
                        </div>
                    </div>
                    <form className='relative w-full lg:w-auto lg:min-w-[360px]'>
                        <Input placeholder='Your email address' required className='placeholder:text-[#565959] font-medium text-sm border-gray-2 pl-4 pr-[5px] py-1 h-11 lg:h-12 w-full rounded-full' />
                        <Button
                            type='submit'
                            className='absolute right-1 top-1/2 -translate-y-1/2 max-h-9 lg:max-h-10 px-4 lg:px-5 py-2 text-sm tracking-[-0.2px]'
                        >
                            Subscribe
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Newsletter