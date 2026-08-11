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

/** Everything Quick View needs to match the PDP. The 6 core fields are required (every
 * call site already has these); the richer PDP fields are optional so trigger sites with
 * a slimmer product shape (e.g. the compare table's Redux-stored entries) still degrade
 * gracefully instead of breaking. */
export type ProductQuickViewProduct = Pick<
  ProductType,
  "id" | "thumbnail" | "title" | "price" | "discountPercentage" | "stock"
> &
  Partial<Pick<ProductType, "images" | "colors" | "description" | "category">>;

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
        className="sm:max-w-[min(880px,calc(100%-2rem))] p-0 border-0 overflow-visible"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <DialogClose
          aria-label="Close quick view"
          className="absolute z-10 flex justify-center items-center border-none transition-all duration-500 right-3 top-3 w-10 h-10 rounded-full bg-black/40 text-white hover:text-white"
        >
          <Close className="w-5 h-5" />
        </DialogClose>
        <div className="max-h-[92vh] h-full flex md:flex-row flex-col items-start gap-7.5 lg:p-8 p-5 overflow-y-auto scrollbar-hidden">
          <div className="md:max-w-[320px] w-full shrink-0">
            <ProductGalleryVertical images={images} showThumbnails={false} enableZoom={false} />
            <Button asChild className="w-full mt-4">
              <Link href="/product-details">View Full Details</Link>
            </Button>
          </div>
          <div className="min-w-0 w-full">
            <ProductInfoDetails
              id={product.id}
              title={product.title}
              price={product.price}
              discountPercentage={product.discountPercentage}
              thumbnail={product.thumbnail}
              stock={product.stock}
              colors={colors}
              offers={[]}
              description={product.description}
              compact
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
