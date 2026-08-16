import Breadcrumb, { BreadcrumbItemType } from "@/components/ui/breadcrumb";

type PropsType = {
  pageTitle: string;
  breadcrumbLink?: string;
  breadcrumbLabel?: string;
  currentPage: string;
  /** Set false on pages that already render their own visible <h1> elsewhere, to avoid a duplicate. */
  renderHeading?: boolean;
  /** Escape hatch for trails deeper than Home > [one link] > Current — supply the full items array directly. */
  items?: BreadcrumbItemType[];
};

const PageHeader = ({
  pageTitle,
  breadcrumbLink,
  breadcrumbLabel,
  currentPage,
  renderHeading = true,
  items,
}: PropsType) => {
  const breadcrumbItems: BreadcrumbItemType[] = items ?? [
    { label: "Home", href: "/" },
    ...(breadcrumbLink ? [{ label: breadcrumbLabel ?? "", href: breadcrumbLink }] : []),
    { label: currentPage },
  ];

  return (
    <section className="border-y border-border bg-background">
      <div className="container">
        {renderHeading && <h1 className="sr-only">{pageTitle}</h1>}
        <Breadcrumb
          items={breadcrumbItems}
          className="py-2 lg:py-2.5 [&_a]:text-sm [&_span]:text-sm"
        />
      </div>
    </section>
  );
};

export default PageHeader;
