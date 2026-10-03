import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Instrument_Serif } from 'next/font/google'
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/lib/cart/cart-context";
import { WishlistProvider } from "@/lib/wishlist/wishlist-context";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/smoothScroll";
import WelcomePopup from "@/components/sections/welcomePopup";
import { getSiteUrl } from "@/lib/config";

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


const siteUrl = getSiteUrl();

const GTM_ID = "GTM-WG34FQVH";

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
    telephone: "+91-9205028025",
    email: "info@handsymarket.com",
    contactType: "customer service",
    areaServed: "Worldwide",
    availableLanguage: ["English"],
  },
  address: {
    "@type": "PostalAddress",
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
        {/* Google Tag Manager (noscript) — must be the first thing in <body>. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Tag Manager — next/script injects this into <head> once the page is interactive. */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider>
          <WishlistProvider>
          <SmoothScroll />
          {children}
          <WelcomePopup />
          <Toaster position="top-right" reverseOrder={false} />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
