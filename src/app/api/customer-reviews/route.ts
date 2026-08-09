import { customerReviewsData } from '@/db/customerReviewsData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(customerReviewsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customer reviews data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
