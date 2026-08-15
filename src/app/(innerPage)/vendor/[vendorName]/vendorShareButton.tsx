"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VendorShareButtonProps = {
  vendorName: string;
  tagline: string;
  className?: string;
};

const VendorShareButton = ({ vendorName, tagline, className }: VendorShareButtonProps) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: `${vendorName} on Handsy Market`,
      text: `Check out ${vendorName} — ${tagline}`,
      url,
    };

    // Native share sheet where supported (mobile browsers, most desktop browsers);
    // falls back to copy-to-clipboard everywhere else.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // AbortError fires when the user dismisses the share sheet — not a real failure.
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setJustCopied(true);
      toast.success("Store link copied to clipboard");
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link — please copy it manually");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${vendorName}'s store`}
      className={cn("shrink-0", className)}
    >
      {justCopied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {justCopied ? "Link Copied" : "Share Store"}
    </Button>
  );
};

export default VendorShareButton;
