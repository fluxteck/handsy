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
import { getHomeCategories } from "@/lib/sdk";

export const metadata: Metadata = {
  title: "Sell on Handsy",
  description: "Apply to become a Handsy vendor and sell handcrafted products to shoppers, retailers, and bulk buyers nationwide and internationally.",
};

const Vendor = async () => {
  // Real category names for the seller-onboarding enquiry dropdown.
  const categoryNames = (await getHomeCategories()).map((category) => category.categoryName);

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
      <VendorOnboardingForm categories={categoryNames} />
      <VendorFaq />
      <VendorCta />
    </main>
  );
};

export default Vendor;
