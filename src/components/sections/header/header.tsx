import { getMenuData, getProductsData } from "@/lib/data";
import { User } from "@/lib/icon";
import { ProductType } from "@/types/productType";
import Image from "next/image";
import Link from "next/link";
import HeaderExtraInfo from "./headerExtraInfo";
import MobileMenu from "./mobileMenu";
import Navbar from "./navbar";
import SearchPopup from "./searchPopup";
import ShopingCartSidebar from "./shopingCartSidebar";
import StickyHeader from "./stickyHeader";
import TopHeader from "./topHeader";
import WishlistButton from "./wishlistButton";

const Header = async () => {
  const menuList = await getMenuData();
  const { featuredProducts }: { featuredProducts: ProductType[] } =
    await getProductsData();
  return (
    <StickyHeader topHeaderContent={<TopHeader />}>
      <div className="lg:h-20 h-14 bg-home-bg-1 [.header-pinned_&]:shadow-md">
        <div className="container flex items-center gap-4 lg:gap-8 h-full relative">
          <div className="flex items-center gap-3 shrink-0">
            <MobileMenu data={menuList} featuredProducts={featuredProducts} />
            <Link
              href={"/"}
              aria-label="Handsy Market home"
              className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:z-auto lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 shrink-0"
            >
              <Image
                width={80}
                height={50}
                src={"/images/logo.png"}
                alt="logo"
                className="w-14 h-auto lg:w-20"
              />
            </Link>
          </div>
          <div className="flex-1 max-w-xl mx-auto">
            <SearchPopup data={featuredProducts} />
          </div>
          <div className="flex items-center justify-end gap-5 shrink-0">
            <div className="lg:block hidden">
              <HeaderExtraInfo />
            </div>
            <WishlistButton />
            <Link
              aria-label="account"
              href={"/account"}
              className="text-gray-1-foreground cursor-pointer lg:block hidden hover:text-secondary-foreground transition-all duration-500"
            >
              <User />
            </Link>
            <ShopingCartSidebar featuredProducts={featuredProducts} />
          </div>
        </div>
      </div>
      <div className="hidden lg:block border-t border-t-[#E5E2E1]">
        <div className="container flex justify-center relative">
          <Navbar data={menuList} featuredProducts={featuredProducts} />
        </div>
      </div>
    </StickyHeader>
  );
};

export default Header;
