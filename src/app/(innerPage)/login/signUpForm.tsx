'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppleIcon, GoogleIcon } from '@/lib/icon'
import { Gift, Heart, Truck } from 'lucide-react'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { requestEmailOtp } from '@/lib/auth/otp'
import { SOCIAL_LOGIN_ENABLED } from './config'
import TrustBadges from './trustBadges'

const signUpBenefits = [
    { icon: Truck, label: 'Free Shipping' },
    { icon: Heart, label: 'Save Favourites' },
    { icon: Gift, label: 'Member Offers' },
]

/**
 * Sign-up is the same one-time-code flow as sign-in — there is no password to
 * choose and no account to "create" up front. Submitting emails a code; the
 * account is created by Supabase when that code is verified on the Sign-in
 * tab, which is where the handoff below lands the customer.
 */
const SignUpForm = ({
    onSignedUp,
}: {
    onSignedUp: (email: string, name: string) => void
}) => {
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()

    const formAction = (formData: FormData) => {
        const name = String(formData.get('name') ?? '').trim()
        const email = String(formData.get('email') ?? '').trim()
        setError('')
        startTransition(async () => {
            const res = await requestEmailOtp(email, { createIfNew: true })
            if (res.status === 'error') {
                setError(res.message)
                toast.error(res.message)
                return
            }
            toast.success(res.message)
            onSignedUp(email, name)
        })
    }

    const handleSocialClick = (provider: string) => {
        toast.error(`${provider} sign-in isn't connected yet.`)
    }

    return (
        <div>
            <h1 className="text-xl font-medium text-secondary-foreground lg:text-2xl">Create an account</h1>

            <form action={formAction} className="mt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                        id="signup-name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        required
                        autoComplete="name"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <Button type="submit" disabled={isPending} className="mt-1 w-full">
                    {isPending ? 'Creating account…' : 'Create an account'}
                </Button>
            </form>

            {SOCIAL_LOGIN_ENABLED ? (
                <>
                    <div className="mt-7 flex items-center gap-4">
                        <span className="h-px flex-1 bg-gray-2" />
                        <span className="text-xs uppercase tracking-wide text-gray-1-foreground">Or sign in with</span>
                        <span className="h-px flex-1 bg-gray-2" />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialClick('Google')}
                            className="flex items-center justify-center gap-2 rounded-full border border-gray-2 bg-background py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:border-primary hover:shadow-sm"
                        >
                            <GoogleIcon className="size-5" />
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialClick('Apple')}
                            className="flex items-center justify-center gap-2 rounded-full border border-gray-2 bg-background py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:border-primary hover:shadow-sm"
                        >
                            <AppleIcon className="size-[18px]" />
                            Apple
                        </button>
                    </div>
                </>
            ) : (
                <div className="mt-4 border-t border-gray-2 pt-4">
                    <TrustBadges items={signUpBenefits} />
                </div>
            )}

            <div className="mt-4 border-t border-gray-2 pt-4 text-center text-[11px] text-gray-3-foreground">
                By creating an account, you agree to our{' '}
                <a href="/terms-conditions" className="text-secondary-foreground underline underline-offset-2 hover:text-primary">
                    Terms &amp; Service
                </a>
                .
            </div>
        </div>
    )
}

export default SignUpForm
