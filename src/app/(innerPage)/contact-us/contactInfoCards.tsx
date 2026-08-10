"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Call, Email, Location } from "@/lib/icon";

const infoCards = [
  {
    icon: Location,
    title: "Visit Our Workshop",
    detail: "Jodhpur, Rajasthan, India",
    note: undefined as string | undefined,
    href: undefined as string | undefined,
  },
  {
    icon: Email,
    title: "Email Us",
    detail: "hello@handsymarket.com",
    note: "We reply within 24 hours",
    href: "mailto:hello@handsymarket.com",
  },
  {
    icon: Call,
    title: "Call / WhatsApp",
    detail: "+91 291 234 5678",
    note: "Mon – Sat, 9am – 6pm IST",
    href: "tel:+912912345678",
  },
];

const cardClassName =
  "group/card block h-full rounded-2xl bg-background p-7 shadow-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-lg";

const ContactInfoCards = () => {
  return (
    <section className="container lg:pb-25 pb-15" aria-label="Contact information">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Reach Us <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h5 className="mt-3">Multiple ways to connect</h5>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {infoCards.map(({ icon: Icon, title, detail, note, href }, index) => {
          const cardContent = (
            <>
              <span className="relative flex size-12 items-center justify-center rounded-full bg-primary text-white transition-transform duration-500 group-hover/card:scale-105">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 flex items-center gap-2 text-lg font-medium text-secondary-foreground">
                {title}
                {href && (
                  <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100" />
                )}
              </p>
              <p className="mt-2 text-gray-1-foreground leading-[170%] transition-colors duration-500 group-hover/card:text-secondary-foreground">
                {detail}
              </p>
              {note && <p className="mt-1 text-sm text-gray-3-foreground leading-[170%]">{note}</p>}
            </>
          );

          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
            >
              {href ? (
                <Link href={href} className={cardClassName}>
                  {cardContent}
                </Link>
              ) : (
                <div className={cardClassName}>{cardContent}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ContactInfoCards;
