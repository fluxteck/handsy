import InstagramGallery from "@/components/sections/instagramGallery";
import Newsletter from "@/components/sections/newsletter";
import ProductDetailsTabView from "@/components/sections/shopDetails/productDetailsTabView";
import ProductGalleryVertical from "@/components/sections/shopDetails/productGalleryVertical";
import ProductInfoDetails from "@/components/sections/shopDetails/productInfoDetails";
import ProductAccordionInfo from "@/components/sections/shopDetails/productAccordionInfo";
import RelatedProducts from "@/components/sections/shopDetails/relatedProducts";
import Breadcrumb from "@/components/ui/breadcrumb";
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
      <div className="container">
        <Breadcrumb
          className="lg:mt-25 mt-15 mb-7.5"
          items={[
            { label: "Home", href: "/" },
            { label: "Accent Chair", href: "/shop" },
            { label: "Opal Accent Chair" },
          ]}
        />
        <div className="grid lg:grid-cols-[52%_auto] md:grid-cols-2 grid-cols-1 items-start xl:gap-15 gap-10">
          <div>
            <ProductGalleryVertical images={productImages} badge="Monsoon Deals" />
            <ProductAccordionInfo
              description="The Opal Accent Chair pairs a sculptural bouclé frame with a solid wood base, bringing a soft, contemporary silhouette to any living space. Generously padded seating and a gently curved backrest offer lasting comfort, while the compact footprint makes it easy to place in smaller rooms."
              returnsPolicy="We offer a 15-day, hassle-free return and exchange window from the date of delivery. Items must be unused and in their original packaging. Reach out to our support team to start a return or exchange."
              additionalInfo={[
                { label: "Material", value: "Bouclé fabric, solid wood legs" },
                { label: "Dimensions", value: "68 x 74 x 76 cm (W x D x H)" },
                { label: "Weight Capacity", value: "120 kg" },
                { label: "Assembly", value: "Minimal assembly required" },
              ]}
            />
          </div>
          <ProductInfoDetails
            id={1}
            title="Opal Accent Chair"
            price={45799}
            discountPercentage={25.91}
            thumbnail="/images/product-details/img-1.webp"
            stock={99}
            rating={0}
            totalRating="0"
            colors={productColors}
            offers={productOffers}
          />
        </div>
        <ProductDetailsTabView />
      </div>
      <RelatedProducts />
      <Newsletter />
      <InstagramGallery />
    </main>
  );
};

export default ProductDetailsOne;
