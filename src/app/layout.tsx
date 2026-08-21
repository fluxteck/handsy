import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Instrument_Serif } from 'next/font/google'
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/smoothScroll";
import WelcomePopup from "@/components/sections/welcomePopup";

const satoshi = localFont({
  src: [
    {
      path: '../font/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../font/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../font/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../font/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable:'--satoshi'
})

// Editorial italic serif used for a handful of premium display headlines (e.g. "Shop the Look").
// Self-hosted and subset by next/font at build time, so this adds no extra runtime dependency.
const displaySerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic', 'normal'],
  display: 'swap',
  variable: '--display-serif',
})


// TODO: replace with the real production domain (or set NEXT_PUBLIC_SITE_URL) —
// nothing in the codebase states it yet, so this placeholder keeps metadataBase/JSON-LD
// valid without presenting a guessed domain as fact.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Handsy Market — Handcrafted Wooden Furniture & Home Decor",
    template: "%s | Handsy Market",
  },
  description: "Shop handcrafted wooden furniture and home decor from independent Indian artisans. Retail and wholesale/bulk orders, with export shipping worldwide.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Handsy Market",
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-291-234-5678",
    email: "hello@handsymarket.com",
    contactType: "customer service",
    areaServed: ["IN"],
    availableLanguage: ["English"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jodhpur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} ${displaySerif.variable}`}
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <StoreProvider>
          <SmoothScroll />
          {children}
          <WelcomePopup />
          <Toaster position="top-right" reverseOrder={false} />
        </StoreProvider>
      </body>
    </html>
  );
}
