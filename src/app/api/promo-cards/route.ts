import { NextResponse } from 'next/server';
import { promoCardsData } from '@/db/promoCardsData';

export async function GET() {
  try {
    return NextResponse.json(promoCardsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch promo cards', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
