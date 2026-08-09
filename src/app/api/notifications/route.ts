import { notificationsData } from '@/db/notificationsData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(notificationsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
