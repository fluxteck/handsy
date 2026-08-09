import { couponsData } from '@/db/couponsData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(couponsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch coupons data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
