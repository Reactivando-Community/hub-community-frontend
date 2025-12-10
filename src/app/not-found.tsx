'use client';

import { Home, MapPinned } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-xs font-medium">
          <MapPinned className="h-4 w-4 mr-2" />
          Página não encontrada
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Ops, essa página se perdeu no mapa
        </h1>

        <p className="text-gray-600 text-base md:text-lg">
          A URL que você acessou não existe ou foi movida. Você pode voltar para
          a página inicial ou explorar comunidades e eventos disponíveis na
          plataforma.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Voltar para o início
            </Button>
          </Link>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/communities" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Ver comunidades
              </Button>
            </Link>
            <Link href="/events" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Ver eventos
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Código do erro: <span className="font-mono">404</span>
        </p>
      </div>
    </main>
  );
}


