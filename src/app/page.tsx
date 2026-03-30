'use client';

import { useQuery } from '@apollo/client';
import { Calendar, MapPin, Search, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState } from 'react';

import { AnimateOnScroll } from '@/components/animations';
import { CommunityGrid } from '@/components/community-grid';
import { EventsSection } from '@/components/events-section';
import { OngoingEventsSection } from '@/components/ongoing-events-section';
import { OngoingEventsSectionSkeleton } from '@/components/ongoing-events-section-skeleton';
import { PastEventsSection } from '@/components/past-events-section';
import { PastEventsSectionSkeleton } from '@/components/past-events-section-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFilters } from '@/contexts/filter-context';
import { GET_EVENTS } from '@/lib/queries';
import { Event, EventsResponse } from '@/lib/types';
import { adjustToBrazilTimezone } from '@/utils/event';
import { CommunityGridSkeleton } from '../components/community-grid-skeleton';
import { EventsSectionSkeleton } from '../components/events-section-skeleton';

function EventSearchResults() {
  const { debouncedSearchTerm } = useFilters();

  const { data } = useQuery<EventsResponse>(GET_EVENTS, {
    variables: {
      filters: debouncedSearchTerm
        ? { title: { contains: debouncedSearchTerm } }
        : {},
    },
    skip: !debouncedSearchTerm,
  });

  const events = data?.events?.data || [];

  if (!debouncedSearchTerm) return null;

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum evento encontrado para &quot;{debouncedSearchTerm}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
      </p>
      {events.map((event: Event) => (
        <Link
          key={event.id}
          href={`/events/${event.slug || event.id}`}
          className="block"
        >
          <Card className="overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary/30">
            <CardContent className="p-4 flex gap-4">
              {Array.isArray(event.images) && event.images.length > 0 && (
                <Image
                  src={event.images[0]}
                  alt={typeof event.title === 'string' ? event.title : 'Evento'}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  unoptimized
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {typeof event.title === 'string' ? event.title : 'Evento'}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                  {event.start_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {adjustToBrazilTimezone(
                        new Date(event.start_date)
                      ).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  )}
                  {event.location?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location.city}
                    </span>
                  )}
                </div>
                {event.communities.length > 0 && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {event.communities[0]?.title}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { searchTerm, setSearchTerm } = useFilters();
  const [ongoingCount, setOngoingCount] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 pt-6 pb-12">

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-full text-base border-2 border-border focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="max-w-2xl mx-auto mb-8">
            <EventSearchResults />
          </div>
        )}

        {/* CTA Section - Meetup style (only show when not searching) */}
        {!searchTerm && (
          <AnimateOnScroll>
            <div className="max-w-2xl mx-auto text-center mb-16 px-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                A plataforma para{' '}
                <span className="inline-flex items-center"><Users className="h-7 w-7 md:h-8 md:w-8 text-primary mx-1" /></span>{' '}
                comunidades.{' '}
                <br className="hidden sm:block" />
                Onde{' '}
                <span className="inline-flex items-center"><Sparkles className="h-7 w-7 md:h-8 md:w-8 text-secondary mx-1" /></span>{' '}
                interesses se tornam{' '}
                <span className="inline-flex items-center">💜</span>{' '}
                conexões.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Descubra comunidades de tecnologia, participe de eventos incríveis
                e conecte-se com pessoas que compartilham seus interesses.
                Eventos estão acontecendo todos os dias — junte-se agora.
              </p>
              <Link href="/communities">
                <Button size="lg" className="rounded-full px-8 text-base font-semibold">
                  Explorar Comunidades
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        )}

        {/* Ongoing Events - only if there are any */}
        {!searchTerm && (
          <AnimateOnScroll>
            <section className="mb-16">
              <Suspense fallback={<OngoingEventsSectionSkeleton />}>
                <OngoingEventsSectionWrapper onCountChange={setOngoingCount} />
              </Suspense>
            </section>
          </AnimateOnScroll>
        )}

        {/* Upcoming Events */}
        {!searchTerm && (
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
        )}

        {/* Communities */}
        {!searchTerm && (
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
        )}

        {/* Past Events */}
        {!searchTerm && (
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
        )}
      </div>
    </main>
  );
}

/**
 * Wrapper that conditionally renders the ongoing events section
 * with its title only when there are ongoing events.
 */
function OngoingEventsSectionWrapper({
  onCountChange,
}: {
  onCountChange: (count: number) => void;
}) {
  const [count, setCount] = useState(0);

  const handleCountChange = (c: number) => {
    setCount(c);
    onCountChange(c);
  };

  return (
    <>
      {count > 0 && (
        <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Eventos em Andamento
        </h2>
      )}
      <OngoingEventsSection onCountChange={handleCountChange} />
    </>
  );
}
