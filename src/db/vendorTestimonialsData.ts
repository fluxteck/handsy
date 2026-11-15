import type { testimonialType } from "./testimonialsData";

/**
 * Vendor feedback on joining Handsy Market, shown on the Home page.
 *
 * SAMPLE CONTENT — placeholders until real, approved vendor quotes are
 * collected. Replace each entry: `name` is the vendor or brand, `title` a short
 * caption, `review` their own words. Add `rating` only if the vendor gave one.
 */
export const vendorTestimonialData: testimonialType[] = [
    {
        id: 1,
        name: "Woodcraft Workshop",
        image: "",
        title: "A Clear Start",
        review: `"The onboarding steps were explained clearly from day one. We knew what was needed to list our pieces and what would happen next."`,
    },
    {
        id: 2,
        name: "Lighting Studio",
        image: "",
        title: "Support When We Needed It",
        review: `"Whenever we had a question while setting up our catalogue, the team replied quickly and walked us through it."`,
    },
    {
        id: 3,
        name: "Home Décor Artisan",
        image: "",
        title: "Our Craft, Presented Well",
        review: `"We were guided on photos and product details so our work is shown the way we make it, with the story behind each piece."`,
    },
    {
        id: 4,
        name: "Kitchen & Dining Maker",
        image: "",
        title: "Simple to Get Listed",
        review: `"Getting our products ready for the marketplace was straightforward. The process felt organised rather than overwhelming."`,
    },
];
