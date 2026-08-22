"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/lib/icon";
import { cn } from "@/lib/utils";
import Parallax from "@/lib/animations/parallax";

const AboutTeaser = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5", className)}
      aria-label="About Handsy Market"
    >
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-home-bg-3 px-6 py-12 lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl"
            aria-hidden
          />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
                Our Story <span className="h-px w-8 bg-gray-2" aria-hidden />
              </p>
              <h2 className="mt-3 text-heading capitalize text-secondary-foreground">
                Timeless wood craftsmanship, <span className="font-display italic">delivered</span> worldwide
              </h2>
              <p className="mt-4 max-w-lg text-gray-1-foreground leading-[170%]">
                Every piece begins in the hands of skilled artisans who shape natural wood into
                furniture and décor built to last a lifetime. From our workshop to doorsteps
                everywhere, Handsy Market connects authentic, sustainably-sourced handicrafts with
                homes across the globe.
              </p>
              <div className="mt-7.5 flex flex-wrap items-center gap-4">
                <Button asChild className="group/cta">
                  <Link href="/shop-2">
                    Shop All
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/about-us">About Us</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="relative"
            >
              <div className="group/image relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Parallax strength={24} className="absolute -inset-y-6 inset-x-0">
                  <Image
                    src="/images/about/about-two-img-1.webp"
                    alt="Artisan hand-shaping wooden home decor"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                  />
                </Parallax>
              </div>

              <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-gray-2 bg-background px-5 py-4 shadow-3xl">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-spring-one" aria-hidden />
                  <Globe2 className="relative size-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold leading-none text-secondary-foreground">20K+</p>
                  <p className="mt-1 text-xs text-gray-1-foreground">Happy customers worldwide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
