import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import Card, { CardDiscount, CardFooter, CardHeader, CardIcons, CardImg, CardLabel, CardPriceEnhanced, CardTitle } from "@/components/ui/card";
import { getProductsData, getRecentlyViewedData } from "@/lib/data";
import { ProductType } from "@/types/productType";
import { Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recently Viewed",
    description: "Products you've recently looked at.",
};

const RecentlyViewedPage = async () => {
    const recentlyViewed = await getRecentlyViewedData();
    const { featuredProducts }: { featuredProducts: ProductType[] } = await getProductsData();

    const products = recentlyViewed
        .map((entry) => featuredProducts.find((p) => p.id === entry.productId))
        .filter((product): product is ProductType => Boolean(product));

    return (
        <Panel>
            <PanelHeading title="Recently Viewed" description="Products you've looked at recently." />
            {products.length ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <Card key={product.id}>
                            <CardHeader>
                                <CardImg src={product.thumbnail} height={400} width={340} path="/product-details" />
                                <CardLabel isLabel={product.label ? product.label : false}>{product.label}</CardLabel>
                                <CardDiscount isDiscountTrue={product.discountPercentage ? product.discountPercentage : false}>
                                    -{product.discountPercentage}%
                                </CardDiscount>
                                <CardIcons product={product} />
                            </CardHeader>
                            <CardFooter>
                                <CardTitle path="/product-details">{product.title}</CardTitle>
                                <CardPriceEnhanced price={product.price} discountPercentage={product.discountPercentage} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Clock}
                    title="Nothing viewed yet"
                    description="Products you browse will show up here for quick access."
                />
            )}
        </Panel>
    );
};

export default RecentlyViewedPage;
