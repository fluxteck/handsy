"use client";

import Card, { CardDiscount, CardFooter, CardHeader, CardIcons, CardImg, CardLabel, CardPriceEnhanced, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { productPath } from '@/lib/productPath';
import { toProductTypes } from '@/lib/mappers/product';
import { useRecentlyViewed } from '@commercekitsdk/react';
import { useMemo } from 'react';

/**
 * Products this shopper actually looked at.
 *
 * The list previously sliced the mock featured products, so every visitor saw
 * the same four items regardless of what they had browsed. The ids now come
 * from browser storage (written by the product detail page) and are hydrated
 * through the SDK, so the rail shows current prices and stock rather than a
 * snapshot from when the product was viewed.
 *
 * Client-side by necessity: `localStorage` does not exist during a server
 * render. Nothing is rendered until the list resolves, which also keeps the
 * server and client markup identical.
 */
const RecentlyViewed = ({
    className,
    limit = 4,
    /** Product to leave out — pass the one being viewed on a detail page. */
    exclude,
}: { className?: string; limit?: number; exclude?: string | number }) => {
    const { products, isLoading } = useRecentlyViewed({
        limit,
        ...(exclude !== undefined ? { exclude: String(exclude) } : {}),
    });

    const items = useMemo(() => toProductTypes(products), [products]);

    // A rail with nothing to show is simply absent, exactly as before — and it
    // stays absent while loading rather than flashing an empty heading.
    if (isLoading || !items.length) return null;

    return (
        <section className={cn('lg:pt-25 lg:pb-25 pt-15 pb-15', className)}>
            <div className='container'>
                <b className='text-heading text-secondary-foreground font-semibold block lg:mb-7.5 mb-5'>Recently Viewed</b>
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 lg:gap-y-15 gap-y-10'>
                    {
                        items.map((prd) => {
                            return (
                                <Card key={prd.id}>
                                    <CardHeader>
                                        <CardImg src={prd.thumbnail} height={400} width={340} path={productPath(prd)} />
                                        <CardLabel isLabel={prd.label ? prd.label : false}>{prd.label}</CardLabel>
                                        <CardDiscount isDiscountTrue={prd.discountPercentage ? prd.discountPercentage : false}>-{prd.discountPercentage}%</CardDiscount>
                                        <CardIcons product={prd} />
                                    </CardHeader>
                                    <CardFooter>
                                        <CardTitle path={productPath(prd)}>{prd.title}</CardTitle>
                                        <CardPriceEnhanced price={prd.price} discountPercentage={prd.discountPercentage} />
                                    </CardFooter>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default RecentlyViewed
