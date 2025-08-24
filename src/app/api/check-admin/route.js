import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    
    // Verifique se o usuário é admin baseado no token
    // Adapte conforme sua lógica de autenticação
    const isAdmin = token?.role === 'admin' || token?.isAdmin === true;
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}