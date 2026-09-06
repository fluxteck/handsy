'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Close, Eye } from '@/lib/icon'
import { Button } from '@/components/ui/button'
import ProductQuickView, { ProductQuickViewProduct } from '@/components/sections/shopDetails/productQuickView'
import calcluteDiscount from '@/lib/calcluteDiscount'
import currencyFormatter from 'currency-formatter';
import { useAppSelector } from '@/lib/reduxHooks'
import { useDispatch } from 'react-redux'
import { removeToCompare, MAX_COMPARE, type CompareType } from '@/lib/features/CompareProductsSlice'
import { useCart } from "@/lib/cart/cart-context";

/**
 * Attribute rows, in the order a shopper weighs them up.
 *
 * Driven by data rather than hand-written blocks so a row cannot exist for one
 * column and not another — the old table repeated its markup per product and
 * printed a hardcoded SKU as a result.
 *
 * `value` returns what is shown; `key` is what "differences only" compares, so
 * two products can render differently (a swatch, a formatted price) and still
 * count as the same value.
 */
interface Row {
  label: string;
  value: (p: CompareType) => React.ReactNode;
  key: (p: CompareType) => string;
}

const ROWS: Row[] = [
  {
    label: "Price",
    key: (p) => String(p.sellingPrice ?? calcluteDiscount(p.price, p.discountPercentage)),
    value: (p) => {
      const code = p.currency || "USD";
      const final = p.sellingPrice ?? (p.discountPercentage ? calcluteDiscount(p.price, p.discountPercentage) : p.price);
      return (
        <span className="text-secondary-foreground lg:text-xl text-lg">
          {final !== p.price && (
            <del className="text-gray-3-foreground font-normal mr-1.5">
              {currencyFormatter.format(p.price, { code })}
            </del>
          )}
          <span>{currencyFormatter.format(final, { code })}</span>
        </span>
      );
    },
  },
  {
    label: "Availability",
    key: (p) => (p.stock ? "in" : "out"),
    value: (p) =>
      p.stock ? (
        <span className="text-[#66995C] lg:text-xl text-lg">In stock</span>
      ) : (
        <span className="lg:text-xl text-lg text-secondary-foreground">Out of stock</span>
      ),
  },
  {
    label: "Rating",
    key: (p) => String(p.rating ?? ""),
    value: (p) =>
      p.rating ? (
        <span className="text-secondary-foreground lg:text-xl text-lg">
          {p.rating.toFixed(1)}
          {p.totalRating ? (
            <span className="text-gray-3-foreground text-base ml-1.5">({p.totalRating})</span>
          ) : null}
        </span>
      ) : (
        <Blank />
      ),
  },
  {
    label: "Brand",
    key: (p) => p.brand ?? "",
    value: (p) => (p.brand ? <Text>{p.brand}</Text> : <Blank />),
  },
  {
    label: "Category",
    key: (p) => p.category ?? "",
    value: (p) => (p.category ? <Text>{p.category}</Text> : <Blank />),
  },
  {
    label: "Colours",
    key: (p) => (p.colors ?? []).join(","),
    value: (p) =>
      p.colors?.length ? (
        <span className="flex flex-wrap items-center gap-1.5">
          {p.colors.map((c: string) => (
            <span
              key={c}
              title={c}
              style={{ backgroundColor: c }}
              className="size-5 rounded-full border border-gray-3-foreground/40"
            />
          ))}
        </span>
      ) : (
        <Blank />
      ),
  },
  {
    label: "Sizes",
    key: (p) => (p.sizes ?? []).join(","),
    value: (p) => (p.sizes?.length ? <Text>{p.sizes.join(", ")}</Text> : <Blank />),
  },
];

const Text = ({ children }: { children: React.ReactNode }) => (
  <span className="text-secondary-foreground lg:text-xl text-lg capitalize">{children}</span>
);

/** An attribute this product does not carry — shown, not skipped, so the
 *  columns stay aligned and the absence is itself a comparison. */
const Blank = () => <span className="text-gray-3-foreground lg:text-xl text-lg">—</span>;

