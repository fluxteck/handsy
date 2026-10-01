"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Globe2, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Location } from "@/lib/icon";

const features = [
  { icon: Globe2, title: "30+ countries", description: "Regular exports to buyers across the globe." },
  { icon: FileText, title: "Export paperwork", description: "Export documentation handled by our team." },
  { icon: Ship, title: "Sea or air freight", description: "Chosen to match your timeline and budget." },
];

const BulkGiftingInternational = () => {
  return (
    <section className="pb-10 md:pb-11.25 lg:pb-12.5" aria-label="International bulk orders">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 lg:px-16 lg:py-18"
        >
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gradient-radial from-white/10 to-transparent blur-2xl"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                International Bulk Orders <span className="h-px w-8 bg-white/30" aria-hidden />
              </p>
              <h5 className="mt-3 text-white">Handcrafted in India, gifted around the world</h5>
              <p className="mt-4 max-w-lg text-white/70 leading-[170%]">
                Ordering for an overseas office, a destination wedding, or a retail store abroad? We
                handle export documentation and freight coordination, so your gifts arrive ready to give.
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
                <Location className="size-4" /> India | Serving Customers Worldwide
              </p>
              <Button asChild variant="outline" className="group/cta mt-7.5 border-white bg-white text-primary hover:bg-transparent hover:text-white">
                <Link href="#enquiry">
                  Request an Export Quote
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </Button>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {features.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium text-white">{title}</p>
                    <p className="mt-1 text-sm text-white/70 leading-[170%]">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BulkGiftingInternational;
