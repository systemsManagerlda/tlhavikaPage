import RegisterForm from '../../components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <main className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Criar uma nova conta
        </h1>

        <RegisterForm />

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Já tem uma conta? Acesse aqui
          </Link>
        </div>
      </main>
    </div>
  );
}
