"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Email } from '@/lib/icon'
import { cn } from '@/lib/utils'
import { useNewsletter } from '@commercekitsdk/react'
import React from 'react'
import toast from 'react-hot-toast'

const Newsletter = ({ className, source = 'footer' }: { className?: string; source?: string }) => {
    /* The SDK hook owns the whole submit lifecycle — pending, success, error —
       so this component only has to read `isSubmitting` and say what happened.
       Signing up is idempotent server-side, so a repeat submission is a
       success rather than something the visitor has to understand. */
    const { subscribe, isSubmitting } = useNewsletter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = new FormData(form).get('email');
        const result = await subscribe({ email: String(email ?? ''), source });
        if (result.ok) {
            toast.success("You're subscribed — watch your inbox.");
            form.reset();
        } else {
            /* The error comes back from the call, not from `error` state: this
               closure was created by the previous render and cannot see the
               state the call just set. */
            toast.error(result.error.message || "We couldn't sign you up just now. Please try again.");
        }
    };

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
                    <form onSubmit={handleSubmit} className='relative w-full lg:w-auto lg:min-w-[360px]'>
                        <Input name='email' type='email' placeholder='Your email address' required className='placeholder:text-[#565959] font-medium text-sm border-gray-2 pl-4 pr-[5px] py-1 h-11 lg:h-12 w-full rounded-full' />
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='absolute right-1 top-1/2 -translate-y-1/2 max-h-9 lg:max-h-10 px-4 lg:px-5 py-2 text-sm tracking-[-0.2px]'
                        >
                            {isSubmitting ? 'Subscribing…' : 'Subscribe'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Newsletter
