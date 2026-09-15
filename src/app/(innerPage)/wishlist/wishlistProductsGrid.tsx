"use client";
import Card, {
  CardDiscount,
  CardFooter,
  CardHeader,
  CardIcons,
  CardImg,
  CardLabel,
  CardPriceEnhanced,
  CardSoldOut,
  CardTitle,
} from "@/components/ui/card";
import Tooltip from "@/components/ui/tooltip";
import ShopEmptyState from "@/components/ui/shopEmptyState";
import { Heart, ShopCart } from "@/lib/icon";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { productPath } from "@/lib/productPath";
import type { CategoryLink } from "@/lib/categoryLinks";

const WishlistProductsGrid = ({ categories = [] }: { categories?: CategoryLink[] }) => {
  const { products, remove, isLoading } = useWishlist();
  const { add: addToCartLine } = useCart();

  if (!products.length) {
    // "Empty" is only true once the fetch has finished. A signed-in customer
    // with saved items would otherwise be told their wishlist is empty while
    // it is still loading.
    return (
      <div className="container lg:pt-25 lg:pb-25 pt-15 pb-15">
        <ShopEmptyState
          categories={categories}
          icon={Heart}
          title={isLoading ? "Loading your wishlist…" : "Your Wishlist is Empty"}
          description={isLoading ? "One moment." : "Save the pieces you love and shop them whenever you're ready"}
          ctaLabel="Explore Products"
          ctaHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container lg:pt-20 lg:pb-25 pt-12 pb-15">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-7.5">
        <div>
          <p className="text-heading font-semibold text-secondary-foreground">My Wishlist</p>
          <p className="text-gray-1-foreground text-sm mt-1">
            {products.length} {products.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
        {products.map((product) => {
          const path = productPath(product);
          return (
            <Card key={product.id}>
              <CardHeader>
                <div className="absolute top-3 right-3 z-10">
                  <Tooltip text="Add to cart">
                    <button
                      type="button"
                      aria-label={`Add ${product.title} to cart`}
                      onClick={() =>
                        void addToCartLine({
                          variantId: product.variantId,
                          quantity: 1,
                          title: product.title,
                          thumbnail: product.thumbnail,
                          price: product.price,
                          currency: product.currency,
                        })
                      }
                      className="flex items-center justify-center size-8 rounded-full bg-background/90 text-gray-1-foreground shadow-sm hover:bg-primary hover:text-white transition-colors duration-300"
                    >
                      <ShopCart className="size-3.5" />
                    </button>
                  </Tooltip>
                </div>
                <CardImg src={product.thumbnail} height={320} width={280} path={path} />
                <CardLabel isLabel={product.label ? product.label : false}>
                  {product.label}
                </CardLabel>
                <CardDiscount
                  isDiscountTrue={product.discountPercentage ? product.discountPercentage : false}
                >
                  -{product.discountPercentage}%
                </CardDiscount>
                <CardSoldOut isStockTrue={product.stock}>Sold out</CardSoldOut>
                <CardIcons product={product} hideWishlist onRemove={() => void remove(product.id)} />
              </CardHeader>
              <CardFooter>
                <CardTitle path={path}>{product.title}</CardTitle>
                <CardPriceEnhanced
                  price={product.price}
                  discountPercentage={product.discountPercentage}
                  finalPrice={product.sellingPrice}
                  currency={product.currency}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistProductsGrid;
