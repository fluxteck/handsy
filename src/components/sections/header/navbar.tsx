'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Tag } from "lucide-react";
import MegaMenu from "./megaMenu";
import { menuType } from "@/db/menuList";
import { ProductType } from "@/types/productType";
import { cn } from "@/lib/utils";
import { categoryIcons } from "./categoryIcons";

const Navbar = ({ data, featuredProducts }: { data: menuType[], featuredProducts: ProductType[] }) => {
    const pathName = usePathname()
    // Opening stays pure-CSS `group-hover` (works instantly, no hydration wait).
    // closedId only force-closes the just-clicked item until the pointer leaves it.
    const [closedId, setClosedId] = useState<string | number | null>(null)

    useEffect(() => {
        setClosedId(null)
    }, [pathName])

    return (
        <nav className="lg:block hidden w-full">
            <ul className="flex w-full">
                {data.map((item) => {
                    const forceClosed = closedId === item.id
                    // Same per-category icon set as the mobile drawer, so the two
                    // surfaces agree on what represents each menu item.
                    const ItemIcon = categoryIcons[item.label] ?? Tag
                    return (
                        <li
                            key={item.id}
                            // `relative` anchors the plain dropdown to this item, as before.
                            // A mega-menu item instead goes `static` at `lg:` (the only
                            // width this nav renders at) so its panel's `absolute`
                            // positioning bubbles up to the nav row's own `relative`
                            // wrapper — letting it span the full bar width instead of
                            // just this one flex segment.
                            className={cn("group relative flex-1 text-center", item.megaMenu && "lg:static")}
                            onMouseLeave={() => setClosedId((current) => (current === item.id ? null : current))}
                        >
                            <Link
                                href={item.path}
                                onClick={() => setClosedId(item.id)}
                                className="py-2.5 text-gray-1-foreground flex w-full items-center justify-center gap-1.5 capitalize group-hover:text-secondary-foreground transition-all duration-500"
                            >
                                <ItemIcon
                                    aria-hidden
                                    className="size-4 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5"
                                    strokeWidth={1.75}
                                />
                                {item.label}
                                {(item.dropdownList || item.megaMenu) && (
                                    <span>
                                        <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
                                    </span>
                                )}
                            </Link>
                            {item.dropdownList && (
                                <ul
                                    className={cn(
                                        `absolute z-50 bg-home-bg-1 min-w-44 px-6 py-7.5 shadow-3xl grid ${item.dropdownList.length > 5 ? "grid-cols-2" : ""
                                        } gap-x-10 gap-y-2 overflow-hidden opacity-0 invisible max-h-0 rounded-b-lg group-hover:max-h-[300px] group-hover:opacity-100 group-hover:visible transition-all duration-500`,
                                        forceClosed && "max-h-0! opacity-0! invisible!"
                                    )}
                                >
                                    {item.dropdownList?.map((dropItem) => {
                                        return (
                                            <li key={dropItem.id}>
                                                <Link
                                                    href={dropItem.path}
                                                    onClick={() => setClosedId(item.id)}
                                                    className="inline-block text-gray-1-foreground capitalize hover:text-secondary-foreground transition-all duration-500"
                                                >
                                                    {dropItem.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {item.megaMenu && <MegaMenu data={item.megaMenu} featuredProducts={featuredProducts} forceClosed={forceClosed} onNavigate={() => setClosedId(item.id)} />}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navbar;
