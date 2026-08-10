import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Instrument_Serif } from 'next/font/google'
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/smoothScroll";
// import WelcomePopup from "@/components/sections/welcomePopup";

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


export const metadata: Metadata = {
  title: "Handsy Market - E-Commerce Template",
  description: "Handsy Market - e-commerce template create by technology next.js, tailwind css, shadcn",
  keywords: ["ecommerce", "handsy market", "product", "site", "react.js", "next.js", "tailwind css",],
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
        <StoreProvider>
          <SmoothScroll />
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </StoreProvider>
      </body>
    </html>
  );
}
