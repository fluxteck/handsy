'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import MegaMenu from "./megaMenu";
import { menuType } from "@/db/menuList";
import { ProductType } from "@/types/productType";
import { cn } from "@/lib/utils";

const Navbar = ({ data, featuredProducts }: { data: menuType[], featuredProducts: ProductType[] }) => {
    const pathName = usePathname()
    // Opening stays pure-CSS `group-hover` (works instantly, no hydration wait).
    // closedId only force-closes the just-clicked item until the pointer leaves it.
    const [closedId, setClosedId] = useState<string | number | null>(null)

    useEffect(() => {
        setClosedId(null)
    }, [pathName])

    return (
        <nav className="lg:block hidden">
            <ul className="flex justify-center gap-10">
                {data.map((item) => {
                    const forceClosed = closedId === item.id
                    return (
                        <li
                            key={item.id}
                            className="group"
                            onMouseLeave={() => setClosedId((current) => (current === item.id ? null : current))}
                        >
                            <Link
                                href={item.path}
                                onClick={() => setClosedId(item.id)}
                                className="py-3.5 text-gray-1-foreground flex items-center gap-1 capitalize group-hover:text-secondary-foreground transition-all duration-500"
                            >
                                {item.label}
                                {(item.dropdownList || item.megaMenu) && (
                                    <span>
                                        <ChevronDown size={16} />
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
