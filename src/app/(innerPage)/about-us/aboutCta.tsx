import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/lib/icon";

const AboutCta = () => {
  return (
    <section className="pb-10 md:pb-11.25 lg:pb-12.5" aria-label="Buying for a business">
      <div className="container">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center lg:px-12 lg:py-20">
          <h5 className="text-white">Buying for a business, not just a home?</h5>
          <p className="mt-4 max-w-xl mx-auto text-gray-2 leading-[170%]">
            From boutique retailers to hospitality projects, our B2B program offers tiered
            wholesale pricing, custom orders, and dedicated support for bulk buyers.
          </p>
          <div className="mt-7.5 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="outline" className="group/cta bg-white text-primary border-white hover:bg-transparent hover:text-white">
              <Link href="/b2b">
                Explore B2B &amp; Wholesale
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact-us">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCta;
