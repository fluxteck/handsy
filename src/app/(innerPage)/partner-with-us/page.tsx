import { Metadata } from "next";
import PageHeader from "@/components/sections/pageHeader";
import PartnerHero from "./partnerHero";
import PartnerStatement from "./partnerStatement";
import PartnerSegments from "./partnerSegments";
import PartnerPerks from "./partnerPerks";
import PartnerWhyUs from "./partnerWhyUs";
import PartnerProcess from "./partnerProcess";
import PartnerCta from "./partnerCta";
import { getHomeCategories } from "@/lib/sdk";

// The root layout's title template appends "| Handsy Market".
export const metadata: Metadata = {
  title: "Trade Programme for Designers & Architects",
  description:
    "Partner with us and get easy project sourcing for interior designers, architects, hospitality and builders. Apply to join.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Trade Programme",
  name: "Handsy Market Trade Programme",
  description:
    "Handsy Market brings skilled makers and design-led brands from across India into one place. Trade members get exclusive pricing, samples for client approvals and one point of contact, from first brief to final delivery, in India and worldwide.",
  provider: { "@type": "Organization", name: "Handsy Market" },
  areaServed: "Worldwide",
  audience: [
    { "@type": "Audience", audienceType: "Interior Designers & Architects" },
    { "@type": "Audience", audienceType: "Hospitality" },
    { "@type": "Audience", audienceType: "Builders & Developers" },
    { "@type": "Audience", audienceType: "Workspace & Institutions" },
  ],
};

const PartnerWithUs = async () => {
  // Real category names for the bulk enquiry dropdown, read here because
  // the modal that renders them is a client component.
  const categoryNames = (await getHomeCategories()).map((category) => category.categoryName);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <PageHeader
        pageTitle="Trade Programme"
        currentPage="Partner With Us"
        renderHeading={false}
      />
      <PartnerHero categories={categoryNames} />
      <PartnerStatement />
      <PartnerSegments />
      <PartnerPerks />
      <PartnerWhyUs />
      <PartnerProcess />
      <PartnerCta categories={categoryNames} />
    </main>
  );
};

export default PartnerWithUs;
