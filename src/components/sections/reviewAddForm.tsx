"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Star, ImagePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitProductReview, ReviewFormState } from "@/lib/actions/reviewActions";

const initialState: ReviewFormState = { success: false, message: "" };
const MAX_IMAGES = 5;

const ReviewAddForm = ({ productId }: { productId: number | string }) => {
  const [state, formAction, isPending] = useActionState(submitProductReview, initialState);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
      setRating(0);
      setImages((prev) => {
        prev.forEach((image) => URL.revokeObjectURL(image.url));
        return [];
      });
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const syncFileInput = (files: { file: File }[]) => {
    if (!fileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    files.forEach(({ file }) => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    setImages((prev) => {
      const next = [...prev, ...selected.map((file) => ({ file, url: URL.createObjectURL(file) }))].slice(
        0,
        MAX_IMAGES
      );
      syncFileInput(next);
      return next;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      const next = prev.filter((_, i) => i !== index);
      syncFileInput(next);
      return next;
    });
  };

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <Label className="text-gray-1-foreground font-normal">
          Your Rating<span className="text-primary-foreground">*</span>
        </Label>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer"
            >
              <Star
                className={cn(
                  "size-7 transition-colors",
                  value <= (hoverRating || rating) ? "text-[#FFA34E]" : "text-gray-2"
                )}
                fill={value <= (hoverRating || rating) ? "#FFA34E" : "none"}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="review-name" className="text-gray-1-foreground font-normal">
            Your Name<span className="text-primary-foreground">*</span>
          </Label>
          <Input id="review-name" name="name" required placeholder="e.g. Alex Carter" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="review-title" className="text-gray-1-foreground font-normal">
            Review Title<span className="text-primary-foreground">*</span>
          </Label>
          <Input id="review-title" name="title" required placeholder="Sum up your experience" className="mt-2" />
        </div>
      </div>

      <div>
        <Label htmlFor="review-comment" className="text-gray-1-foreground font-normal">
          Your Review<span className="text-primary-foreground">*</span>
        </Label>
        <Textarea
          id="review-comment"
          name="comment"
          required
          minLength={10}
          placeholder="What did you like or dislike? What did you use this product for?"
          className="min-h-[160px] mt-2 border-input text-gray-1-foreground"
        />
      </div>

      <div>
        <Label className="text-gray-1-foreground font-normal">Add Photos (optional)</Label>
        <input
          ref={fileInputRef}
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
        />
        <div className="flex flex-wrap gap-3 mt-2">
          {images.map((image, index) => (
            <div key={image.url} className="relative size-16 rounded-lg overflow-hidden border border-gray-2">
              <Image src={image.url} alt={`Upload preview ${index + 1}`} fill sizes="64px" className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                aria-label="Remove image"
                className="absolute top-0.5 right-0.5 size-4 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Add photos"
              className="size-16 rounded-lg border border-dashed border-gray-2 flex flex-col items-center justify-center text-gray-1-foreground hover:border-primary hover:text-primary transition-colors duration-300"
            >
              <ImagePlus className="size-5" />
            </button>
          )}
        </div>
        <p className="text-gray-3-foreground text-xs mt-2">Up to {MAX_IMAGES} images, JPG or PNG.</p>
      </div>

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewAddForm;
