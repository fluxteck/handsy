import { Metadata } from "next";
import PageHeader from "@/components/sections/pageHeader";
import { getPartnerData } from "@/lib/data";
import InteriorSolutionsHero from "./interiorSolutionsHero";
import InteriorSolutionsPositioning from "./interiorSolutionsPositioning";
import InteriorSolutionsSegments from "./interiorSolutionsSegments";
import InteriorSolutionsCapabilities from "./interiorSolutionsCapabilities";
import InteriorSolutionsProcess from "./interiorSolutionsProcess";
import InteriorSolutionsFaq from "./interiorSolutionsFaq";
import InteriorSolutionsCta from "./interiorSolutionsCta";
import { getHomeCategories } from "@/lib/sdk";

export const metadata: Metadata = {
  title: "B2B Interior & Home Decor Solutions",
  description:
    "Handsy Market delivers handcrafted interior and home decor solutions for architects, interior designers, builders, and hospitality brands — trusted partners, custom manufacturing, and competitive B2B pricing worldwide.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "B2B Interior & Home Decor Solutions",
  name: "Handsy Market B2B Interior & Home Decor Solutions",
  description:
    "Handsy Market is a one-stop provider of handcrafted interior and home decor solutions, bringing together trusted partners, collaborating brands, and state-of-the-art manufacturing to deliver high-quality interior solutions at competitive B2B pricing.",
  provider: { "@type": "Organization", name: "Handsy Market" },
  areaServed: "Worldwide",
  audience: [
    { "@type": "Audience", audienceType: "Architects & Interior Designers" },
    { "@type": "Audience", audienceType: "Builders" },
    { "@type": "Audience", audienceType: "Hospitality" },
  ],
};

const InteriorSolutions = async () => {
  // Real category names for the B2B enquiry dropdown, read here because
  // the modal that renders them is a client component.
  const categoryNames = (await getHomeCategories()).map((category) => category.categoryName);

  const partners = await getPartnerData();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <PageHeader
        pageTitle="B2B Interior & Home Decor Solutions"
        currentPage="Interior Solutions"
        renderHeading={false}
      />
      <InteriorSolutionsHero categories={categoryNames} />
      <InteriorSolutionsPositioning partners={partners} />
      <InteriorSolutionsSegments />
      <InteriorSolutionsCapabilities />
      <InteriorSolutionsProcess />
      <InteriorSolutionsFaq />
      <InteriorSolutionsCta categories={categoryNames} />
    </main>
  );
};

export default InteriorSolutions;
