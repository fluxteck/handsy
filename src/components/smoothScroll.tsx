"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide inertia-based smooth scroll. Runs on the real window/document
 * scroll (no wrapper div), so position:sticky headers, IntersectionObserver
 * reveals, and anchor links all keep working untouched. Elements that need
 * native scroll (modals, dropdowns, carousels) opt out via the
 * `data-lenis-prevent` attribute, which Lenis detects automatically.
 */
const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1,
      // Mobile keeps native touch scrolling: fastest, most familiar feel
      // and avoids inertia-simulation cost on lower-end devices.
      syncTouch: false,
      // Built-in: forces 1:1 lerp and instant programmatic scrolls when the
      // user has prefers-reduced-motion enabled, satisfying that requirement
      // without extra branching here.
      respectReducedMotion: true,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
