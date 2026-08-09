'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OtpInput } from '@/components/ui/otp-input'
import { AppleIcon, ArrowLeft, GoogleIcon } from '@/lib/icon'
import { Headphones, RotateCcw, ShieldCheck } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { sendOtp, verifyOtp } from './actions'
import { SOCIAL_LOGIN_ENABLED } from './config'
import TrustBadges from './trustBadges'

// Same recipe as the site's original login/register inputs (border-[#999796], gray-1-foreground
// text) — kept identical so this page reads as part of the marketplace, not a new surface.
const inputClass =
    'py-3 px-4 h-auto rounded-xl border-[#999796] border-[1.5px] placeholder:text-[#999796] text-gray-1-foreground focus-visible:ring-primary/20 focus-visible:ring-1'

const signInReassurance = [
    { icon: ShieldCheck, label: 'Your email is kept private & secure' },
    { icon: RotateCcw, label: 'Hassle-free returns & exchanges' },
    { icon: Headphones, label: '24/7 customer support, whenever you need it' },
]

const RESEND_SECONDS = 30

const SignInForm = ({ initialEmail = '' }: { initialEmail?: string }) => {
    const [step, setStep] = useState<'email' | 'otp' | 'success'>('email')
    const [email, setEmail] = useState(initialEmail)
    const [otpToken, setOtpToken] = useState('')
    const [code, setCode] = useState<string[]>(Array(6).fill(''))
    const [error, setError] = useState('')
    const [resendIn, setResendIn] = useState(0)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        setEmail(initialEmail)
    }, [initialEmail])

    useEffect(() => {
        if (resendIn <= 0) return
        const timer = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
        return () => clearInterval(timer)
    }, [resendIn])

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        startTransition(async () => {
            const res = await sendOtp(email)
            if (res.status === 'error') {
                setError(res.message)
                return
            }
            setOtpToken(res.otpToken)
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
            const res = await sendOtp(email)
            if (res.status === 'error') {
                setError(res.message)
                return
            }
            setOtpToken(res.otpToken)
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
            return
        }
        startTransition(async () => {
            const res = await verifyOtp({ email, code: joined, otpToken })
            if (res.status === 'error') {
                setError(res.message)
                return
            }
            toast.success(res.message)
            setStep('success')
        })
    }

    const handleSocialClick = (provider: string) => {
        toast.error(`${provider} sign-in isn't connected yet.`)
    }

    if (step === 'success') {
        return (
            <div className="py-6 text-center">
                <h1 className="text-2xl font-semibold text-secondary-foreground">You're signed in</h1>
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

                <h1 className="mt-4 text-2xl font-semibold text-secondary-foreground">Enter the code</h1>
                <p className="mt-1.5 text-sm text-gray-1-foreground">We sent a 6-digit code to {email}.</p>

                <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-4">
                    <OtpInput
                        value={code}
                        onChange={setCode}
                        disabled={isPending}
                        inputClassName="border-[#999796] border-[1.5px] bg-background text-secondary-foreground focus:border-primary focus:ring-primary/20"
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" disabled={isPending} className="mt-1 w-full disabled:opacity-70">
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
            <h1 className="text-2xl font-semibold text-secondary-foreground">Sign in with email</h1>
            <p className="mt-1.5 text-sm text-gray-1-foreground">We'll email you a one-time code — no password needed.</p>

            <form onSubmit={handleSendOtp} className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="signin-email" className="sr-only">Email</Label>
                    <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" disabled={isPending} className="mt-1 w-full disabled:opacity-70">
                    {isPending ? 'Sending code…' : 'Send code'}
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
                    <TrustBadges items={signInReassurance} />
                </div>
            )}
        </div>
    )
}

export default SignInForm
