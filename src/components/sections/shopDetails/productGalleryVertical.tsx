"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Close, Expand } from "@/lib/icon";

const zoomNavButtonClass =
  "fixed top-1/2 z-[2001] flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-2 bg-background/80 text-secondary-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md disabled:pointer-events-none disabled:opacity-30 sm:size-11";

/** Minimum horizontal travel (px) before a touch gesture counts as a swipe rather than a tap/scroll. */
const SWIPE_THRESHOLD = 40;

const ProductGalleryVertical = ({
  images,
  badge,
  showThumbnails = true,
  enableZoom = true,
}: {
  images: string[];
  badge?: string;
  /** Hide the thumbnail rail — used by the compact Quick View gallery. Defaults to on for the full PDP layout. */
  showThumbnails?: boolean;
  /** Hide the expand button and fullscreen zoom viewer — used by the compact Quick View gallery. Defaults to on for the full PDP layout. */
  enableZoom?: boolean;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === images.length - 1;

  const goToPrevious = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => Math.min(images.length - 1, prev + 1));
  };

  const closeZoom = () => setIsZoomOpen(false);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (deltaX > 0) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  return (
    <div className={cn("grid grid-cols-1 gap-4", showThumbnails && "lg:grid-cols-[86px_1fr]")}>
      {showThumbnails && (
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
      )}

      <div
        className="relative bg-[#F2F2F2] order-1 lg:order-2 overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {badge && (
          <span className="absolute top-5 left-5 z-10 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-sm">
            {badge}
          </span>
        )}

        {enableZoom && (
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            aria-label="View full-screen image"
            className="text-gray-1-foreground absolute top-5 right-5 z-10 cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <Expand />
          </button>
        )}

        <Image
          key={activeIndex}
          width={580}
          height={560}
          style={{ width: "100%", height: "auto" }}
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={images[activeIndex]}
          className="object-contain aspect-square animate-in fade-in duration-300"
          alt="Product image"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              disabled={isFirst}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-2 bg-background/80 text-secondary-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md disabled:pointer-events-none disabled:opacity-30 disabled:hover:translate-x-0"
            >
              <ChevronLeft className="size-5" strokeWidth="2.5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              disabled={isLast}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-2 bg-background/80 text-secondary-foreground backdrop-blur-sm transition-all duration-300 hover:translate-x-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md disabled:pointer-events-none disabled:opacity-30 disabled:hover:translate-x-0"
            >
              <ChevronRight className="size-5" strokeWidth="2.5" />
            </button>
          </>
        )}
      </div>

      {enableZoom && (
        <PhotoSlider
          images={images.map((src, index) => ({ key: index, src }))}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          visible={isZoomOpen}
          onClose={closeZoom}
          photoClassName="bg-[#F2F2F2]"
        />
      )}

      {enableZoom && isZoomOpen && (
        <>
          {/* The library's own backdrop doesn't paint reliably in this environment
              (see globals.css), so the viewer renders its own instead. */}
          <div
            onClick={closeZoom}
            aria-hidden="true"
            className="fixed inset-0 z-[2000] bg-black/90 animate-in fade-in duration-300"
          />

          {images.length > 1 && (
            <span
              aria-live="polite"
              className="fixed left-4 top-4 z-[2001] rounded-full border border-gray-2 bg-background/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground backdrop-blur-sm animate-in fade-in duration-300 sm:left-6 sm:top-6"
            >
              {activeIndex + 1} / {images.length}
            </span>
          )}

          <button
            type="button"
            onClick={closeZoom}
            aria-label="Close image viewer"
            className="fixed right-4 top-4 z-[2001] flex size-10 items-center justify-center rounded-full border border-gray-2 bg-background/80 text-secondary-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md animate-in fade-in sm:right-6 sm:top-6 sm:size-11"
          >
            <Close className="size-4" strokeWidth="2.5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                disabled={isFirst}
                aria-label="Previous image"
                className={cn(
                  zoomNavButtonClass,
                  "left-4 hover:-translate-x-0.5 disabled:hover:translate-x-0 animate-in fade-in sm:left-6"
                )}
              >
                <ChevronLeft className="size-5" strokeWidth="2.5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                disabled={isLast}
                aria-label="Next image"
                className={cn(
                  zoomNavButtonClass,
                  "right-4 hover:translate-x-0.5 disabled:hover:translate-x-0 animate-in fade-in sm:right-6"
                )}
              >
                <ChevronRight className="size-5" strokeWidth="2.5" />
              </button>

              <div className="fixed inset-x-0 bottom-4 z-[2001] flex justify-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:bottom-6">
                <div className="flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-gray-2 bg-background/80 p-2 backdrop-blur-md scrollbar-hidden sm:gap-2.5 sm:p-2.5">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={activeIndex === index}
                      className={cn(
                        "size-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 sm:size-14",
                        activeIndex === index
                          ? "border-primary opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        width={56}
                        height={56}
                        sizes="56px"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGalleryVertical;
