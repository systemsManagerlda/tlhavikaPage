import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { email, password } = await request.json();

  // Aqui é só um exemplo — em produção você deve buscar no banco de dados
  if (email === 'admin@exemplo.com' && password === '123456') {
    const user = {
      id: '1',
      name: 'Admin',
      email,
    };

    cookies().set('session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
}
