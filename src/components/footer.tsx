import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Hub Community</h3>
            <p className="text-gray-400 mb-4">
              Conectando desenvolvedores e comunidades de tecnologia em todo o
              Brasil.
            </p>
            <div className="flex space-x-4">
              <a
                target="blank"
                href="https://github.com/reactivando-Community/"
              >
                <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </a>
              {/* <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" /> */}
              <a
                target="blank"
                href="https://www.linkedin.com/company/reactivando/posts/?feedView=all"
              >
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </a>
              {/* <Mail className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" /> */}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/communities" className="hover:text-white">
                  Comunidades
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white">
                  Ajuda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Termos
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Receba as últimas novidades sobre eventos e comunidades.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-600"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                Inscrever
              </button>
            </div>
          </div> */}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Hub Community. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
