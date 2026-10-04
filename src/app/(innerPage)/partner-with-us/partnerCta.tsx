import Link from "next/link";
import { Call, Email, Location } from "@/lib/icon";
import B2bEnquiryModal from "../b2b/b2bEnquiryModal";
import PartnerJoinModal from "./partnerJoinModal";

const PartnerCta = ({ categories = [] }: { categories?: string[] }) => {
  return (
    <section id="quote" className="pb-10 md:pb-11.25 lg:pb-12.5 scroll-mt-24" aria-label="Join the Handsy Market Trade Programme">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center lg:px-12 lg:py-20">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-gradient-radial from-white/10 to-transparent blur-2xl"
            aria-hidden
          />
          <h2 className="relative text-heading text-white font-normal">
            From Brief to Delivery, <span className="font-display italic">We&apos;re With You.</span>
          </h2>
          <div className="relative mt-7.5 flex flex-wrap items-center justify-center gap-4">
            <PartnerJoinModal className="bg-white text-primary border-white hover:bg-transparent hover:border-white hover:text-white" />
            <B2bEnquiryModal
              categories={categories}
              label="Request for Bulk"
              subject="Trade Programme bulk request"
              className="bg-transparent border-white text-white shadow-none hover:bg-white hover:border-white hover:text-primary"
            />
          </div>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-7.5">
            <Link href="mailto:info@handsymarket.com" className="flex items-center gap-2 text-gray-2 hover:text-white transition-all duration-500">
              <Email className="size-4" /> info@handsymarket.com
            </Link>
            <Link href="tel:+919205028025" className="flex items-center gap-2 text-gray-2 hover:text-white transition-all duration-500">
              <Call className="size-4" /> +91 9205028025
            </Link>
            <span className="flex items-center gap-2 text-gray-2">
              <Location className="size-4" /> India | Serving Customers Worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerCta;
