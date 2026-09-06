"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Close } from "@/lib/icon";
import { useNewsletter } from "@commercekitsdk/react";
import toast from "react-hot-toast";

/**
 * Remembers that this visitor has already been asked.
 *
 * Kept in localStorage rather than sessionStorage so closing the tab is not a
 * reset — someone who declined on Monday should not be asked again on Tuesday.
 * A dated value rather than a bare flag, so the window below can be moved
 * without stranding everyone who dismissed it under the old rule.
 */
const SEEN_KEY = "welcomePopupSeenAt";

/**
 * How long a dismissal stands, in days.
 *
 * Thirty: long enough that the popup reads as an occasional offer rather than
 * a toll gate, short enough that a shopper returning next season still sees a
 * live discount. Re-asking is the point — never asking again would quietly
 * retire the campaign the first time anyone clicked away.
 */
const SUPPRESS_DAYS = 30;

/**
 * Delay before it opens, in milliseconds.
 *
 * Six seconds. Interrupting the moment the page paints asks for an email from
 * someone who has not yet seen anything worth giving it for, and it lands on
 * top of content that is still settling. Waiting until the shopper has had a
 * chance to look around costs nothing and stops the popup from being the first
 * thing this store does to them.
 */
const OPEN_DELAY_MS = 6000;

const suppressedRecently = (): boolean => {
  try {
    const seenAt = window.localStorage.getItem(SEEN_KEY);
    if (!seenAt) return false;

    const elapsed = Date.now() - Number(seenAt);
    // A value that is not a usable timestamp — hand-edited, or written by an
    // older build — is treated as "not seen" rather than suppressing forever.
    if (!Number.isFinite(elapsed) || elapsed < 0) return false;

    return elapsed < SUPPRESS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    // Private browsing and blocked storage both throw on access. Showing the
    // popup is the safer failure: the alternative silently hides it for
    // everyone whose browser locks storage down.
    return false;
  }
};

const markSeen = () => {
  try {
    window.localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    // Nothing to do — it will be offered again next visit.
  }
};

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);
  const { subscribe, isSubmitting } = useNewsletter();

  useEffect(() => {
    if (suppressedRecently()) return;

    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  /**
   * Dismissing counts, and so does subscribing.
   *
   * Both run through here, so the popup cannot come back at someone who
   * already answered it — including the shopper who just gave their address,
   * for whom being asked again on the next page would read as a bug.
   */
  const handleOpenChange = (next: boolean) => {
    if (!next) markSeen();
    setOpen(next);
  };

  /**
   * Signs the visitor up through the same hook the footer form uses.
   *
   * This form used to swallow its own submit and do nothing — the address went
   * nowhere and the popup said nothing, so the shopper left believing they had
   * subscribed. It closes only once the server has accepted the address;
   * a failure keeps the popup open with the address still in the field, which
   * is the only state from which retrying is possible.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    const result = await subscribe({ email: String(email ?? ""), source: "welcome-popup" });

    if (result.ok) {
      toast.success("You're subscribed — watch your inbox.");
      handleOpenChange(false);
    } else {
      toast.error(result.error.message || "We couldn't sign you up just now. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[480px] w-[calc(100%-2rem)] p-0 gap-0 rounded-xl overflow-hidden [&_.close-orginal]:hidden"
      >
        <DialogClose
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full bg-background text-gray-2-foreground shadow-3xl transition-all duration-500 hover:text-secondary-foreground"
        >
          <Close className="size-3.5" />
        </DialogClose>

        <div className="px-6 py-10 sm:px-10 sm:py-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-3-foreground">
            Signup For Emails
          </p>
          <span className="mt-3 mx-auto block h-px w-8 bg-secondary-foreground" aria-hidden />

          <DialogTitle className="mt-6 text-2xl sm:text-3xl font-semibold uppercase tracking-tight leading-[120%] text-secondary-foreground">
            Get 20% Discount Shipped to Your Inbox
          </DialogTitle>

          <DialogDescription className="mt-4 text-base text-gray-1-foreground leading-[160%]">
            Let&apos;s subscribe to our newsletter and we will ship 20% discount code today
          </DialogDescription>

          <form className="mt-7.5 flex" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              required
              placeholder="Enter your email..."
              aria-label="Email address"
              className="h-12 rounded-none rounded-l-md border-r-0 px-4"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 shrink-0 rounded-none rounded-r-md px-6"
            >
              {isSubmitting ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>

          <DialogClose className="mt-6 inline-block text-sm text-gray-1-foreground underline decoration-skip-ink-none text-underline-position hover:text-secondary-foreground transition-colors duration-300">
            No, Thanks.
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
