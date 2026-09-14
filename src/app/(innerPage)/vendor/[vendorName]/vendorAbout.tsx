import { CircleCheck, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "@/lib/icon";
import RichText from "@/components/ui/richText";
import Title from "@/components/ui/title";
import { VendorType } from "@/types/vendorType";
import VendorSocialLinks, { getVendorSocialEntries } from "./vendorSocialLinks";

const VendorAbout = ({ vendor }: { vendor: VendorType }) => {
  const socialEntries = getVendorSocialEntries(vendor);

  return (
    <section aria-label={`About ${vendor.name}`} className="py-10 lg:py-12.5">
      <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Title className="mb-4 font-medium">About {vendor.name}</Title>
          <RichText html={vendor.description} className="leading-[165%]" />

          <ul className="mt-5 flex flex-col gap-2 text-sm text-gray-1-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4" /> {vendor.location}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4" /> {vendor.responseTime}
            </li>
          </ul>

          {socialEntries.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-secondary-foreground">
                Follow {vendor.name}
              </p>
              <VendorSocialLinks vendor={vendor} />
            </div>
          )}
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-gray-2 bg-home-bg-1 sm:grid-cols-2">
          <div className="relative min-h-[220px] sm:min-h-full">
            <Image
              src={vendor.aboutImage}
              alt={`Inside ${vendor.name}'s workshop`}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 lg:p-8">
            <h3 className="mb-4 text-lg font-medium text-secondary-foreground">Store Highlights</h3>
            <ul className="flex flex-col gap-4">
              {vendor.highlights.map((highlight) => (
                <li key={highlight.title} className="flex items-start gap-3">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-secondary-foreground">{highlight.title}</p>
                    <p className="text-sm text-gray-1-foreground">{highlight.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="#vendor-products"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-secondary-foreground transition-colors duration-300 hover:text-gray-1-foreground"
            >
              Explore products <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorAbout;
