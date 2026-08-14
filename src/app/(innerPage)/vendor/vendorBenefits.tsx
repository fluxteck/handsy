"use client";

import { motion } from "framer-motion";
import { Wallet, ShieldCheck, Megaphone, TrendingUp, Users, Truck } from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Keep More of What You Earn",
    description: "Transparent, competitive commission rates with no listing or setup fees.",
  },
  {
    icon: ShieldCheck,
    title: "Secure, Reliable Payouts",
    description: "Get paid on a predictable schedule directly to your bank account.",
  },
  {
    icon: Megaphone,
    title: "Built-in Marketing Reach",
    description: "Featured placements, seasonal campaigns, and email exposure to shoppers.",
  },
  {
    icon: TrendingUp,
    title: "Room to Scale",
    description: "Grow from your first listing to a full storefront with bulk and wholesale demand.",
  },
  {
    icon: Users,
    title: "Dedicated Vendor Support",
    description: "A responsive support team to help with onboarding, listings, and disputes.",
  },
  {
    icon: Truck,
    title: "Simplified Fulfillment",
    description: "Clear shipping tools and guidance for domestic and international orders.",
  },
];

const VendorBenefits = () => {
  return (
    <section className="bg-home-bg-1 lg:py-25 py-15" aria-label="Benefits for vendors">
      <div className="container">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Vendor Benefits <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Everything you need to sell with confidence</h5>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="rounded-2xl bg-background p-7 shadow-3xl"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-lg font-medium text-secondary-foreground">{title}</p>
              <p className="mt-2 text-gray-1-foreground leading-[170%]">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;
