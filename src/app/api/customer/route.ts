import { customerData } from '@/db/customerData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(customerData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customer data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
