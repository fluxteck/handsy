import Image from "next/image";
import Link from "next/link";
import { getHomeCategories } from "@/lib/sdk";

/** Six tiles fill the grid without leaving a ragged final row. */
const B2B_CATEGORY_LIMIT = 6;

/**
 * Artwork for the tiles, cycled by index.
 *
 * The categories themselves come from the catalogue, but the catalogue's own
 * `imageUrl` is often unset and these tiles are large — so rather than render
 * holes, the template's photography is reused deterministically, the same
 * approach `lib/mappers/category.ts` takes for the homepage tiles.
 */
const TILE_IMAGES = [
  "/images/home-1/top-collections/img-1.webp",
  "/images/home-1/top-collections/img-2.webp",
  "/images/home-1/top-collections/img-3.webp",
  "/images/home-1/top-collections/img-4.webp",
  "/images/home-1/top-collections/img-5.webp",
  "/images/home-1/top-collections/img-6.webp",
];

const B2bCategories = async () => {
  // Previously a hardcoded list of the template's categories — Furniture,
  // Luxury, Modular and so on — none of which exist in this catalogue, so every
  // tile linked to a page that matched nothing.
  const categories = (await getHomeCategories())
    .filter((category) => Boolean(category.value))
    .slice(0, B2B_CATEGORY_LIMIT)
    .map((category, index) => ({
      label: category.categoryName,
      path: `/category/${category.value}`,
      image: category.categoryImg || TILE_IMAGES[index % TILE_IMAGES.length]!,
    }));

  if (!categories.length) return null;

  return (
    <section id="categories" className="bg-home-bg-1 lg:py-25 py-15" aria-label="Featured B2B product categories">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
              Product Range <span className="h-px w-8 bg-gray-2" aria-hidden />
            </p>
            <h5 className="mt-3">Featured categories for business orders</h5>
          </div>
          <Link
            href="/shop"
            className="text-secondary-foreground font-medium multiline-hover"
          >
            View full catalog
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-6 sm:grid-cols-3">
          {categories.map(({ label, path, image }) => (
            <Link key={path} href={path} className="group block">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image
                  src={image}
                  alt={`${label} for wholesale and bulk orders`}
                  fill
                  sizes="(min-width: 1024px) 16vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-center font-medium text-secondary-foreground">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2bCategories;
