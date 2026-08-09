import { productReviewsData } from '@/db/productReviewsData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const reviews = productReviewsData.filter((review) => String(review.productId) === String(id));
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product reviews', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
