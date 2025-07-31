'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getSession() {
  const session = cookies().get('session')?.value;
  return session ? JSON.parse(session) : null;
}

export async function protectRoute() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }
  return session;
}

export async function loginUser(credentials) {
  const user = {
    id: '1',
    name: 'Test User',
    email: credentials.email,
  };

  cookies().set('session', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: '/',
  });

  return user;
}
export async function signOut() {
  cookies().delete('session');
  redirect('/'); // ou redirecione para uma página de login, se quiser
}