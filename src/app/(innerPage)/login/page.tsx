import { Metadata } from 'next'
import AuthCard from './authCard'

export const metadata: Metadata = {
    title: "Sign In / Sign Up",
    description: "Sign up or sign in to your account."
}

// A dedicated, focused auth screen rather than the site's usual PageHeader + Newsletter +
// InstagramGallery shell — but built from the same light, warm palette (home-bg tokens) as
// every other page, not a separate dark "app" look.
const Login = () => {
    return (
        <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-home-bg-2 px-4 py-16 lg:min-h-[calc(100vh-90px)]">
            <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-home-bg-4/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-home-bg-3/80 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

            <AuthCard />
        </main>
    )
}

export default Login
