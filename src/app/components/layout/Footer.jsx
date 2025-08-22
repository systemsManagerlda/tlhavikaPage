import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre a Empresa */}
          <div>
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
              <p>
                <a
                  href="tel:+258871191481"
                  className="hover:text-green-400 transition-colors"
                >
                  +258 87 119 1481
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

          {/* Mapa */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Nossa Localização
            </h4>
            <div className="rounded-lg overflow-hidden shadow-lg h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1794.9862791336923!2d32.5659797596717!3d-25.870380567479575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee69baa03aa39d1%3A0x77a65370acc6cce!2sTlhavilha!5e0!3m2!1spt-PT!2smz!4v1755828458361!5m2!1spt-PT!2smz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Tlhavilha em Maputo, Mozambique"
                className="rounded-lg"
              ></iframe>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Av. Moçambique, Maputo, Mozambique
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="max-w-xl mx-auto">
            <h4 className="text-lg font-semibold mb-4 text-green-400 text-center">
              Assine nossa Newsletter
            </h4>
            <p className="text-gray-300 mb-4 text-center">
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
            © {new Date().getFullYear()} Tlhavika — Todos os direitos
            reservados.
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
