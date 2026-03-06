'use client';

import { Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/images/hero-background.png)' }}
      ></div>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 text-center">
        <FadeIn direction="up" delay={0}>
          <h1 className="text-5xl font-bold mb-6">
            Conecte-se com a Comunidade Tech
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.1}>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubra comunidades de tecnologia incríveis e participe dos melhores
            eventos da sua região
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-lg">500+ Comunidades</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-lg">1000+ Eventos</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">50+ Cidades</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/communities">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Explorar Comunidades
              </Button>
            </Link>
            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Ver Eventos
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
