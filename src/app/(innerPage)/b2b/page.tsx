import { Metadata } from "next";
import PageHeader from "@/components/sections/pageHeader";
import B2bHero from "./b2bHero";
import B2bAudiences from "./b2bAudiences";
import B2bCapabilities from "./b2bCapabilities";
import B2bProcess from "./b2bProcess";
import B2bCategories from "./b2bCategories";
import B2bWhyUs from "./b2bWhyUs";
import B2bQuoteForm from "./b2bQuoteForm";
import B2bFaq from "./b2bFaq";
import B2bCta from "./b2bCta";
import { getHomeCategories } from "@/lib/sdk";

export const metadata: Metadata = {
  title: "B2B & Wholesale",
  description: "Wholesale wooden furniture and home decor for retailers, designers, hospitality, and corporate buyers worldwide.",
};

const B2b = async () => {
  // Real category names for the B2B enquiry dropdown, read here because
  // the modal that renders them is a client component.
  const categoryNames = (await getHomeCategories()).map((category) => category.categoryName);

  return (
    <main>
      <PageHeader pageTitle="B2B & Wholesale" currentPage="B2B" renderHeading={false} />
      <B2bHero />
      <B2bAudiences />
      <B2bCapabilities />
      <B2bProcess />
      <B2bCategories />
      <B2bWhyUs />
      <B2bQuoteForm categories={categoryNames} />
      <B2bFaq />
      <B2bCta />
    </main>
  );
};

export default B2b;
