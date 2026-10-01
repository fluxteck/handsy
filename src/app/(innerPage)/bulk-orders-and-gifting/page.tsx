import { Metadata } from "next";
import PageHeader from "@/components/sections/pageHeader";
import { getHomeCategories, getTopRatedProducts } from "@/lib/sdk";
import BulkGiftingHero from "./bulkGiftingHero";
import BulkGiftingBenefits from "./bulkGiftingBenefits";
import BulkGiftingOccasions from "./bulkGiftingOccasions";
import BulkGiftingProducts from "./bulkGiftingProducts";
import BulkGiftingCustomisation from "./bulkGiftingCustomisation";
import BulkGiftingProcess from "./bulkGiftingProcess";
import BulkGiftingWhyUs from "./bulkGiftingWhyUs";
import BulkGiftingSpotlight from "./bulkGiftingSpotlight";
import BulkGiftingInternational from "./bulkGiftingInternational";
import BulkGiftingFaq from "./bulkGiftingFaq";
import BulkGiftingEnquiry from "./bulkGiftingEnquiry";

export const metadata: Metadata = {
  title: "Bulk Orders & Corporate Gifting",
  description:
    "Handcrafted wooden gifts in bulk for corporate gifting, weddings, festive occasions, and events — personalised, artisan-made, and delivered across India and worldwide.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Bulk Orders & Corporate Gifting",
  name: "Handsy Market Bulk Orders & Gifting",
  description:
    "Artisan-made wooden gifts and décor in bulk for corporate gifting, weddings, festive occasions, events, and businesses, with personalisation and international shipping.",
  provider: { "@type": "Organization", name: "Handsy Market" },
  areaServed: "Worldwide",
  audience: [
    { "@type": "Audience", audienceType: "Corporate buyers" },
    { "@type": "Audience", audienceType: "Wedding & event planners" },
    { "@type": "Audience", audienceType: "Hotels, retailers & organisations" },
  ],
};

const BulkOrdersAndGifting = async () => {
  // Real category names for the enquiry dropdown, and real products for the
  // showcase — both read here because the sections that render them are client
  // components.
  const [categories, products] = await Promise.all([
    getHomeCategories(),
    getTopRatedProducts(8),
  ]);
  const categoryNames = categories.map((category) => category.categoryName);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <PageHeader pageTitle="Bulk Orders & Gifting" currentPage="Bulk Orders & Gifting" renderHeading={false} />
      <BulkGiftingHero categories={categoryNames} />
      <BulkGiftingBenefits />
      <BulkGiftingOccasions />
      <BulkGiftingProducts products={products} />
      <BulkGiftingCustomisation />
      <BulkGiftingProcess />
      <BulkGiftingWhyUs />
      <BulkGiftingSpotlight />
      <BulkGiftingInternational />
      <BulkGiftingFaq />
      <BulkGiftingEnquiry categories={categoryNames} />
    </main>
  );
};

export default BulkOrdersAndGifting;
