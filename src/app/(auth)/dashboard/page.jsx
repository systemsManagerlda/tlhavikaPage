import { protectRoute } from "../../lib/auth";
import Link from "next/link";
import Footer from "../../components/layout/Footer";
import DashboardNavbar from "../../components/layout/Navbar";
import ChatbotWidget from '../../components/chatbot/ChatbotWidget';

export default async function DashboardPage() {
  const session = await protectRoute();

  const sections = [
    { title: "Bombas", href: "/dashboard/pumps", color: "bg-green-100" },
    {
      title: "Painéis Solares",
      href: "/dashboard/solar-panels",
      color: "bg-yellow-100",
    },
    { title: "Histórico", href: "/dashboard/history", color: "bg-blue-100" },
    {
      title: "Tutoriais",
      href: "/dashboard/tutorials",
      color: "bg-purple-100",
    },
    {
      title: "Lista de Preços",
      href: "/dashboard/price-list",
      color: "bg-pink-100",
    },
    {
      title: "Marketplace",
      href: "/dashboard/marketplace",
      color: "bg-orange-100",
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Olá, {session.name}
          </h1>
          <p className="text-gray-600 mb-8">
            Bem-vindo ao seu painel de energia renovável
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map(({ title, href, color }) => (
              <Link href={href} key={href}>
                <div
                  className={`rounded-xl p-6 shadow-md hover:shadow-lg transition-all ${color}`}
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Gerenciar {title.toLowerCase()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <ChatbotWidget />
      </main>
      <Footer />
    </>
  );
}
