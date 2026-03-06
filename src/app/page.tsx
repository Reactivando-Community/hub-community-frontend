'use client';

import { Suspense } from 'react';

import { AnimateOnScroll } from '@/components/animations';
import { CommunityGrid } from '@/components/community-grid';
import { EventsSection } from '@/components/events-section';
import { HeroSection } from '@/components/hero-section';
import { OngoingEventsSection } from '@/components/ongoing-events-section';
import { OngoingEventsSectionSkeleton } from '@/components/ongoing-events-section-skeleton';
import { PastEventsSection } from '@/components/past-events-section';
import { PastEventsSectionSkeleton } from '@/components/past-events-section-skeleton';
import { SearchAndFilters } from '@/components/search-and-filters';
import { CommunityGridSkeleton } from '../components/community-grid-skeleton';
import { EventsSectionSkeleton } from '../components/events-section-skeleton';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <SearchAndFilters />

        <AnimateOnScroll>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Comunidades
          </h2>
          <Suspense fallback={<CommunityGridSkeleton />}>
            <CommunityGrid />
          </Suspense>
        </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            Eventos em Andamento
          </h2>
          <Suspense fallback={<OngoingEventsSectionSkeleton />}>
            <OngoingEventsSection />
          </Suspense>
        </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Próximos Eventos
          </h2>
          <Suspense fallback={<EventsSectionSkeleton />}>
            <EventsSection />
          </Suspense>
        </section>
        </AnimateOnScroll>

        <AnimateOnScroll>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Eventos Passados
          </h2>
          <Suspense fallback={<PastEventsSectionSkeleton />}>
            <PastEventsSection />
          </Suspense>
        </section>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
