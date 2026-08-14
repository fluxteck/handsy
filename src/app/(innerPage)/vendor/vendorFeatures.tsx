"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Boxes, BarChart3, Wallet, Megaphone, Headset } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Vendor Dashboard",
    description: "Track orders, inventory, and performance from one central hub.",
  },
  {
    icon: Boxes,
    title: "Inventory Management",
    description: "Manage stock levels and listings with real-time sync across channels.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Understand what's selling with clear, actionable performance insights.",
  },
  {
    icon: Wallet,
    title: "Secure Payouts",
    description: "Scheduled, reliable payments with a full transaction history.",
  },
  {
    icon: Megaphone,
    title: "Marketing Tools",
    description: "Promote your products through badges, spotlights, and seasonal campaigns.",
  },
  {
    icon: Headset,
    title: "Dedicated Vendor Support",
    description: "Reach a responsive seller support team whenever you need help.",
  },
];

const VendorFeatures = () => {
  return (
    <section className="container lg:py-25 py-15" aria-label="Vendor features and tools">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Vendor Tools <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h5 className="mt-3">Everything you need to run your shop</h5>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
            className="group rounded-2xl border border-gray-2 bg-background p-6 transition-all duration-500 hover:shadow-3xl hover:border-primary/30"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
              <Icon className="size-5" />
            </span>
            <p className="mt-5 text-lg font-medium text-secondary-foreground">{title}</p>
            <p className="mt-2 text-gray-1-foreground leading-[170%]">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default VendorFeatures;
