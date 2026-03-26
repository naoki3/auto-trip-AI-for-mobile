import { NextResponse } from 'next/server';

export async function POST() {
  // For token-based auth, logout is handled client-side by deleting the stored token.
  // This endpoint exists for completeness.
  return NextResponse.json({ ok: true });
}
