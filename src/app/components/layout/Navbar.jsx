"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // Ícones hamburguer e fechar (opcional)

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Bombas", href: "/dashboard/pumps" },
  { name: "Painéis Solares", href: "/dashboard/solar-panels" },
  { name: "Histórico", href: "/dashboard/history" },
  { name: "Tutoriais", href: "/dashboard/tutorials" },
  { name: "Lista de Preços", href: "/dashboard/price-list" },
  { name: "Marketplace", href: "/dashboard/marketplace" },
  { name: "Gestão", href: "/dashboard/gestao" },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-green-600">Tlhavika</span>
          </div>

          {/* Botão mobile */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Itens desktop */}
          {isLoggedIn && (
            <nav className="hidden sm:flex sm:space-x-8">
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

          {/* Autenticação (desktop e mobile visível) */}
          <div className="ml-4 flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                Sair
              </button>
            ) : (
              <Link
                href={"/login"}
                className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                LogIn
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && isLoggedIn && (
        <div className="sm:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-sm px-3 py-2 rounded-md ${
                  pathname === item.href
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
