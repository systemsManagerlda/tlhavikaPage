import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  cookies().set('session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  return NextResponse.json({ success: true });
}
