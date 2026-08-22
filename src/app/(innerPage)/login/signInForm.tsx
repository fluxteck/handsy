'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OtpInput } from '@/components/ui/otp-input'
import { AppleIcon, ArrowLeft, GoogleIcon } from '@/lib/icon'
import { Headphones, RotateCcw, ShieldCheck } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { requestEmailOtp, setDisplayName, verifyEmailOtp } from '@/lib/auth/otp'
import { SOCIAL_LOGIN_ENABLED } from './config'
import TrustBadges from './trustBadges'

const signInReassurance = [
    { icon: ShieldCheck, label: 'Secure & Private' },
    { icon: RotateCcw, label: 'Easy Returns' },
    { icon: Headphones, label: '24/7 Support' },
]

const RESEND_SECONDS = 30

/**
 * Where to land after signing in. Middleware sends guests to
 * `/login?from=<path>`, so honour that and drop them back where they were
 * headed. Read from `window.location` rather than `useSearchParams` so the
 * login page can still be statically prerendered without a Suspense boundary.
 * Only same-origin paths are accepted — an absolute URL here would be an open
 * redirect.
 */
const resolveRedirect = (): string => {
    if (typeof window === 'undefined') return '/account'
    const from = new URLSearchParams(window.location.search).get('from')
    return from && from.startsWith('/') && !from.startsWith('//') ? from : '/account'
}

/**
 * `startAtOtp` lets the Sign-up tab hand over mid-flow: it has already emailed
 * the code, so landing the customer on the email step again would send a
 * second one. `initialName` is applied to the profile once verification
 * succeeds — the account itself is created by Supabase on verify.
 */
const SignInForm = ({
    initialEmail = '',
    initialName = '',
    startAtOtp = false,
}: {
    initialEmail?: string
    initialName?: string
    startAtOtp?: boolean
}) => {
    const [step, setStep] = useState<'email' | 'otp' | 'success'>(
        startAtOtp && initialEmail ? 'otp' : 'email',
    )
    const [email, setEmail] = useState(initialEmail)
    const [code, setCode] = useState<string[]>(Array(6).fill(''))
    const [error, setError] = useState('')
    const [resendIn, setResendIn] = useState(startAtOtp && initialEmail ? RESEND_SECONDS : 0)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    useEffect(() => {
        setEmail(initialEmail)
        if (startAtOtp && initialEmail) {
            setStep('otp')
            setCode(Array(6).fill(''))
            setResendIn(RESEND_SECONDS)
        }
    }, [initialEmail, startAtOtp])

    useEffect(() => {
        if (resendIn <= 0) return
        const timer = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
        return () => clearInterval(timer)
    }, [resendIn])

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        startTransition(async () => {
            const res = await requestEmailOtp(email)
            if (res.status === 'error') {
                setError(res.message)
                toast.error(res.message)
                return
            }
            setCode(Array(6).fill(''))
            setStep('otp')
            setResendIn(RESEND_SECONDS)
            toast.success(res.message)
        })
    }

    const handleResend = () => {
        if (resendIn > 0 || isPending) return
        setError('')
        startTransition(async () => {
            const res = await requestEmailOtp(email)
            if (res.status === 'error') {
                setError(res.message)
                toast.error(res.message)
                return
            }
            setCode(Array(6).fill(''))
            setResendIn(RESEND_SECONDS)
            toast.success('New code sent.')
        })
    }

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        const joined = code.join('')
        if (joined.length < 6) {
            setError('Enter all 6 digits.')
            toast.error('Enter all 6 digits.')
            return
        }
        startTransition(async () => {
            const res = await verifyEmailOtp(email, joined)
            if (res.status === 'error') {
                setError(res.message)
                toast.error(res.message)
                return
            }
            if (initialName) await setDisplayName(initialName)
            toast.success(res.message)
            setStep('success')
            // The session cookie exists now. Refresh so server components
            // re-render as signed in, then honour the `?from=` middleware set
            // when it bounced the customer here — the success copy promises a
            // redirect, so actually perform one.
            router.refresh()
            router.replace(resolveRedirect())
        })
    }

    const handleSocialClick = (provider: string) => {
        toast.error(`${provider} sign-in isn't connected yet.`)
    }

    if (step === 'success') {
        return (
            <div className="py-6 text-center">
                <h1 className="text-xl font-medium text-secondary-foreground lg:text-2xl">You&apos;re signed in</h1>
                <p className="mt-2 text-sm text-gray-1-foreground">Welcome back — redirecting you to your account.</p>
                <Button asChild className="mt-6 w-full">
                    <a href="/account">Go to My Account</a>
                </Button>
            </div>
        )
    }

    if (step === 'otp') {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => { setStep('email'); setError('') }}
                    className="flex items-center gap-1.5 text-sm text-gray-1-foreground transition-colors duration-300 hover:text-secondary-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </button>

                <h1 className="mt-4 text-xl font-medium text-secondary-foreground lg:text-2xl">Enter the code</h1>
                <p className="mt-1.5 text-sm text-gray-1-foreground">We sent a 6-digit code to {email}.</p>

                <form onSubmit={handleVerify} className="mt-5 flex flex-col gap-4">
                    <OtpInput
                        value={code}
                        onChange={setCode}
                        disabled={isPending}
                        inputClassName="border border-gray-2 bg-background text-secondary-foreground focus:border-primary focus:ring-primary/20"
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" disabled={isPending} className="mt-1 w-full">
                        {isPending ? 'Verifying…' : 'Verify & Sign In'}
                    </Button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-1-foreground">
                    Didn&apos;t get a code?{' '}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendIn > 0 || isPending}
                        className="font-medium text-secondary-foreground underline underline-offset-2 disabled:cursor-not-allowed disabled:text-gray-3-foreground disabled:no-underline"
                    >
                        {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
                    </button>
                </p>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-xl font-medium text-secondary-foreground lg:text-2xl">Sign in with email</h1>
            <p className="mt-1.5 text-sm text-gray-1-foreground">We&apos;ll email you a one-time code — no password needed.</p>

            <form onSubmit={handleSendOtp} className="mt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" disabled={isPending} className="mt-1 w-full">
                    {isPending ? 'Sending code…' : 'Send code'}
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
                    <TrustBadges items={signInReassurance} />
                </div>
            )}
        </div>
    )
}

export default SignInForm
