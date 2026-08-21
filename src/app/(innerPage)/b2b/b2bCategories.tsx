import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "Furniture", path: "/category/furniture", image: "/images/home-1/top-collections/img-1.webp" },
  { label: "Home Decor", path: "/category/home-decor", image: "/images/home-1/top-collections/img-2.webp" },
  { label: "Lamps & Lighting", path: "/category/lamps-lighting", image: "/images/home-1/top-collections/img-3.webp" },
  { label: "Kitchen & Dining", path: "/category/kitchen-dining", image: "/images/home-1/top-collections/img-4.webp" },
  { label: "Luxury", path: "/category/luxury", image: "/images/home-1/top-collections/img-5.webp" },
  { label: "Modular", path: "/category/modular", image: "/images/home-1/top-collections/img-6.webp" },
];

const B2bCategories = () => {
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
            href="/shop-2"
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
