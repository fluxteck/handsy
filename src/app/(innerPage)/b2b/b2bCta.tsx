import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/lib/icon";

const B2bCta = () => {
  return (
    <section className="pb-10 md:pb-11.25 lg:pb-12.5" aria-label="Start your business partnership">
      <div className="container">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center lg:px-12 lg:py-20">
          <h5 className="text-white">Ready to grow your business with Handsy Market?</h5>
          <p className="mt-4 max-w-xl mx-auto text-gray-2 leading-[170%]">
            From first sample to full container loads, our team is ready to build a sourcing
            partnership around your business.
          </p>
          <div className="mt-7.5 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="outline" className="group/cta bg-white text-primary border-white hover:bg-transparent hover:text-white">
              <Link href="#quote">
                Request a Quote
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact-us">Talk to Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2bCta;
