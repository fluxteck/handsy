'use client'
import React from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import currencyFormatter from 'currency-formatter';
import { Button } from '@/components/ui/button'
import ShopEmptyState from '@/components/ui/shopEmptyState'
import { Close, Heart } from '@/lib/icon'
import calcluteDiscount from '@/lib/calcluteDiscount'
import Link from 'next/link';
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import { productPath } from '@/lib/productPath';
import type { CategoryLink } from "@/lib/categoryLinks";

const WishlistProductsTable = ({ categories = [] }: { categories?: CategoryLink[] }) => {
    const { add: addToCartLine } = useCart();
    const { products, remove, isLoading } = useWishlist()

    return (
        <div className='container lg:pt-25 lg:pb-25 pt-15 pb-15' >
            {
                products.length ?

                    <Table className='min-w-[1000px]'>
                        <TableHeader className='border-b-[1.5px] border-b-[#E5E2E1]'>
                            <TableRow className='pb-5'>
                                <TableHead className='h-auto px-0 pb-5 lg:text-xl text-lg font-medium text-secondary-foreground'>Product Name</TableHead>
                                <TableHead className='h-auto px-0 pb-5 lg:text-xl text-lg font-medium text-secondary-foreground'>Price</TableHead>
                                <TableHead className='h-auto px-0 pb-5 lg:text-xl text-lg font-medium text-secondary-foreground'>Stock status</TableHead>
                                <TableHead className='h-auto px-0 pb-5 lg:text-xl text-lg font-medium text-secondary-foreground'></TableHead>
                                <TableHead className='h-auto px-0 pb-5 lg:text-xl text-lg font-medium text-secondary-foreground'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='border-b-[1.5px] border-b-[#E5E2E1]'>
                            {
                                products.map(({ color, id, price, size, stock, thumbnail, title, discountPercentage, variantId, slug, currency }) => {
                                    const finalPrice = discountPercentage ? calcluteDiscount(price, discountPercentage) : price;

                                    return (
                                        <TableRow key={id}>
                                            <TableCell className="px-0 py-5 min-[1400px]:w-[570px] lg:w-[500px] w-[350px]">
                                                <div className='flex items-center gap-6 '>
                                                    <div className='bg-home-bg-1'>
                                                        <Image width={70} height={70} src={thumbnail} alt='img' className='max-h-[70px] w-fit object-contain' />
                                                    </div>
                                                    <Link href={productPath({ slug })} className='lg:text-xl text-lg text-secondary-foreground font-medium capitalize line-clamp-1'>{title}</Link>
                                                </div>
                                            </TableCell>
                                            <TableCell className='px-0 py-5 min-[1400px]:w-[300px] lg:w-[220px] w-[150px]'>
                                                <p className='text-lg text-secondary-foreground font-medium '>
                                                    {discountPercentage ? <del className='text-gray-3-foreground font-normal'>{currencyFormatter.format(price, { code: currency || 'USD' })}</del> : null} {' '}
                                                    <span>{currencyFormatter.format(finalPrice, { code: currency || 'USD' })}</span>
                                                </p>
                                            </TableCell>
                                            <TableCell className="px-0 py-5 min-[1400px]:w-[300px] lg:w-[220px] w-[150px]">
                                                {
                                                    stock ?
                                                        <p className='text-[#66995C] text-lg font-medium'>In Stock</p>
                                                        :
                                                        <p className='text-lg font-medium'>Stock Out</p>
                                                }
                                            </TableCell>
                                            <TableCell className="px-0 py-5 ">
                                                <div className='flex items-center gap-15'>
                                                    <Button
                                                        size={"sm"}
                                                        onClick={() => void addToCartLine({ variantId, quantity: 1, title })}
                                                    >
                                                        Add To cart
                                                    </Button>
                                                    <p
                                                        onClick={() => void remove(id)}
                                                        className='cursor-pointer text-gray-1-foreground flex justify-end hover:text-secondary-foreground transition-all duration-500'
                                                    >
                                                        <Close className='size-10' strokeWidth='1.5' />
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    :
                    /* "Empty" is only true once the fetch has finished. A
                       signed-in customer with saved items would otherwise be
                       told their wishlist is empty while it is still loading. */
                    <ShopEmptyState categories={categories}
                        icon={Heart}
                        title={isLoading ? "Loading your wishlist…" : "Your Wishlist is Empty"}
                        description={isLoading ? "One moment." : "Save the pieces you love and shop them whenever you're ready"}
                        ctaLabel="Explore Products"
                        ctaHref="/shop"
                    />
            }
        </div>
    )
}

export default WishlistProductsTable