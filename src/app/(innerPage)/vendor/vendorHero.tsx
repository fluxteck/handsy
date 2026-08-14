"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/lib/icon";

const VendorHero = () => {
  return (
    <section className="pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5" aria-label="Sell on Handsy Market">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-home-bg-4 px-6 py-12 lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
            aria-hidden
          />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:order-1 order-2"
            >
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
                Become a Handsy Vendor <span className="h-px w-8 bg-gray-2" aria-hidden />
              </p>
              <h1 className="mt-3 text-heading capitalize text-secondary-foreground font-normal">
                Turn your craft into <span className="font-display italic">a thriving business</span>
              </h1>
              <p className="mt-4 max-w-lg text-gray-1-foreground leading-[170%]">
                Join a curated marketplace built for skilled artisans and makers. List your
                handcrafted products, reach shoppers and bulk buyers nationwide and abroad, and
                grow your brand with tools, support, and secure payouts — all in one place.
              </p>
              <div className="mt-7.5 flex flex-wrap items-center gap-4">
                <Button asChild className="group/cta">
                  <Link href="#apply">
                    Apply to Sell
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <dt className="sr-only">Shoppers reached</dt>
                  <dd className="text-2xl font-medium text-secondary-foreground">2M+</dd>
                  <p className="mt-1 text-sm text-gray-3-foreground">Shoppers reached</p>
                </div>
                <div>
                  <dt className="sr-only">Countries shipped to</dt>
                  <dd className="text-2xl font-medium text-secondary-foreground">30+</dd>
                  <p className="mt-1 text-sm text-gray-3-foreground">Countries shipped to</p>
                </div>
                <div>
                  <dt className="sr-only">Listing fee</dt>
                  <dd className="text-2xl font-medium text-secondary-foreground">0%</dd>
                  <p className="mt-1 text-sm text-gray-3-foreground">Listing fee to apply</p>
                </div>
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="relative lg:order-2 order-1"
            >
              <div className="group/image relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/about/img-4.webp"
                  alt="Artisan preparing handcrafted products to sell on Handsy Market"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                />
              </div>

              <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-gray-2 bg-background px-5 py-4 shadow-3xl">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-spring-one" aria-hidden />
                  <Sparkles className="relative size-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold leading-none text-secondary-foreground">Start selling in minutes</p>
                  <p className="mt-1 text-xs text-gray-1-foreground">No listing fees to apply</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorHero;
