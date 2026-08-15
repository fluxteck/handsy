"use client";

import { BadgeCheck, MapPin, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "@/lib/icon";
import { VendorType } from "@/types/vendorType";
import VendorShareButton from "./vendorShareButton";

const VendorHero = ({ vendor, productCount }: { vendor: VendorType; productCount: number }) => {
  return (
    <section aria-label={`${vendor.name} storefront banner`} className="relative isolate">
      <div className="relative h-[220px] w-full overflow-hidden lg:h-[300px]">
        <Image
          src={vendor.coverImage}
          alt={`${vendor.name} storefront cover photo`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
        />

        <div className="absolute inset-x-0 top-0">
          <div className="container pt-5">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/70">
              <Link href="/" className="transition-colors duration-300 hover:text-white">
                Home
              </Link>
              <ChevronRight className="size-3.5 text-white/40" aria-hidden />
              <span>Vendors</span>
              <ChevronRight className="size-3.5 text-white/40" aria-hidden />
              <span className="line-clamp-1 font-medium text-white" aria-current="page">
                {vendor.name}
              </span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative -mt-14 flex flex-col gap-6 rounded-2xl border border-gray-2 bg-background px-5 py-6 shadow-3xl lg:-mt-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-7"
        >
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
            <div className="relative -mt-16 size-24 shrink-0 overflow-hidden rounded-full bg-home-bg-1 ring-4 ring-background sm:-mt-0 lg:size-28">
              <Image
                src={vendor.logo}
                alt={`${vendor.name} logo`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div>
              {vendor.isVerified && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-white">
                  <BadgeCheck className="size-3.5" /> Verified Vendor
                </span>
              )}
              <h1 className="text-heading font-normal text-secondary-foreground">{vendor.name}</h1>
              <p className="mt-1 text-gray-1-foreground">{vendor.tagline}</p>

              <ul className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <li className="flex items-center gap-1.5 rounded-full border border-gray-2 px-3 py-1 text-xs text-gray-1-foreground">
                  <MapPin className="size-3.5" /> {vendor.location}
                </li>
                <li className="flex items-center gap-1.5 rounded-full border border-gray-2 px-3 py-1 text-xs text-gray-1-foreground">
                  <Star className="size-3.5 fill-[#FFA34E] text-[#FFA34E]" />
                  {vendor.rating} ({vendor.totalReviews} Reviews)
                </li>
                <li className="flex items-center gap-1.5 rounded-full border border-gray-2 px-3 py-1 text-xs text-gray-1-foreground">
                  <Package className="size-3.5" /> {productCount} Products
                </li>
                <li className="rounded-full border border-gray-2 px-3 py-1 text-xs text-gray-1-foreground">
                  Selling since {vendor.sellingSince}
                </li>
              </ul>
            </div>
          </div>

          <VendorShareButton
            vendorName={vendor.name}
            tagline={vendor.tagline}
            className="mx-auto lg:mx-0"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default VendorHero;
