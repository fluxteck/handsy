"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "./actions";

const fieldClass =
  "mt-2.5 border-[1.5px] border-[#999796] py-3 text-gray-1-foreground transition-colors duration-300 focus-visible:border-primary focus-visible:ring-primary/20";

const initialState = { success: false, message: "" };

const ContactForm = () => {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isPending) {
      setShowSuccess(false);
      prevPending.current = true;
      return;
    }

    if (prevPending.current && state.message) {
      if (state.success) {
        setShowSuccess(true);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
    prevPending.current = false;
  }, [isPending, state]);

  return (
    <section id="contact-form" className="bg-home-bg-1 lg:py-25 py-15" aria-label="Send us a message">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-2 bg-background shadow-3xl"
        >
          <div className="relative overflow-hidden bg-home-bg-4 px-6 py-8 lg:px-10 lg:py-10">
            <div
              className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-gradient-radial from-primary/15 to-transparent blur-2xl"
              aria-hidden
            />
            <span className="relative flex size-12 items-center justify-center rounded-full bg-primary text-white">
              <MessageSquare className="size-5" />
            </span>
            <p className="relative mt-4 text-heading capitalize text-secondary-foreground">Send Us a Message</p>
            <p className="relative mt-2 max-w-md text-gray-1-foreground leading-[170%]">
              Have a question about a product, an order, or a custom piece? Fill out the form below
              and our team will get back to you shortly.
            </p>
          </div>

          <div className="px-6 py-7.5 lg:px-10 lg:py-8.75">
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mb-7.5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-secondary-foreground font-medium">Message sent</p>
                  <p className="mt-1 text-sm text-gray-1-foreground leading-[160%]">{state.message}</p>
                </div>
              </motion.div>
            )}

            <form ref={formRef} action={formAction}>
              <div className="grid sm:grid-cols-2 gap-6">
                <Label htmlFor="name" className="text-gray-1-foreground text-base w-full">
                  Name<span className="text-primary-foreground">*</span>
                  <Input type="text" name="name" id="name" required placeholder="Your name" className={fieldClass} />
                </Label>
                <Label htmlFor="email" className="text-gray-1-foreground text-base w-full">
                  Email<span className="text-primary-foreground">*</span>
                  <Input type="email" name="email" id="email" required placeholder="you@email.com" className={fieldClass} />
                </Label>
              </div>
              <Label htmlFor="message" className="text-gray-1-foreground text-base w-full mt-7.5 block">
                Message<span className="text-primary-foreground">*</span>
                <Textarea
                  name="message"
                  id="message"
                  required
                  placeholder="Tell us how we can help..."
                  className={`${fieldClass} min-h-[140px]`}
                />
              </Label>
              <Button type="submit" disabled={isPending} className="mt-10 min-w-[180px] lg:px-12.5">
                {isPending ? "Sending..." : "Submit"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
