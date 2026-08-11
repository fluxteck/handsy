import Card, { CardDiscount, CardFooter, CardHeader, CardIcons, CardImg, CardLabel, CardPriceEnhanced, CardTitle } from '@/components/ui/card';
import { getProductsData, getRecentlyViewedData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ProductType } from '@/types/productType';

const RecentlyViewed = async ({ className, limit = 4 }: { className?: string; limit?: number }) => {
    const recentlyViewed = await getRecentlyViewedData();
    const { featuredProducts }: { featuredProducts: ProductType[] } = await getProductsData();

    const products = recentlyViewed
        .map((entry) => featuredProducts.find((p) => p.id === entry.productId))
        .filter((product): product is ProductType => Boolean(product))
        .slice(0, limit);

    if (!products.length) return null;

    return (
        <section className={cn('lg:pt-25 lg:pb-25 pt-15 pb-15', className)}>
            <div className='container'>
                <b className='text-heading text-secondary-foreground font-semibold block lg:mb-7.5 mb-5'>Recently Viewed</b>
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 lg:gap-y-15 gap-y-10'>
                    {
                        products.map((prd) => {
                            return (
                                <Card key={prd.id}>
                                    <CardHeader>
                                        <CardImg src={prd.thumbnail} height={400} width={340} path="/product-details" />
                                        <CardLabel isLabel={prd.label ? prd.label : false}>{prd.label}</CardLabel>
                                        <CardDiscount isDiscountTrue={prd.discountPercentage ? prd.discountPercentage : false}>-{prd.discountPercentage}%</CardDiscount>
                                        <CardIcons product={prd} />
                                    </CardHeader>
                                    <CardFooter>
                                        <CardTitle path="/product-details">{prd.title}</CardTitle>
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
