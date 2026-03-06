'use client';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Suspense, useState } from 'react';

import { EventsSection } from '@/components/events-section';
import { EventsSectionSkeleton } from '@/components/events-section-skeleton';
import { SearchAndFilters } from '@/components/search-and-filters';
import { Card, CardContent } from '@/components/ui/card';

export default function EventsPage() {
  const [eventCount, setEventCount] = useState<number>(0);
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Todos os Eventos</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubra workshops, palestras, meetups e conferências de tecnologia
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Workshops</h3>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Meetups</h3>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Palestras</h3>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <MapPin className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Conferências</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <SearchAndFilters />

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Próximos Eventos
            </h2>
            <p className="text-muted-foreground">
              Encontrados: {eventCount} eventos
            </p>
          </div>

          <Suspense
            fallback={<EventsSectionSkeleton />}
          >
            <EventsSection onCountChange={setEventCount} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
