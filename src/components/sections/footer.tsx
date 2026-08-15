import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "@/lib/icon";

const footerLinks = [
  {
    title: "Home Decor Solutions",
    links: [
      { label: "Interior Designer", href: "#" },
      { label: "Furniture Analytics", href: "#" },
      { label: "Boutique Furniture Store", href: "#" },
    ],
  },
  {
    title: "Handsy Market",
    links: [
      { label: "About Handsy Market", href: "#" },
      { label: "Join Our Team", href: "#" },
      { label: "Get in Touch", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Our Customers", href: "#" },
      { label: "Smart Furniture Finance", href: "#" },
      { label: "Guides on Furniture Design", href: "#" },
    ],
  },
  {
    title: "Our Features",
    links: [
      { label: "Interior Designer", href: "#" },
      { label: "Furniture Analytics", href: "#" },
      { label: "Boutique Furniture Store", href: "#" },
    ],
  },
];

const socialLinks = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-primary text-white">
      {/* Ambient accents for a premium, futuristic feel — built from the theme's
          own gradient tokens, no new colors introduced. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-gradient-radial from-white/10 via-white/0 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 left-[-10%] h-[420px] w-[420px] rounded-full bg-gradient-radial from-white/[0.06] via-white/0 to-transparent blur-3xl" />

      <div className="container relative lg:pt-20 pt-14 pb-7.5">
        <div className="flex lg:flex-row flex-col justify-between gap-x-10 gap-y-12">
          <div className="lg:max-w-[300px]">
            <Link href={"/"}>
              <Image
                width={129}
                height={80}
                src={"/images/logo.png"}
                alt="logo"
                className="brightness-0 invert"
              />
            </Link>
            <p className="mt-6 text-base text-white/60 leading-[170%]">
              Handsy Market provides you with the essential pieces to build a
              stunning online store for your furniture business.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-500 hover:border-white hover:bg-white hover:text-primary"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="basis-[65%]">
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-x-5 gap-y-10">
              {footerLinks.map((column) => (
                <div key={column.title}>
                  <h6 className="text-white leading-[170%] text-base font-medium">
                    {column.title}
                  </h6>
                  <ul className="mt-[29px] text-white/60 text-base leading-[170%] flex flex-col gap-4">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="hover:text-white transition-all duration-500"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 mb-10 border-t border-white/10" />

        <div className="flex items-center justify-between flex-col lg:flex-row gap-5">
          <p className="text-white/50 text-base leading-[170%]">
            © {new Date().getFullYear()}, All Rights Reserved by Handsy Market
          </p>
          <div className="flex items-center gap-2.5">
            <p className="text-base text-white/50">We accept</p>
            <div className="rounded-md bg-white/95 p-1.5">
              <Image
                src="/images/payment-card.webp"
                alt="Payment Methods"
                width={140}
                height={52}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
