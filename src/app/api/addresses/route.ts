import { addressesData } from '@/db/addressesData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(addressesData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch addresses data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
