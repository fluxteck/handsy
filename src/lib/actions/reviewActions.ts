'use server';

import { z } from 'zod';

const reviewFormSchema = z.object({
  productId: z.union([z.string(), z.number()]),
  name: z.string().min(2, 'Name is required'),
  email: z.union([z.string().email('Enter a valid email address'), z.literal('')]).optional(),
  rating: z.coerce.number().min(1, 'Please select a star rating').max(5),
  title: z.string().min(3, 'Review title is required').optional().or(z.literal('')),
  comment: z.string().min(10, 'Please write at least 10 characters'),
  durabilityRating: z.coerce.number().min(1).max(5).optional(),
});

export type ReviewFormState = {
  success: boolean;
  message: string;
};

export async function submitProductReview(
  prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const data = {
    productId: formData.get('productId'),
    name: formData.get('name'),
    email: formData.get('email') ?? undefined,
    rating: formData.get('rating'),
    title: formData.get('title') ?? undefined,
    comment: formData.get('comment'),
    durabilityRating: formData.get('durabilityRating') || undefined,
  };

  try {
    const validatedData = reviewFormSchema.parse(data);
    const images = formData.getAll('images').filter((image): image is File => image instanceof File && image.size > 0);

    // Simulate a server call. This project has no persistence layer (no database) yet, so the
    // review isn't actually stored — see productReviewsData.ts for the mock reviews rendered on
    // the PDP. Wiring this up for real needs a reviews table/collection plus image storage
    // (S3/Cloudinary/UploadThing) to upload `images` to and persist the returned URLs.
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Review submitted successfully:', validatedData, `${images.length} image(s) attached`);

    return { success: true, message: 'Thanks! Your review has been submitted (demo only — not persisted).' };
  } catch (error) {
    // Narrowed rather than typed `any`: only a ZodError carries field issues,
    // and anything else is a genuine failure with no per-field detail.
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues.map((issue) => issue.message).join(', '),
      };
    }
    return { success: false, message: 'Failed to submit review.' };
  }
}
