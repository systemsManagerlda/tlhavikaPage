// src/app/page.jsx
import { cookies } from "next/headers";
import LoginForm from "./components/auth/LoginForm";
import Footer from "./components/layout/Footer";
import DashboardNavbar from "./components/layout/Navbar";
import ProductShowcase from "./components/ui/ProductShowcase";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await cookies().get("session")?.value;

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Imagem destacada no topo */}
        <div className="w-full mb-10">
          <img
            src="/images/fundo.jpg"
            alt="Energia Renovável"
            className="w-full h-96 object-cover shadow-md"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-14 justify-center items-center lg:items-start">
          {/* Área de autenticação */}
          {/* 
    <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Acesse sua conta
      </h2>
      <LoginForm />

      <div className="mt-4 text-center">
        <a
          href="/register"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Não tem uma conta? Registre-se
        </a>
      </div>
    </div> 
    */}

          {/* Destaque de produtos */}
          <div className="w-full lg:w-2/3">
            <ProductShowcase />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
