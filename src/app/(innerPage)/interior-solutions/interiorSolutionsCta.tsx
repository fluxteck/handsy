import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Call, Email, Location } from "@/lib/icon";
import B2bEnquiryModal from "../b2b/b2bEnquiryModal";

const InteriorSolutionsCta = ({ categories = [] }: { categories?: string[] }) => {
  return (
    <section id="quote" className="pb-10 md:pb-11.25 lg:pb-12.5 scroll-mt-24" aria-label="Start your interior solutions partnership">
      <div className="container">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center lg:px-12 lg:py-20">
          <h2 className="text-heading capitalize text-white font-normal">
            Let&apos;s build your next interior project together
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-2 leading-[170%]">
            Share your project brief — as an architect, builder, or hospitality team — and our B2B
            team will respond with tailored capabilities and competitive pricing.
          </p>
          <div className="mt-7.5 flex flex-wrap items-center justify-center gap-4">
            <B2bEnquiryModal categories={categories} className="bg-white text-primary border-white hover:bg-transparent hover:text-white" />
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact-us">Talk to Our Team</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-7.5">
            <Link href="mailto:b2b@handsymarket.com" className="flex items-center gap-2 text-gray-2 hover:text-white transition-all duration-500">
              <Email className="size-4" /> b2b@handsymarket.com
            </Link>
            <Link href="tel:+912912345678" className="flex items-center gap-2 text-gray-2 hover:text-white transition-all duration-500">
              <Call className="size-4" /> +91 291 234 5678
            </Link>
            <span className="flex items-center gap-2 text-gray-2">
              <Location className="size-4" /> Jodhpur, Rajasthan, India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteriorSolutionsCta;
