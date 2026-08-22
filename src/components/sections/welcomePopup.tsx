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

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

          <form
            className="mt-7.5 flex"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              name="email"
              required
              placeholder="Enter your email..."
              aria-label="Email address"
              className="h-12 rounded-none rounded-l-md border-r-0 px-4"
            />
            <Button type="submit" className="h-12 shrink-0 rounded-none rounded-r-md px-6">
              Subscribe
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
