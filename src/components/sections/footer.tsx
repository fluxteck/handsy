import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "@/lib/icon";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "Furniture", href: "/category/furniture" },
      { label: "Home Decor", href: "/category/home-decor" },
      { label: "Kitchen & Dining", href: "/category/kitchen-dining" },
      { label: "Lamps & Lighting", href: "/category/lamps-lighting" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "For Business",
    links: [
      { label: "Wholesale & B2B", href: "/b2b" },
      { label: "Interior & Home Decor Solutions", href: "/interior-solutions" },
      { label: "Sell on Handsy", href: "/vendor" },
      { label: "Track Your Order", href: "/account/orders" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
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
    <footer className="relative bg-primary text-white mx-4 md:mx-6 lg:mx-8 mb-4 md:mb-6 lg:mb-8 rounded-3xl shadow-3xl">
      <div className="container relative pt-10 md:pt-11.25 lg:pt-12.5 pb-10 md:pb-11.25 lg:pb-12.5">
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
              Handcrafted wooden furniture and home decor from independent
              Indian artisans — for your home, or for your business, shipped
              worldwide.
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
