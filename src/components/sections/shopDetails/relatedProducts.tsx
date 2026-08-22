import Card, { CardDiscount, CardFooter, CardHeader, CardIcons, CardImg, CardLabel, CardPriceEnhanced, CardTitle } from '@/components/ui/card';
import { getProductsData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ProductType } from '@/types/productType';
import { productPath } from '@/lib/productPath'

/** `products` comes from the catalog on SDK-backed pages; without it the
 *  component falls back to the static data the other pages still use. */
const RelatedProducts = async ({ className, products }: { className?: string; products?: ProductType[] }) => {
    const featuredProducts: ProductType[] = products ?? (await getProductsData()).featuredProducts;
    return (
        <section className={cn('lg:pt-25 lg:pb-25 pt-15 pb-15', className)}>
            <div className='container'>
                <b className='text-heading text-secondary-foreground font-semibold block lg:mb-7.5 mb-5'>Related Products</b>
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 lg:gap-y-15 gap-y-10'>
                    {
                        featuredProducts.slice(0, 4).map((prd) => {
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

export default RelatedProducts