import InstagramGallery from "@/components/sections/instagramGallery";
import Newsletter from "@/components/sections/newsletter";
import ProductGalleryVertical from "@/components/sections/shopDetails/productGalleryVertical";
import ProductInfoDetails from "@/components/sections/shopDetails/productInfoDetails";
import ProductAccordionInfo from "@/components/sections/shopDetails/productAccordionInfo";
import NeedHelp from "@/components/sections/shopDetails/needHelp";
import RelatedProducts from "@/components/sections/shopDetails/relatedProducts";
import ProductReviews from "@/components/sections/shopDetails/productReviews";
import PageHeader from "@/components/sections/pageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details.",
};

const productImages = [
  "/images/product-details/img-1.webp",
  "/images/product-details/img-2.webp",
  "/images/product-details/img-3.webp",
  "/images/product-details/img-4.webp",
  "/images/product-details/img-5.webp",
];

const productColors = [
  { code: "#1E2A38", label: "Blue", image: "/images/product-details/img-1.webp" },
  { code: "#EDE7DD", label: "White", image: "/images/product-details/img-3.webp" },
];

const productOffers = [
  { code: "SAVE150", description: "Use code at checkout on orders worth Rs. 4000 and above" },
  { code: "SAVE300", description: "Use code at checkout on orders worth Rs. 8500 and above" },
];

const ProductDetailsOne = () => {
  return (
    <main>
      <PageHeader
        pageTitle="Opal Accent Chair"
        breadcrumbLink="/shop-2"
        breadcrumbLabel="Accent Chair"
        currentPage="Opal Accent Chair"
      />
      <div className="container pt-8 lg:pt-10">
        <div className="flex flex-col md:flex-row md:items-start gap-x-10 xl:gap-x-15">
          <div className="contents md:flex md:min-w-0 md:w-1/2 md:flex-col lg:w-[52%]">
            <div className="order-1 min-w-0">
              <ProductGalleryVertical images={productImages} badge="Monsoon Deals" />
            </div>
            <div className="order-3 min-w-0">
              <ProductAccordionInfo
                description="The Opal Accent Chair pairs a sculptural bouclé frame with a solid wood base, bringing a soft, contemporary silhouette to any living space. Generously padded seating and a gently curved backrest offer lasting comfort, while the compact footprint makes it easy to place in smaller rooms."
                shippingAndReplacement="Orders are dispatched within 2-3 business days and typically arrive within 5-7 business days, depending on your location. If your item arrives damaged or defective, we'll arrange a free replacement within 7 days of delivery — no questions asked."
                returnsPolicy="We offer a 15-day, hassle-free return and exchange window from the date of delivery. Items must be unused and in their original packaging. Reach out to our support team to start a return or exchange."
                additionalInfo={[
                  { label: "Material", value: "Bouclé fabric, solid wood legs" },
                  { label: "Dimensions", value: "68 x 74 x 76 cm (W x D x H)" },
                  { label: "Weight Capacity", value: "120 kg" },
                  { label: "Assembly", value: "Minimal assembly required" },
                ]}
              />
            </div>
          </div>
          <div className="contents md:flex md:min-w-0 md:flex-1 md:flex-col">
            <div className="order-2 min-w-0 mt-7.5 md:mt-0">
              <ProductInfoDetails
                id={1}
                title="Opal Accent Chair"
                price={45799}
                discountPercentage={25.91}
                thumbnail="/images/product-details/img-1.webp"
                stock={99}
                colors={productColors}
                offers={productOffers}
              />
            </div>
            <NeedHelp className="order-4 min-w-0 mt-7.5 lg:self-stretch" />
          </div>
        </div>
      </div>
      <ProductReviews productId={1} productName="Opal Accent Chair" />
      <RelatedProducts />
      <Newsletter />
      <InstagramGallery />
    </main>
  );
};

export default ProductDetailsOne;
