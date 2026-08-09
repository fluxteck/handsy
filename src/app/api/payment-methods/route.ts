import { paymentMethodsData } from '@/db/paymentMethodsData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(paymentMethodsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payment methods data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
