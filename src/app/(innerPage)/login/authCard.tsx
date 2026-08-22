'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Close } from '@/lib/icon'
import Link from 'next/link'
import { useState } from 'react'
import SignInForm from './signInForm'
import SignUpForm from './signUpForm'

const AuthCard = () => {
    const [tab, setTab] = useState<'signup' | 'signin'>('signup')
    const [prefillEmail, setPrefillEmail] = useState('')
    // Set only when arriving from the Sign-up tab, which has already emailed
    // the code — the Sign-in tab then opens straight on the code entry.
    const [prefillName, setPrefillName] = useState('')
    const [startAtOtp, setStartAtOtp] = useState(false)

    return (
        <div className="relative w-full max-w-[400px] rounded-2xl border border-gray-2 bg-background p-5 shadow-sm lg:p-6">
            <Link
                href="/"
                aria-label="Close"
                className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-full text-gray-1-foreground transition-colors duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground"
            >
                <Close className="size-4" strokeWidth="1.5" />
            </Link>

            <Tabs value={tab} onValueChange={(value) => setTab(value as 'signup' | 'signin')}>
                <TabsList className="grid w-fit grid-cols-2 gap-1 rounded-full bg-home-bg-2 p-1">
                    <TabsTrigger
                        value="signup"
                        className="rounded-full px-5 py-2 text-sm capitalize font-medium text-gray-1-foreground transition-all duration-300 md:text-sm lg:text-sm data-[state=active]:bg-background data-[state=active]:text-secondary-foreground data-[state=active]:shadow-sm"
                    >
                        Sign up
                    </TabsTrigger>
                    <TabsTrigger
                        value="signin"
                        className="rounded-full px-5 py-2 text-sm capitalize font-medium text-gray-1-foreground transition-all duration-300 md:text-sm lg:text-sm data-[state=active]:bg-background data-[state=active]:text-secondary-foreground data-[state=active]:shadow-sm"
                    >
                        Sign in
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="mt-6">
                    <SignUpForm
                        onSignedUp={(email, name) => {
                            setPrefillEmail(email)
                            setPrefillName(name)
                            setStartAtOtp(true)
                            setTab('signin')
                        }}
                    />
                </TabsContent>
                <TabsContent value="signin" className="mt-6">
                    <SignInForm
                        initialEmail={prefillEmail}
                        initialName={prefillName}
                        startAtOtp={startAtOtp}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AuthCard
