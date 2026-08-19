"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, HardHat, Hotel, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

const segments = [
  {
    id: "architects-interior-designers",
    icon: PenTool,
    eyebrow: "Architects & Interior Designers",
    title: "Specify with confidence, from concept to installation",
    description:
      "We work directly with architecture and interior design studios to translate mood boards, material palettes, and technical drawings into production-ready furniture and decor — with sample approvals, finish libraries, and dimensional accuracy your projects demand.",
    points: [
      "Custom sizing, joinery, and finish matching to your spec sheets",
      "Material and finish sample kits for client presentations",
      "A dedicated project liaison from concept to final installation",
      "Scalable production for single properties or multi-project pipelines",
    ],
    image: "/images/about/about-two-img-1.webp",
    alt: "Architect and interior designer reviewing handcrafted furniture finishes and specifications",
  },
  {
    id: "builders",
    icon: HardHat,
    eyebrow: "Builders",
    title: "Contract-grade furnishing that keeps pace with your build",
    description:
      "From single villas to large-scale residential and commercial developments, we supply consistent, contract-grade furniture and fit-out decor on schedule. Our manufacturing capacity and quality controls are built to support phased handovers and tight completion timelines.",
    points: [
      "Volume pricing tied to development phase and unit count",
      "Consistent quality across every unit, block, or tower",
      "Delivery scheduling coordinated to your handover milestones",
      "Standard finish packages available across multiple unit types",
    ],
    image: "/images/about/img-2.webp",
    alt: "Handcrafted wooden furniture production for builder and development projects",
  },
  {
    id: "hospitality",
    icon: Hotel,
    eyebrow: "Hospitality",
    title: "Durable, brand-consistent decor for high-traffic spaces",
    description:
      "Hotels, resorts, restaurants, and hospitality groups trust Handsy Market for durable, contract-grade furniture and decor that performs under daily guest use — without compromising on the handcrafted warmth your brand promises guests.",
    points: [
      "Contract-grade durability tested for high-traffic environments",
      "Brand-consistent furnishing across multi-property portfolios",
      "Custom finishes aligned to your interior design concept",
      "Reliable reorder support for replacements and future openings",
    ],
    image: "/images/about/img-3.webp",
    alt: "Handcrafted furniture and decor supplied for hotel and hospitality interiors",
  },
];

const InteriorSolutionsSegments = () => {
  return (
    <section id="segments" className="container lg:py-25 py-15" aria-label="Who we collaborate with">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Who We Collaborate With <span className="h-px w-8 bg-gray-2" aria-hidden />
        </p>
        <h2 className="mt-3 text-heading capitalize text-secondary-foreground font-normal">
          Built for three kinds of collaboration
        </h2>
        <p className="mt-4 text-gray-1-foreground leading-[170%]">
          Whether you specify, build, or operate, Handsy Market adapts its manufacturing,
          customization, and pricing to how your business actually works.
        </p>
      </div>

      <div className="mt-12 lg:mt-16 flex flex-col gap-16 lg:gap-20">
        {segments.map(({ id, icon: Icon, eyebrow, title, description, points, image, alt }, index) => {
          const isReversed = index % 2 === 1;
          return (
            <div
              key={id}
              id={id}
              className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16 scroll-mt-24"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                  "relative aspect-[4/3] w-full overflow-hidden rounded-2xl order-2",
                  isReversed ? "lg:order-2" : "lg:order-1"
                )}
              >
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn("order-1", isReversed ? "lg:order-1" : "lg:order-2")}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-home-bg-1 text-secondary-foreground">
                  <Icon className="size-5" />
                </span>
                <p className="mt-5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
                  {eyebrow}
                </p>
                <h3 className="mt-2 text-xl lg:text-2xl font-medium text-secondary-foreground leading-[141%]">
                  {title}
                </h3>
                <p className="mt-4 text-gray-1-foreground leading-[170%]">{description}</p>

                <ul className="mt-6 flex flex-col gap-3">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary-foreground" />
                      <span className="text-gray-1-foreground leading-[170%]">{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="#quote"
                  className="mt-6 inline-block text-secondary-foreground font-medium multiline-hover"
                >
                  Start a conversation about your {eyebrow.toLowerCase()} project
                </Link>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InteriorSolutionsSegments;
