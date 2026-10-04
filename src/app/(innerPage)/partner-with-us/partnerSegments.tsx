"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, HardHat, Hotel, PenTool } from "lucide-react";
import PartnerJoinModal, { type MemberType } from "./partnerJoinModal";
import { outlineCtaClass } from "./partnerHero";

const segments: {
  id: string;
  icon: typeof PenTool;
  name: string;
  headline?: string;
  description: string;
  points: string[];
  cta: string;
  memberType: MemberType;
  image: string;
  alt: string;
}[] = [
  {
    id: "interior-designers-architects",
    icon: PenTool,
    name: "Interior Designers & Architects",
    description:
      "For residential and commercial designers, architects and design studios. Turn mood boards and material palettes into finished, handcrafted pieces, with samples your clients can approve before anything is made.",
    points: [
      "Samples and finish swatches for client presentations",
      "Custom sizes, finishes and colours on eligible pieces",
      "One statement piece or a full project, sourced in one place",
    ],
    cta: "Join as a Designer",
    memberType: "Interior Designer / Architect",
    image: "/images/about/about-two-img-1.webp",
    alt: "Designer-styled lounge with sculptural seating, a round coffee table and pendant lighting",
  },
  {
    id: "hospitality",
    icon: Hotel,
    name: "Hospitality",
    description:
      "For hotels, resorts, serviced apartments, restaurants, cafés, bars and event venues. Furnish rooms, lobbies and dining spaces with pieces selected for daily guest use, carrying the handcrafted warmth your brand promises.",
    points: [
      "Consistent finishes across rooms and properties",
      "Custom finishes to match your interior concept",
      "Easy reorders for replacements and new openings",
    ],
    cta: "Join as a Hospitality Partner",
    memberType: "Hospitality",
    image: "/images/about/img-4.webp",
    alt: "Guest room with a wooden headboard, crisp bedding and a wooden bedside table",
  },
  {
    id: "builders-developers",
    icon: HardHat,
    name: "Builders & Developers",
    headline: "Furnishing That Keeps Pace with Your Build",
    description:
      "For villas, residential towers, sample flats, show homes, handover packages and branded residences. Matching quality across every unit, delivered around your handover dates.",
    points: [
      "Project pricing by unit count and phase",
      "The same look and finish across every unit and tower",
      "Deliveries scheduled to your handover milestones",
    ],
    cta: "Join as a Builder",
    memberType: "Builder / Developer",
    image: "/images/about/img-3.webp",
    alt: "Furnished show-home living room with an armchair, side table and styled shelving",
  },
  {
    id: "workspace-institutions",
    icon: Building2,
    name: "Workspace & Institutions",
    headline: "Spaces That Work Hard and Still Feel Human",
    description:
      "For corporate offices, co-working spaces, retail showrooms, schools, universities and healthcare spaces. Bring warmth and character to busy spaces with décor, lighting and furniture chosen for everyday use.",
    points: [
      "Fit-out décor and lighting for one site or many",
      "Pieces selected for durability in high-use spaces",
      "Simple quotes and paperwork for procurement teams",
    ],
    cta: "Join as a Workspace Partner",
    memberType: "Workspace / Institution",
    image: "/images/about/img-2.webp",
    alt: "Wooden chair with an upholstered seat, suited to everyday workspace use",
  },
];

const PartnerSegments = () => {
  return (
    <section id="segments" className="container lg:py-25 py-15 scroll-mt-24" aria-label="Who we collaborate with">
      <div className="max-w-2xl">
        <h3 className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
          Who We Collaborate With <span className="h-px w-8 bg-gray-2" aria-hidden />
        </h3>
        <h2 className="mt-3 text-heading text-secondary-foreground font-normal">
          Built for the People Who <span className="font-display italic">Shape Spaces</span>
        </h2>
      </div>

      <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-8">
        {segments.map(({ id, icon: Icon, name, headline, description, points, cta, memberType, image, alt }, index) => (
          <motion.article
            key={id}
            id={id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: (index % 2) * 0.08 }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-gray-2 bg-background transition-all duration-500 hover:border-primary/30 hover:shadow-3xl scroll-mt-24"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 flex size-12 items-center justify-center rounded-full border border-white/50 bg-background/80 text-secondary-foreground backdrop-blur-md">
                <Icon className="size-5" />
              </span>
              <span className="absolute right-5 top-3 font-display text-4xl italic text-white drop-shadow-md" aria-hidden>
                0{index + 1}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-medium text-secondary-foreground leading-[141%]">{name}</h3>
              {headline && (
                <p className="mt-1.5 font-display text-xl italic text-gray-1-foreground">{headline}</p>
              )}
              <p className="mt-4 text-gray-1-foreground leading-[170%]">{description}</p>

              <ul className="mt-6 mb-7.5 flex flex-col gap-3">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary-foreground" />
                    <span className="text-gray-1-foreground leading-[170%]">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <PartnerJoinModal label={cta} memberType={memberType} className={outlineCtaClass} />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default PartnerSegments;
