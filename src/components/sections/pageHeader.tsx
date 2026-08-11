"use client";

import { ChevronRight } from "@/lib/icon";
import Link from "next/link";
import { motion } from "framer-motion";

type PropsType = {
  pageTitle: string;
  breadcrumbLink?: string;
  breadcrumbLabel?: string;
  currentPage: string;
};

const PageHeader = ({
  pageTitle,
  breadcrumbLink,
  breadcrumbLabel,
  currentPage,
}: PropsType) => {
  return (
    <section
      className="relative isolate flex min-h-[240px] items-center justify-center overflow-hidden lg:min-h-[320px]"
      aria-label={`${pageTitle} page banner`}
    >
      {/* Background photograph — a slow, continuous Ken Burns drift for an editorial, premium feel */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/images/page-header-img.webp')] bg-center bg-cover bg-no-repeat motion-safe:animate-page-header-pan"
      />

      {/* Warm, brand-tinted tint + vignette — keeps the title legible while echoing the near-black primary */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(17,15,14,0.35) 0%, rgba(17,15,14,0.58) 45%, rgba(12,11,10,0.78) 100%), radial-gradient(120% 120% at 50% 0%, transparent 40%, rgba(10,9,8,0.35) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-14 text-center lg:py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3 font-display text-xs italic uppercase tracking-[0.3em] text-white/70"
        >
          <span className="h-px w-8 bg-white/30" aria-hidden />
          Handsy Market
          <span className="h-px w-8 bg-white/30" aria-hidden />
        </motion.p>

        <motion.h5
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="text-shadow-sm break-words text-[clamp(1.75rem,1.4rem+1.5vw,3rem)] font-normal capitalize leading-[1.15] text-white"
        >
          {pageTitle}
        </motion.h5>

        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm leading-none backdrop-blur-md">
            <li className="flex items-center gap-1.5">
              <Link
                href="/"
                className="text-gray-2-foreground transition-colors duration-300 hover:text-white"
              >
                Home
              </Link>
              <ChevronRight className="size-3.5 text-white/40" aria-hidden />
            </li>
            {breadcrumbLink && (
              <li className="flex items-center gap-1.5">
                <Link
                  href={breadcrumbLink}
                  className="text-gray-2-foreground transition-colors duration-300 hover:text-white"
                >
                  {breadcrumbLabel}
                </Link>
                <ChevronRight className="size-3.5 text-white/40" aria-hidden />
              </li>
            )}
            <li
              className="max-w-[140px] sm:max-w-[220px] lg:max-w-[320px]"
              aria-current="page"
            >
              <span className="line-clamp-1 font-medium text-white">
                {currentPage}
              </span>
            </li>
          </ol>
        </motion.nav>
      </div>
    </section>
  );
};

export default PageHeader;
