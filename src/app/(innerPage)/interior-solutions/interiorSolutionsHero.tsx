"use client";

import Image from "next/image";
import Link from "next/link";
import { Factory } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/lib/icon";
import B2bEnquiryModal from "../b2b/b2bEnquiryModal";

const InteriorSolutionsHero = ({ categories = [] }: { categories?: string[] }) => {
  return (
    <section className="pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5" aria-label="B2B interior and home decor solutions">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-home-bg-2 px-6 py-12 lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-gradient-radial from-primary/[0.06] to-transparent blur-2xl"
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
                B2B Interior &amp; Home Decor Solutions <span className="h-px w-8 bg-gray-2" aria-hidden />
              </p>
              <h1 className="mt-3 text-heading capitalize text-secondary-foreground font-normal">
                Handcrafted interiors, <span className="font-display italic">engineered for scale</span>
              </h1>
              <p className="mt-4 max-w-lg text-gray-1-foreground leading-[170%]">
                Handsy Market is a one-stop provider of handcrafted interior and home decor
                solutions for architects, builders, and hospitality groups worldwide — backed by
                trusted partners, collaborating brands, and state-of-the-art manufacturing at
                competitive B2B pricing.
              </p>
              <div className="mt-7.5 flex flex-wrap items-center gap-4">
                <B2bEnquiryModal categories={categories} />
                <Button asChild variant="outline">
                  <Link href="#segments">Explore Collaboration Segments</Link>
                </Button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <dt className="sr-only">Trusted partners and collaborating brands</dt>
                  <dd className="text-2xl font-medium text-secondary-foreground">500+</dd>
                  <p className="mt-1 text-sm text-gray-3-foreground">Partners &amp; brands</p>
                </div>
                <div>
                  <dt className="sr-only">Countries delivered to</dt>
                  <dd className="text-2xl font-medium text-secondary-foreground">30+</dd>
                  <p className="mt-1 text-sm text-gray-3-foreground">Countries served</p>
                </div>
                <div>
                  <dt className="sr-only">Handcrafted product SKUs</dt>
                  <dd className="text-2xl font-medium text-secondary-foreground">1,200+</dd>
                  <p className="mt-1 text-sm text-gray-3-foreground">Handcrafted SKUs</p>
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
                  src="/images/about/img-1.webp"
                  alt="Handcrafted interior furniture and decor produced for B2B architecture, build, and hospitality projects"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                />
              </div>

              <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-gray-2 bg-background px-5 py-4 shadow-3xl">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-spring-one" aria-hidden />
                  <Factory className="relative size-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold leading-none text-secondary-foreground">State-of-the-art manufacturing</p>
                  <p className="mt-1 text-xs text-gray-1-foreground">Built for project-scale delivery</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteriorSolutionsHero;
