"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Bombas", href: "/dashboard/pumps" },
  { name: "Painéis Solares", href: "/dashboard/solar-panels" },
  { name: "Histórico", href: "/dashboard/history" },
  { name: "Tutoriais", href: "/dashboard/tutorials" },
  { name: "Lista de Preços", href: "/dashboard/price-list" },
  { name: "Marketplace", href: "/dashboard/marketplace" },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      setIsLoggedIn(!!data.session);
    };

    checkSession();
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-green-600">Tlhavika</span>
            </div>

            {/* Itens visíveis apenas se logado */}
            {isLoggedIn && (
              <nav className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? "border-green-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Botão de logout visível apenas se logado */}
          {isLoggedIn ? (
            <>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Link
                  href={"/login"}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  LogIn
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
