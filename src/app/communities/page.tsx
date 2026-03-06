'use client';

import { Calendar, MapPin, Users } from 'lucide-react';
import { Suspense, useState } from 'react';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { CommunityGrid } from '@/components/community-grid';
import { CommunityGridSkeleton } from '@/components/community-grid-skeleton';
import { SearchAndFilters } from '@/components/search-and-filters';
import { Card, CardContent } from '@/components/ui/card';

export default function CommunitiesPage() {
  const [communityCount, setCommunityCount] = useState<number>(0);
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <FadeIn direction="up" delay={0}>
            <h1 className="text-4xl font-bold mb-4">Todas as Comunidades</h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore todas as comunidades de tecnologia disponíveis e encontre a
              sua tribo
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StaggerItem>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">500+ Comunidades</h3>
                <p className="text-sm opacity-90">Ativas em todo o Brasil</p>
              </CardContent>
            </Card>
            </StaggerItem>
            <StaggerItem>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">50+ Cidades</h3>
                <p className="text-sm opacity-90">Em todos os estados</p>
              </CardContent>
            </Card>
            </StaggerItem>
            <StaggerItem>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">1000+ Eventos</h3>
                <p className="text-sm opacity-90">Realizados mensalmente</p>
              </CardContent>
            </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <SearchAndFilters />

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Todas as Comunidades
            </h2>
            <p className="text-muted-foreground">
              Encontradas: {communityCount} comunidades
            </p>
          </div>

          <Suspense
            fallback={<CommunityGridSkeleton />}
          >
            <CommunityGrid onCountChange={setCommunityCount} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
