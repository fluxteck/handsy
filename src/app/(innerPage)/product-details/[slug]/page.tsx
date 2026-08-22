import InstagramGallery from "@/components/sections/instagramGallery";
import Newsletter from "@/components/sections/newsletter";
import ProductGalleryVertical from "@/components/sections/shopDetails/productGalleryVertical";
import ProductInfoDetails from "@/components/sections/shopDetails/productInfoDetails";
import RecordProductView from "@/components/sections/shopDetails/recordProductView";
import ProductAccordionInfo from "@/components/sections/shopDetails/productAccordionInfo";
import NeedHelp from "@/components/sections/shopDetails/needHelp";
import RelatedProducts from "@/components/sections/shopDetails/relatedProducts";
import ProductReviews from "@/components/sections/shopDetails/productReviews";
import Breadcrumb from "@/components/ui/breadcrumb";
import {
  getCategoryName,
  getProductBySlug,
  getProductReviews,
  getRelatedProducts,
} from "@/lib/sdk";
import { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Product detail page, served from handsymarket-server through the SDK.
 *
 * The layout is the static `/product-details` page's, unchanged — same
 * components, same order, same classes. Only the source of the props differs:
 * every value now comes from the catalog instead of being typed into the file.
 *
 * Copy with no catalog equivalent (shipping, returns) stays as written here.
 * It's store policy, identical for every product, and there's no field on the
 * server holding it.
 *
 * ISR at an hour, matching the homepage.
 */
export const revalidate = 3600;

interface RouteParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Details" };

  // Strip any markup the description carries before using it as meta text.
  const description = product.description
    .replace(/<[^>]*>/g, "")
    .slice(0, 160)
    .trim();

  return {
    title: product.title,
    description: description || "View product details.",
    openGraph: {
      title: product.title,
      description: description || undefined,
      type: "website",
      ...(product.thumbnail.startsWith("http")
        ? { images: [{ url: product.thumbnail }] }
        : {}),
    },
  };
}

const ProductDetails = async ({ params }: { params: Promise<RouteParams> }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const primaryCategoryId = product.categoryIds[0];
  const [category, related, reviews] = await Promise.all([
    getCategoryName(primaryCategoryId),
    getRelatedProducts(product.id, primaryCategoryId),
    getProductReviews(product.id),
  ]);

  return (
    <main>
      <div className="container">
        <Breadcrumb
          className="lg:mt-25 mt-15 mb-7.5"
          items={[
            { label: "Home", href: "/" },
            ...(category ? [{ label: category.categoryName, href: "/shop" }] : []),
            { label: product.title },
          ]}
        />
        <div className="flex flex-col md:flex-row md:items-start gap-x-10 xl:gap-x-15">
          <div className="contents md:flex md:min-w-0 md:w-1/2 md:flex-col lg:w-[52%]">
            <div className="order-1 min-w-0">
              <ProductGalleryVertical
                images={product.images}
                badge={product.discountPercentage ? `${product.discountPercentage}% Off` : undefined}
              />
            </div>
            <div className="order-3 min-w-0">
              <ProductAccordionInfo
                description={product.description}
                shippingAndReplacement="Orders are dispatched within 2-3 business days and typically arrive within 5-7 business days, depending on your location. If your item arrives damaged or defective, we'll arrange a free replacement within 7 days of delivery — no questions asked."
                returnsPolicy="We offer a 15-day, hassle-free return and exchange window from the date of delivery. Items must be unused and in their original packaging. Reach out to our support team to start a return or exchange."
                additionalInfo={product.additionalInfo}
              />
            </div>
          </div>
          <div className="contents md:flex md:min-w-0 md:flex-1 md:flex-col">
            <div className="order-2 min-w-0 mt-7.5 md:mt-0">
              <ProductInfoDetails
                id={product.id}
                slug={product.slug}
                title={product.title}
                price={product.price}
                discountPercentage={product.discountPercentage}
                thumbnail={product.thumbnail}
                stock={product.stock}
                colors={product.colors}
                offers={[]}
              />
            </div>
            <NeedHelp className="order-4 min-w-0 mt-7.5 lg:self-stretch" />
          </div>
        </div>
      </div>
      {/* Renders nothing; records this view for the Recently Viewed rail. */}
      <RecordProductView productId={product.id} />
      <ProductReviews productId={product.id} productName={product.title} reviews={reviews} />
      <RelatedProducts products={related} />
      <Newsletter />
      <InstagramGallery />
    </main>
  );
};

export default ProductDetails;
