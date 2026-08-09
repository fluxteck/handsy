import { ordersData } from '@/db/ordersData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(ordersData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
