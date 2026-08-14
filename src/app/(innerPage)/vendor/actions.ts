'use server';

import { z } from 'zod';

const vendorEnquirySchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    brandName: z.string().min(2, "Brand / studio name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(6, "Enter a valid phone / WhatsApp number"),
    country: z.string().min(1, "Please select your country"),
    category: z.string().min(1, "Please select a product / category"),
    experience: z.string().min(1, "Please select your selling experience"),
    message: z.string().optional(),
});

export async function submitVendorEnquiry(prevState: any, formData: FormData) {
    const data = {
        fullName: formData.get('fullName'),
        brandName: formData.get('brandName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        category: formData.get('category'),
        experience: formData.get('experience'),
        message: formData.get('message'),
    };

    try {
        const validatedData = vendorEnquirySchema.parse(data);
        // Simulate a server call
        await new Promise((resolve) => setTimeout(resolve, 1200));
        console.log('Vendor enquiry submitted:', validatedData);
        return { success: true, message: 'Your application has been received. Our vendor team will review it and get back to you within 2–3 business days.' };
    } catch (error: any) {
        console.error('Vendor enquiry submission error:', error);
        return {
            success: false,
            message: error.errors ? error.errors.map((err: any) => err.message).join(', ') : 'Failed to submit application.',
        };
    }
}
