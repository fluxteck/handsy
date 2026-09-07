import { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/pageHeader";
import Newsletter from "@/components/sections/newsletter";
import InstagramGallery from "@/components/sections/instagramGallery";
import { getCollections } from "@/lib/sdk";
import { getSiteUrl } from "@/lib/config";

/**
 * The collections index.
 *
 * Exists so collections are reachable at all: a collection page nobody can
 * navigate to is only reachable by typing its URL, which is how the maker pages
 * ended up orphaned. It is also what the sitemap and breadcrumbs point at.
 *
 * Revalidated rather than dynamic — this depends on no query string, and
 * collections change far less often than a request arrives.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse curated collections of handcrafted lighting and home decor.",
  alternates: { canonical: `${getSiteUrl()}/collections` },
};

const CollectionsIndex = async () => {
  const collections = await getCollections();

  return (
    <main>
      <PageHeader pageTitle="Collections" currentPage="Collections" renderHeading={false} />
      <section className="container lg:py-25 py-15">
        {collections.length === 0 ? (
          // Distinct from a failure: there are simply none published yet.
          <p className="text-gray-1-foreground">No collections have been published yet.</p>
        ) : (
          <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="block rounded-lg border border-gray-2 p-6 transition-colors duration-300 hover:border-secondary-foreground"
                >
                  <span className="text-lg font-medium text-secondary-foreground capitalize">
                    {collection.name}
                  </span>
                  {collection.description && (
                    <span className="mt-2 block text-sm text-gray-1-foreground line-clamp-2">
                      {collection.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Newsletter />
      <InstagramGallery />
    </main>
  );
};

export default CollectionsIndex;
