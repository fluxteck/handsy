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

    return (
        <div className="relative w-full max-w-[400px] rounded-3xl border border-border bg-background/90 p-6 shadow-3xl backdrop-blur-xl sm:p-8">
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
                        onSignedUp={(email) => {
                            setPrefillEmail(email)
                            setTab('signin')
                        }}
                    />
                </TabsContent>
                <TabsContent value="signin" className="mt-6">
                    <SignInForm initialEmail={prefillEmail} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AuthCard
