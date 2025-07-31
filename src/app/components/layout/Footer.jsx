import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre a Empresa */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-green-400">Tlhavika</h3>
            <p className="text-gray-300 mb-4">
              A Tlhavika é uma empresa moçambicana dedicada à promoção de
              soluções sustentáveis nas áreas de energia renovável, tecnologia e
              desenvolvimento digital. Trabalhamos para transformar comunidades
              através de inovação acessível, confiável e adaptada às
              necessidades locais.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaYoutube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/pumps"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Dimensionamento de Bombas
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/solar-panels"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Dimensionamento de Painéis
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/marketplace"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">
              Contacto
            </h4>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Av. Moçambique Maputo, Mozambique</p>
              {/* <p>Solar City, SC 88000-000</p>
              <p>Brasil</p> */}
              <p>
                <a
                  href="tel:+554899999999"
                  className="hover:text-green-400 transition-colors"
                >
                  +258 86 551 7841
                </a>
              </p>
              <p>
                <a
                  href="mailto:tlhavika.solar@gmail.com"
                  className="hover:text-green-400 transition-colors"
                >
                  tlhavika.solar@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold mb-4 text-green-400">
              Assine nossa Newsletter
            </h4>
            <p className="text-gray-300 mb-4">
              Receba as últimas novidades sobre energia renovável e ofertas
              exclusivas.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="px-4 py-2 rounded-md text-gray-900 flex-grow focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        {/* Direitos Autorais e Links Legais */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Tlhavika — Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-green-400 text-sm transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
