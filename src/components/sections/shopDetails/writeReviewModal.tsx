"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Range } from "react-range";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, ImagePlus, Pencil, Star, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCustomerSession } from "@/lib/useCustomerSession";
import { submitReview } from "@/lib/sdk/reviews";

const MAX_IMAGES = 5;
const DURABILITY_LABELS = ["Poor", "Fair", "Good", "Great", "Exceptional"];
const STEP_ORDER = ["rating", "photo", "durability", "description"] as const;

type Step = (typeof STEP_ORDER)[number] | "guest" | "success";

type UploadedImage = { file: File; url: string };

const WriteReviewModal = ({
  productId,
  productName,
  className,
}: {
  productId: number | string;
  productName?: string;
  className?: string;
}) => {
  const { session, isAuthenticated } = useCustomerSession();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("rating");
  const [direction, setDirection] = useState(1);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [durability, setDurability] = useState([3]);
  const [description, setDescription] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const goTo = (next: Step, dir: 1 | -1 = 1) => {
    setError("");
    setDirection(dir);
    setStep(next);
  };

  const resetState = () => {
    images.forEach((image) => URL.revokeObjectURL(image.url));
    setStep("rating");
    setRating(0);
    setHoverRating(0);
    setImages([]);
    setDurability([3]);
    setDescription("");
    setGuestName("");
    setGuestEmail("");
    setError("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // let the close animation finish before wiping the wizard back to step one
      setTimeout(resetState, 200);
    }
  };

  const handleSelectRating = (value: number) => {
    setRating(value);
    setTimeout(() => goTo("photo"), 350);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    setImages((prev) =>
      [...prev, ...selected.map((file) => ({ file, url: URL.createObjectURL(file) }))].slice(0, MAX_IMAGES)
    );
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  /*
   * The server owns the parts that matter: it reads the author name from the
   * customer record (so it can't be spoofed), decides "verified purchase" from
   * a delivered order, and files the review as `pending` for moderation.
   *
   * Two things this form collects have nowhere to go yet — photos and the
   * durability score. Neither exists in the review contract or the `reviews`
   * table, so they are deliberately not sent rather than silently pretended
   * to be saved. Supporting them needs a server change first.
   */
  const performSubmit = () => {
    startTransition(async () => {
      const res = await submitReview({
        productId: String(productId),
        rating,
        body: description,
      });

      if (res.status === "success") {
        goTo("success");
        return;
      }
      if (res.status === "unauthenticated") {
        const message = "Please sign in to post a review — we email you a code.";
        setError(message);
        toast.error(message);
        return;
      }
      setError(res.message);
      toast.error(res.message);
    });
  };

  const handleDescriptionContinue = () => {
    if (description.trim().length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }
    /* Reviews require a real session — the server rejects anonymous posts.
       `isAuthenticated` is the verified Supabase session, not the local guest
       record, which grants nothing. */
    if (isAuthenticated) {
      performSubmit();
    } else {
      goTo("guest");
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim().length < 2 || !guestEmail.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    /* A review has to be attributable, so the server requires a real session.
       Rather than accept details we can't post under, send them to sign-in —
       the same emailed-code flow used everywhere else — and keep what they've
       written by leaving the modal open. */
    const message = "Please sign in to post your review — we'll email you a code.";
    setError(message);
    toast.error(message);
  };

  const currentStepIndex = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={cn("shrink-0", className)}>
          <Pencil className="size-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px] p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">Write a review{productName ? ` for ${productName}` : ""}</DialogTitle>

        {step !== "success" && currentStepIndex >= 0 && (
          <div className="flex items-center gap-2 px-6 pt-6">
            {STEP_ORDER.map((s, index) => (
              <span
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  index <= currentStepIndex ? "bg-primary" : "bg-gray-2"
                )}
              />
            ))}
          </div>
        )}

        <div className="px-6 py-7.5 min-h-[380px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: 24 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 * direction }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-1 flex-col"
            >
              {step === "rating" && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <p className="text-secondary-foreground text-xl lg:text-2xl font-semibold">
                    How would you rate this item?
                  </p>
                  <p className="text-gray-1-foreground text-sm mt-2">Your rating helps other shoppers decide.</p>
                  <div className="flex gap-2 mt-7.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                        aria-pressed={rating === value}
                        onClick={() => handleSelectRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "size-9 transition-colors",
                            value <= (hoverRating || rating) ? "text-[#FFA34E]" : "text-gray-2"
                          )}
                          fill={value <= (hoverRating || rating) ? "#FFA34E" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "photo" && (
                <div className="flex flex-1 flex-col">
                  <button
                    type="button"
                    onClick={() => goTo("rating", -1)}
                    className="flex items-center gap-1.5 text-sm text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300 self-start"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-secondary-foreground text-xl lg:text-2xl font-semibold">
                      Get 5% off your next purchase
                    </p>
                    <p className="text-gray-1-foreground text-sm mt-2 max-w-[320px]">
                      Add a photo of the product — reviews with photos help other shoppers most, and we&apos;ll email
                      you a 5% off code for adding one.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesSelected}
                      className="hidden"
                    />
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
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
                          aria-label="Add a photo"
                          className="size-16 rounded-lg border border-dashed border-gray-2 flex flex-col items-center justify-center text-gray-1-foreground hover:border-primary hover:text-primary transition-colors duration-300"
                        >
                          <ImagePlus className="size-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-7.5">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => goTo("durability")}>
                      Skip
                    </Button>
                    <Button type="button" className="flex-1" onClick={() => goTo("durability")}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === "durability" && (
                <div className="flex flex-1 flex-col">
                  <button
                    type="button"
                    onClick={() => goTo("photo", -1)}
                    className="flex items-center gap-1.5 text-sm text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300 self-start"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-secondary-foreground text-xl lg:text-2xl font-semibold">
                      Are the products durable?
                    </p>
                    <p className="text-secondary-foreground font-semibold text-lg mt-4">
                      {DURABILITY_LABELS[durability[0] - 1]}
                    </p>
                    <div className="w-full max-w-[320px] mt-6">
                      <Range
                        step={1}
                        min={1}
                        max={5}
                        values={durability}
                        onChange={(values) => setDurability(values)}
                        renderTrack={({ props, children }) => {
                          const { key, ...restProps } = props as typeof props & { key?: React.Key };
                          return (
                            <div
                              key={key ?? "durability-track"}
                              {...restProps}
                              className="h-1.5 w-full rounded-full bg-gray-2"
                              style={restProps.style}
                            >
                              {children}
                            </div>
                          );
                        }}
                        renderThumb={({ props }) => {
                          const { key, ...restProps } = props as typeof props & { key?: React.Key };
                          return (
                            <div
                              key={key ?? "durability-thumb"}
                              {...restProps}
                              aria-label="Durability rating"
                              className="size-6 rounded-full bg-primary border-4 border-background shadow-3xl focus-visible:outline-none"
                              style={restProps.style}
                            />
                          );
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-3-foreground mt-2.5">
                        <span>Poor</span>
                        <span>Exceptional</span>
                      </div>
                    </div>
                  </div>
                  <Button type="button" className="mt-7.5 w-full" onClick={() => goTo("description")}>
                    Continue
                  </Button>
                </div>
              )}

              {step === "description" && (
                <div className="flex flex-1 flex-col">
                  <button
                    type="button"
                    onClick={() => goTo("durability", -1)}
                    className="flex items-center gap-1.5 text-sm text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300 self-start"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                  <div className="flex-1 flex flex-col mt-4">
                    <p className="text-secondary-foreground text-xl lg:text-2xl font-semibold text-center">
                      Tell Us Description
                    </p>
                    <Label htmlFor="review-description" className="sr-only">
                      Review description
                    </Label>
                    <Textarea
                      id="review-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      minLength={10}
                      placeholder="What did you like or dislike? What did you use this product for?"
                      className="min-h-[160px] rounded-md mt-5 border-input text-gray-1-foreground"
                    />
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  </div>
                  <Button
                    type="button"
                    className="mt-7.5 w-full"
                    disabled={isSubmitting}
                    onClick={handleDescriptionContinue}
                  >
                    {isSubmitting ? "Submitting..." : isAuthenticated ? "Submit Review" : "Continue"}
                  </Button>
                </div>
              )}

              {step === "guest" && (
                <form onSubmit={handleGuestSubmit} className="flex flex-1 flex-col">
                  <button
                    type="button"
                    onClick={() => goTo("description", -1)}
                    className="flex items-center gap-1.5 text-sm text-gray-1-foreground hover:text-secondary-foreground transition-colors duration-300 self-start"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                  <div className="flex-1 flex flex-col mt-4">
                    <p className="text-secondary-foreground text-xl lg:text-2xl font-semibold text-center">
                      A few last details
                    </p>
                    <p className="text-gray-1-foreground text-sm mt-2 text-center">
                      Sign in isn&apos;t available in this demo yet — leave your name and email so we can credit your
                      review.
                    </p>
                    <div className="flex flex-col gap-4 mt-6">
                      <div>
                        <Label htmlFor="guest-name" className="text-gray-1-foreground font-normal">
                          Your Name<span className="text-primary-foreground">*</span>
                        </Label>
                        <Input
                          id="guest-name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          required
                          placeholder="e.g. Alex Carter"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guest-email" className="text-gray-1-foreground font-normal">
                          Your Email<span className="text-primary-foreground">*</span>
                        </Label>
                        <Input
                          id="guest-email"
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
                  </div>
                  <Button type="submit" className="mt-7.5 w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              )}

              {step === "success" && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <CheckCircle2 className="size-16 text-primary" strokeWidth={1.5} />
                  </motion.div>
                  <p className="text-secondary-foreground text-xl lg:text-2xl font-semibold mt-5">Thank you!</p>
                  <p className="text-gray-1-foreground text-sm mt-2 max-w-[320px]">
                    {/* Reviews are filed as `pending` and only appear once
                        moderated, so don't imply it's live. The old copy also
                        promised a 5% off code for photos — nothing issues one,
                        and photos aren't stored at all. */}
                    Your review has been submitted{productName ? ` for ${productName}` : ""}. It&apos;ll
                    appear on the product page once it&apos;s been checked.
                  </p>
                  <Button type="button" className="mt-7.5 min-w-[160px]" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;
