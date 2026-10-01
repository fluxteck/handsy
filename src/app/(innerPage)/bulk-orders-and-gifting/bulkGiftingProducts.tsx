import Link from "next/link";
import Card, {
  CardFooter,
  CardHeader,
  CardIcons,
  CardImg,
  CardLabel,
  CardPriceEnhanced,
  CardTitle,
} from "@/components/ui/card";
import { productPath } from "@/lib/productPath";
import type { ProductType } from "@/types/productType";

/** Real catalogue products, rendered with the site's standard product card. */
const BulkGiftingProducts = ({ products }: { products: ProductType[] }) => {
  if (!products.length) return null;

  return (
    <section className="container lg:py-25 py-15" aria-label="Popular gifting and bulk products">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Popular Picks <span className="h-px w-8 bg-gray-2" aria-hidden />
          </p>
          <h5 className="mt-3">Customer favourites for gifting</h5>
          <p className="mt-4 text-gray-1-foreground leading-[170%]">
            Any of these can be ordered in bulk — ask about quantities and personalisation in your enquiry.
          </p>
        </div>
        <Link href="/shop" className="text-secondary-foreground font-medium multiline-hover">
          View all products
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-15">
        {products.map((prd) => (
          <Card key={prd.id}>
            <CardHeader>
              <CardImg src={prd.thumbnail} height={400} width={340} path={productPath(prd)} />
              <CardLabel isLabel={prd.label ? prd.label : false}>{prd.label}</CardLabel>
              <CardIcons product={prd} />
            </CardHeader>
            <CardFooter>
              <CardTitle path={productPath(prd)}>{prd.title}</CardTitle>
              <CardPriceEnhanced
                price={prd.price}
                discountPercentage={prd.discountPercentage}
                finalPrice={prd.sellingPrice}
                currency={prd.currency}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BulkGiftingProducts;
