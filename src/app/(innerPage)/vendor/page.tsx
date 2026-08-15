import { Metadata } from "next";
import PageHeader from "@/components/sections/pageHeader";
import VendorHero from "./vendorHero";
import VendorWhySell from "./vendorWhySell";
import VendorBenefits from "./vendorBenefits";
import VendorProcess from "./vendorProcess";
import VendorFeatures from "./vendorFeatures";
import VendorReach from "./vendorReach";
import VendorWholesale from "./vendorWholesale";
import VendorOnboardingForm from "./vendorOnboardingForm";
import VendorFaq from "./vendorFaq";
import VendorCta from "./vendorCta";

export const metadata: Metadata = {
  title: "Sell on Handsy",
  description: "Apply to become a Handsy vendor and sell handcrafted products to shoppers, retailers, and bulk buyers nationwide and internationally.",
};

const Vendor = () => {
  return (
    <main>
      <PageHeader pageTitle="Sell on Handsy" currentPage="Vendor" renderHeading={false} />
      <VendorHero />
      <VendorWhySell />
      <VendorBenefits />
      <VendorProcess />
      <VendorFeatures />
      <VendorReach />
      <VendorWholesale />
      <VendorOnboardingForm />
      <VendorFaq />
      <VendorCta />
    </main>
  );
};

export default Vendor;
