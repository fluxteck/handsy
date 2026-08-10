'use server';

import { z } from 'zod';

const b2bEnquirySchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    companyName: z.string().min(2, "Company name is required"),
    email: z.string().email("Enter a valid business email"),
    phone: z.string().min(6, "Enter a valid phone / WhatsApp number"),
    country: z.string().min(1, "Please select your country"),
    category: z.string().min(1, "Please select a product / category"),
    quantity: z.string().min(1, "Estimated quantity is required"),
    message: z.string().optional(),
});

export async function submitB2bEnquiry(prevState: any, formData: FormData) {
    const data = {
        fullName: formData.get('fullName'),
        companyName: formData.get('companyName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        category: formData.get('category'),
        quantity: formData.get('quantity'),
        message: formData.get('message'),
    };

    try {
        const validatedData = b2bEnquirySchema.parse(data);
        // Simulate a server call
        await new Promise((resolve) => setTimeout(resolve, 1200));
        console.log('B2B enquiry submitted:', validatedData);
        return { success: true, message: 'Your enquiry has been received. Our B2B team will contact you within 1–2 business days.' };
    } catch (error: any) {
        console.error('B2B enquiry submission error:', error);
        return {
            success: false,
            message: error.errors ? error.errors.map((err: any) => err.message).join(', ') : 'Failed to submit enquiry.',
        };
    }
}
