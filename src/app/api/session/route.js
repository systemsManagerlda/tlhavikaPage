// app/api/session/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? JSON.parse(sessionCookie) : null;

  return NextResponse.json({ session });
}
