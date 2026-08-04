import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Close } from "@/lib/icon";
import Image from "next/image";
import Link from "next/link";
import ProductShortInfo from "./productShortInfo";

export type ProductQuickViewType = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  product: {
    id: string | number;
    thumbnail: string;
    title: string;
    description?: string;
    price: number;
    discountPercentage: number;
    rating?: number;
    totalRating?: string;
    stock: number;
    category?: string;
    tags?: [""];
  };
};
const ProductQuickView = ({
  isDialogOpen,
  setIsDialogOpen,
  product,
}: ProductQuickViewType) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* <DialogTrigger className='text-primary-foreground'>Open</DialogTrigger> */}
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[min(1230px,calc(100%-2rem))] p-0 border-0 overflow-visible"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <DialogClose
          aria-label="Close quick view"
          className="absolute z-10 flex justify-center items-center border-none transition-all duration-500 right-3 top-3 w-10 h-10 rounded-full bg-black/40 text-white hover:text-white"
        >
          <Close className="w-5 h-5" />
        </DialogClose>
        <div className="max-h-[92vh] h-full flex md:flex-row flex-col items-start gap-10 lg:p-8 p-5 overflow-y-auto scrollbar-hidden">
          <div className="md:max-w-[380px] w-full relative bg-[#F2F2F2] rounded-lg">
            <Image
              width={560}
              height={600}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              src={product.thumbnail}
              className="object-contain"
              alt="img"
            />
            <Link
              href="/product-details"
              className="block w-full bg-primary text-white text-center text-xl font-medium leading-[150%] py-[15px] px-7.5 absolute bottom-0 left-0 cursor-pointer"
            >
              View Details
            </Link>
          </div>
          <ProductShortInfo
            id={product.id}
            thumbnail={product.thumbnail}
            title={product?.title}
            price={product.price}
            discountPercentage={product.discountPercentage}
            stock={product.stock}
            compact
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
