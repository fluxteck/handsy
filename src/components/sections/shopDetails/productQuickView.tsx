import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Close } from "@/lib/icon";
import { ProductType } from "@/types/productType";
import Link from "next/link";
import ProductGalleryVertical from "./productGalleryVertical";
import ProductInfoDetails, { ProductColorType } from "./productInfoDetails";
import { productPath } from "@/lib/productPath";

/** Everything Quick View needs to match the PDP. The 6 core fields are required (every
 * call site already has these); the richer PDP fields are optional so trigger sites with
 * a slimmer product shape still degrade gracefully instead of breaking. */
export type ProductQuickViewProduct = Pick<
  ProductType,
  "id" | "thumbnail" | "title" | "price" | "discountPercentage" | "stock" | "variantId"
> &
  // `slug` rides along so the quick view can link to the real detail page;
  // optional because callers seed this state with an empty placeholder product.
  Partial<Pick<ProductType, "images" | "colors" | "description" | "category" | "slug" | "sellingPrice">>;

export type ProductQuickViewType = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  product: ProductQuickViewProduct;
};

const ProductQuickView = ({
  isDialogOpen,
  setIsDialogOpen,
  product,
}: ProductQuickViewType) => {
  const images = product.images?.length ? product.images : [product.thumbnail];

  const colors: ProductColorType[] = (product.colors ?? []).map((color, index) => ({
    code: color.code,
    label: `Color ${index + 1}`,
    image: color.image || product.thumbnail,
  }));

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[min(880px,calc(100%-2rem))] max-sm:max-w-[calc(100%-1.5rem)] p-0 border-0 overflow-visible"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <DialogClose
          aria-label="Close quick view"
          className="absolute z-10 flex justify-center items-center border-none transition-all duration-500 right-3 top-3 w-10 h-10 max-md:right-2.5 max-md:top-2.5 max-md:size-8 rounded-full bg-black/40 text-white hover:text-white"
        >
          <Close className="w-5 h-5 max-md:size-4" />
        </DialogClose>
        <div className="max-h-[92vh] h-full flex md:flex-row flex-col items-start gap-7.5 lg:p-8 p-5 max-md:max-h-[90dvh] max-md:gap-3 max-md:p-3 overflow-y-auto scrollbar-hidden">
          {/* Below md the column dissolves so "View Full Details" can drop
              under the buy controls; the image keeps its full-width square and
              is cropped to fill it rather than letterboxed. */}
          <div className="md:max-w-[320px] w-full shrink-0 max-md:contents">
            <div className="w-full max-md:order-1 max-md:[&_img]:object-cover">
              <ProductGalleryVertical images={images} showThumbnails={false} enableZoom={false} />
            </div>
            <Button asChild className="w-full mt-4 max-md:order-3 max-md:mt-0 max-md:h-9 max-md:text-sm">
              <Link href={productPath(product)}>View Full Details</Link>
            </Button>
          </div>
          <div className="min-w-0 w-full max-md:order-2 max-md:px-1">
            <ProductInfoDetails
              id={product.id}
              title={product.title}
              price={product.price}
              discountPercentage={product.discountPercentage}
              sellingPrice={product.sellingPrice}
              thumbnail={product.thumbnail}
              stock={product.stock}
              colors={colors}
              offers={[]}
              variantId={product.variantId}
              description={product.description}
              compact
              titleHref={productPath(product)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
