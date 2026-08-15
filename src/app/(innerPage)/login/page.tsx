import { Metadata } from 'next'
import AuthCard from './authCard'

export const metadata: Metadata = {
    title: "Sign In / Sign Up",
    description: "Sign up or sign in to your account."
}

// A dedicated, focused auth screen rather than the site's usual PageHeader + Newsletter +
// InstagramGallery shell — the card itself (authCard.tsx) reuses the exact same flat,
// bordered widget recipe as the PDP's "Need Help in Buying?" card, so the page background
// stays the same plain home-bg-1 section background used across the rest of the site.
const Login = () => {
    return (
        <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-home-bg-1 px-4 py-16 lg:min-h-[calc(100vh-80px)]">
            <AuthCard />
        </main>
    )
}

export default Login
