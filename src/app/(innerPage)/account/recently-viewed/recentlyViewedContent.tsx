"use client";

import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import Card, { CardDiscount, CardFooter, CardHeader, CardIcons, CardImg, CardLabel, CardPriceEnhanced, CardTitle } from "@/components/ui/card";
import { productPath } from "@/lib/productPath";
import { toProductTypes } from "@/lib/mappers/product";
import { useRecentlyViewed } from "@commercekitsdk/react";
import { Clock } from "lucide-react";
import { useMemo } from "react";

/**
 * The rail on other pages shows the last few; this is the fuller history.
 *
 * Capped at 12 rather than the 20 kept in storage because there is no
 * fetch-many-by-id in the adapter contract, so each product costs one
 * `products.get` — and on this server that is a full product hydrate. Twelve
 * keeps the page to one parallel burst that a free-tier database can absorb.
 * See the note in BUILD-ORDER.md about adding a bulk lookup.
 */
const HISTORY_LIMIT = 12;

const RecentlyViewedContent = () => {
    // Browser-only: the ids live in `localStorage`, written by the product
    // detail page. Hydrated through the SDK so prices and stock are current.
    const { products, isLoading } = useRecentlyViewed({ limit: HISTORY_LIMIT });
    const items = useMemo(() => toProductTypes(products), [products]);

    return (
        <Panel>
            <PanelHeading title="Recently Viewed" description="Products you've looked at recently." />
            {items.length ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((product) => (
                        <Card key={product.id}>
                            <CardHeader>
                                <CardImg src={product.thumbnail} height={400} width={340} path={productPath(product)} />
                                <CardLabel isLabel={product.label ? product.label : false}>{product.label}</CardLabel>
                                <CardDiscount isDiscountTrue={product.discountPercentage ? product.discountPercentage : false}>
                                    -{product.discountPercentage}%
                                </CardDiscount>
                                <CardIcons product={product} />
                            </CardHeader>
                            <CardFooter>
                                <CardTitle path={productPath(product)}>{product.title}</CardTitle>
                                <CardPriceEnhanced price={product.price} discountPercentage={product.discountPercentage} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                /* "Nothing viewed yet" is only true once storage has been read —
                   it cannot be during a server render. */
                <EmptyState
                    icon={Clock}
                    title={isLoading ? "Loading your history…" : "Nothing viewed yet"}
                    description={
                        isLoading
                            ? "One moment."
                            : "Products you browse will show up here for quick access."
                    }
                />
            )}
        </Panel>
    );
};

export default RecentlyViewedContent;
