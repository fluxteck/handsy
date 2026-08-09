import { returnsData } from '@/db/returnsData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(returnsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch returns data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