const CompareTable = () => {
  const products = useAppSelector((data) => data.productCompare.products);
  const { add: addToCartLine } = useCart();
  /* Off by default: a shopper opening the page wants the full picture first.
     The toggle is for once they have it and want the decision narrowed — the
     usability guidance on comparison tables calls out identical rows as pure
     cognitive load. */
  const [differencesOnly, setDifferencesOnly] = useState(false);

  const rows = differencesOnly
    ? ROWS.filter((r) => new Set(products.map(r.key)).size > 1)
    : ROWS;

  if (products.length === 0) {
    return (
      <div className="container lg:pt-25 lg:pb-25 pt-15 pb-15 text-center">
        <p className="text-secondary-foreground font-semibold text-2xl capitalize">
          No products in your comparison yet
        </p>
        <p className="text-gray-3-foreground mt-2">
          Use the compare icon on any product to line it up against others.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-6 text-secondary-foreground underline underline-offset-4"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container lg:pt-25 lg:pb-25 pt-15 pb-15">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-gray-3-foreground">
          Comparing {products.length} of {MAX_COMPARE}
        </p>
        <label className="flex items-center gap-2 text-secondary-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={differencesOnly}
            onChange={(e) => setDifferencesOnly(e.target.checked)}
          />
          Show only differences
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              {/* Sticky, so the attribute names stay put while the columns
                  scroll — without it a shopper three columns across has to
                  remember which row is which. */}
              <th className="sticky left-0 z-10 bg-white align-top px-2.5 pb-8 2xl:w-[280px] lg:w-[200px] sm:w-[140px] w-[92px]">
                <span className="font-medium lg:text-xl sm:text-lg text-sm text-secondary-foreground">
                  Products
                </span>
              </th>
              {products.map((p) => (
                <th key={p.id} className="align-top px-2.5 pb-8 font-normal border-b">
                  <Card
                    id={p.id}
                    thumbnail={p.thumbnail}
                    title={p.title}
                    price={p.price}
                    discountPercentage={p.discountPercentage}
                    stock={p.stock}
                    slug={p.slug}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                {/* Narrow and wrapping on a phone: at 92px the label still
                    reads, and every pixel saved here is a pixel of the product
                    column the shopper is actually comparing. */}
                <th className="sticky left-0 z-10 bg-white border-b py-8 px-2.5 align-top font-medium lg:text-xl sm:text-lg text-sm text-secondary-foreground">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td key={p.id} className="border-b py-8 px-2.5 align-top">
                    {row.value(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="sticky left-0 z-10 bg-white border-b py-8 px-2.5 align-middle font-medium lg:text-xl sm:text-lg text-sm text-secondary-foreground">
                Add to cart
              </th>
              {products.map((p) => (
                <td key={p.id} className="border-b py-8 px-2.5">
                  <Button
                    onClick={() => void addToCartLine({ variantId: p.variantId, quantity: 1, title: p.title })}
                    size={"sm"}
                    disabled={!p.stock}
                  >
                    {p.stock ? "Add to Cart" : "Out of stock"}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {differencesOnly && rows.length === 0 && (
        <p className="text-gray-3-foreground mt-6">
          These products match on every attribute compared here.
        </p>
      )}
    </div>
  );
};

export default CompareTable

type CardProps = {
    id: number | string,
    stock: number,
    title: string,
    thumbnail: string,
    price: number,
    discountPercentage: number,
    /** Links the title to the product page; absent on the static sample data. */
    slug?: string,
}
const Card = ({ id, title, thumbnail, price, discountPercentage, stock, slug }: CardProps) => {
    const dispatch = useDispatch()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [product, setProduct] = useState<ProductQuickViewProduct>({ id: 0, thumbnail: "", title: "", price: 0, discountPercentage: 0, stock: 0 })

    return (
        <div>
            <p onClick={() => dispatch(removeToCompare(id))} className='text-gray-3-foreground leading-[150%] text-base flex items-center gap-1.5 cursor-pointer hover:text-secondary-foreground transition-all duration-500'>
                <Close className='size-4 inline' /> Remove
            </p>
            <div className='bg-home-bg-1 mt-3 xl:w-[230px] 2xl:h-[230px] sm:w-[210px] sm:h-[220px] w-[150px] h-[150px] rounded-xl'>
                <Image width={230} height={230} sizes='100vw' src={thumbnail} alt='img' className='w-full rounded-xl max-h-[230px] object-cover' />
            </div>
            <div className='flex justify-between items-center mt-3'>
                <Link href={slug ? `/product-details/${slug}` : "#"} className='text-secondary-foreground font-medium text-lg capitalize line-clamp-1 max-w-[200px] multiline-hover'>{title}</Link>
                <div
                    onClick={() => { setIsDialogOpen(true), setProduct({ id, thumbnail, title, price, discountPercentage, stock }) }}
                    className='w-7.5 h-7.5 rounded-[4px] border text-gray-3-foreground flex justify-center items-center cursor-pointer hover:text-white hover:bg-primary transition-all duration-500'
                >
                    <Eye />
                </div>
            </div>
            <ProductQuickView isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} product={product} />
        </div>
    )
}