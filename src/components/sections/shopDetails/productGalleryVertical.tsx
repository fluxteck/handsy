"use client";
import { useState } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { cn } from "@/lib/utils";
import { Expand } from "@/lib/icon";

const ProductGalleryVertical = ({
  images,
  badge,
}: {
  images: string[];
  badge?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[86px_1fr] gap-4">
      <ul className="flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-visible scrollbar-hidden">
        {images.map((img, index) => (
          <li key={index} className="shrink-0">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                "block bg-[#F2F2F2] size-[70px] lg:size-[86px] overflow-hidden border rounded-sm transition-colors duration-300",
                activeIndex === index ? "border-secondary-foreground" : "border-transparent"
              )}
            >
              <Image
                width={86}
                height={86}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                sizes="100px"
                className="w-full h-full object-contain aspect-square"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative bg-[#F2F2F2] order-1 lg:order-2">
        {badge && (
          <span className="absolute top-5 left-5 z-10 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-sm">
            {badge}
          </span>
        )}
        <PhotoProvider maskOpacity={0.8} photoClassName="bg-[#F2F2F2]">
          <div className="relative">
            <Image
              width={580}
              height={560}
              style={{ width: "100%", height: "auto" }}
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={images[activeIndex]}
              className="object-contain aspect-square"
              alt="Product image"
            />
            <PhotoView src={images[activeIndex]}>
              <div className="text-gray-1-foreground absolute top-5 right-5 cursor-pointer">
                <Expand />
              </div>
            </PhotoView>
          </div>
        </PhotoProvider>
      </div>
    </div>
  );
};

export default ProductGalleryVertical;
