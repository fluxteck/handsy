import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe, LifeBuoy, Lock, ShieldCheck } from "lucide-react";
import Newsletter from "@/components/sections/newsletter";
import TrustBadges, { TrustBadgeItem } from "@/app/(innerPage)/login/trustBadges";
import { getVendorBySlug, getVendorProducts, getVendorSlugs } from "@/lib/sdk/catalog";
import { toVendorType } from "@/lib/mappers/vendor";
import { productPath } from "@/lib/productPath";
import VendorAbout from "./vendorAbout";
import VendorHero from "./vendorHero";
import VendorProducts from "./vendorProducts";

type PageProps = {
  params: Promise<{ vendorName: string }>;
};

const trustItems: TrustBadgeItem[] = [
  { icon: ShieldCheck, label: "Handsy Market" },
  { icon: Lock, label: "Secure Payments" },
  { icon: Globe, label: "Worldwide Shipping" },
  { icon: LifeBuoy, label: "Dedicated Support" },
];

export const generateStaticParams = async () => {
  const slugs = await getVendorSlugs();
  return slugs.map((vendorName) => ({ vendorName }));
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { vendorName } = await params;
  const brand = await getVendorBySlug(vendorName);
  if (!brand) return {};
  const vendor = toVendorType(brand);

  const description =
    vendor.description.length > 155 ? `${vendor.description.slice(0, 152)}...` : vendor.description;

  return {
    title: `${vendor.name} — ${vendor.tagline} | Handsy Market`,
    description,
    alternates: {
      canonical: `/vendor/${vendor.slug}`,
    },
    openGraph: {
      title: `${vendor.name} — ${vendor.tagline}`,
      description,
      images: [{ url: vendor.coverImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${vendor.name} — ${vendor.tagline}`,
      description,
      images: [vendor.coverImage],
    },
  };
};

const VendorStorefrontPage = async ({ params }: PageProps) => {
  const { vendorName } = await params;
  const brand = await getVendorBySlug(vendorName);
  if (!brand) notFound();

  // Categories come from the maker's own products, so the filter pills can
  // never offer a category that matches nothing.
  const { products, categories } = await getVendorProducts(brand.slug);
  const vendor = toVendorType(brand, categories);
  // `VendorProductType` is a ProductType tagged with its maker; the tag is part
  // of the component's contract even though it renders nothing today.
  const vendorProducts = products.map((product) => ({ ...product, vendorSlug: brand.slug }));
  // Straight from the aggregate rather than parsed back out of the display
  // string, which loses precision once it reads "1.2k".
  const reviewCount = brand.reviewCount || undefined;

  // TODO: once a canonical NEXT_PUBLIC_SITE_URL is available, prefix these with the absolute
  // origin instead of a site-relative path, and swap the product `url`s for real per-product
  // detail routes once products have slugs.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: vendor.name,
    description: vendor.description,
    image: vendor.coverImage,
    url: `/vendor/${vendor.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: vendor.location,
    },
    ...(reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: vendor.rating,
            reviewCount,
          },
        }
      : {}),
    makesOffer: products.map((product) => ({
      "@type": "Offer",
      name: product.title,
      price: product.price,
      priceCurrency: product.currency,
      url: productPath(product),
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <VendorHero vendor={vendor} productCount={products.length} />
      <VendorAbout vendor={vendor} />
      <VendorProducts vendor={vendor} products={vendorProducts} />
      <section aria-label={`Why shop with ${vendor.name} on Handsy Market`} className="border-t border-gray-2 bg-home-bg-1 py-8">
        <div className="container">
          <TrustBadges
            items={trustItems}
            className="grid-cols-2 gap-x-4 gap-y-6 divide-x-0 sm:grid-cols-4 sm:divide-x"
          />
        </div>
      </section>
      <Newsletter />
    </main>
  );
};

export default VendorStorefrontPage;
