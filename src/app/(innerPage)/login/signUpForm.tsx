'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppleIcon, GoogleIcon } from '@/lib/icon'
import { Gift, Heart, Truck } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { signUpUser } from './actions'
import { SOCIAL_LOGIN_ENABLED } from './config'
import TrustBadges from './trustBadges'

const signUpBenefits = [
    { icon: Truck, label: 'Fast & free shipping on every order' },
    { icon: Heart, label: 'Save favourites to your Wishlist' },
    { icon: Gift, label: 'Early access to member-only offers' },
]

// Same recipe as the site's original login/register inputs (border-[#999796], gray-1-foreground
// text) — kept identical so this page reads as part of the marketplace, not a new surface.
const inputClass =
    'py-3 px-4 h-auto rounded-xl border-[#999796] border-[1.5px] placeholder:text-[#999796] text-gray-1-foreground focus-visible:ring-primary/20 focus-visible:ring-1'

const SignUpForm = ({ onSignedUp }: { onSignedUp: (email: string) => void }) => {
    const [state, formAction, isPending] = useActionState(signUpUser, null)

    useEffect(() => {
        if (state?.status === 'success' && state.email) {
            toast.success(state.message)
            onSignedUp(state.email)
        }
    }, [state, onSignedUp])

    const handleSocialClick = (provider: string) => {
        toast.error(`${provider} sign-in isn't connected yet.`)
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold text-secondary-foreground">Create an account</h1>

            <form action={formAction} className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="signup-name" className="sr-only">Name</Label>
                    <Input
                        id="signup-name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        required
                        className={inputClass}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="signup-email" className="sr-only">Email</Label>
                    <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className={inputClass}
                    />
                </div>

                {state?.status === 'error' && (
                    <p className="text-sm text-red-500">{state.message}</p>
                )}

                <Button type="submit" disabled={isPending} className="mt-1 w-full disabled:opacity-70">
                    {isPending ? 'Creating account…' : 'Create an account'}
                </Button>
            </form>

            {SOCIAL_LOGIN_ENABLED ? (
                <>
                    <div className="mt-7 flex items-center gap-4">
                        <span className="h-px flex-1 bg-[#999796]" />
                        <span className="text-xs uppercase tracking-wide text-gray-1-foreground">Or sign in with</span>
                        <span className="h-px flex-1 bg-[#999796]" />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialClick('Google')}
                            className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#999796] bg-background py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:bg-home-bg-1"
                        >
                            <GoogleIcon className="size-5" />
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialClick('Apple')}
                            className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#999796] bg-background py-2.5 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:bg-home-bg-1"
                        >
                            <AppleIcon className="size-[18px]" />
                            Apple
                        </button>
                    </div>
                </>
            ) : (
                <div className="mt-7 border-t border-[#999796]/40 pt-6">
                    <TrustBadges items={signUpBenefits} />
                </div>
            )}

            <p className="mt-6 text-center text-xs text-gray-1-foreground">
                By creating an account, you agree to our{' '}
                <a href="/terms-conditions" className="text-secondary-foreground underline underline-offset-2 hover:text-primary">
                    Terms &amp; Service
                </a>
                .
            </p>
        </div>
    )
}

export default SignUpForm
