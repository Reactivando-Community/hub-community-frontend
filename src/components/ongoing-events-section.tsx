'use client';

import { useQuery } from '@apollo/client';
import { MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { StaggerContainer, StaggerItem } from '@/components/animations';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFilters } from '@/contexts/filter-context';
import { GET_EVENTS } from '@/lib/queries';
import { Event, EventsResponse } from '@/lib/types';
import { adjustToBrazilTimezone, isEventOngoing } from '@/utils/event';

export function OngoingEventsSection({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { debouncedSearchTerm } = useFilters();

  const { data, error } = useQuery<EventsResponse>(GET_EVENTS, {
    variables: {
      filters: debouncedSearchTerm
        ? { title: { contains: debouncedSearchTerm } }
        : {},
    },
  });

  const events = data?.events?.data || [];
  const ongoingEvents = events.filter(event => {
    if (!event.start_date || !event.end_date) return false;
    return isEventOngoing(event.start_date, event.end_date);
  });

  React.useEffect(() => {
    if (onCountChange) {
      onCountChange(ongoingEvents.length);
    }
  }, [onCountChange, ongoingEvents.length]);

  if (error || ongoingEvents.length === 0) return null;

  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ongoingEvents.map((event: Event) => (
        <StaggerItem key={event.id} className="h-full">
          <Link href={`/events/${event.slug || event.id}`} className="block group h-full">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-green-500/50 hover:border-green-500 h-full flex flex-col">
              <div className="relative overflow-hidden">
                <Image
                  src={
                    Array.isArray(event.images) && event.images.length > 0
                      ? event.images[0]
                      : '/placeholder.svg'
                  }
                  alt={typeof event.title === 'string' ? event.title : 'Event'}
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  unoptimized
                />
                <Badge className="absolute top-3 left-3 bg-green-600 text-white text-xs">
                  Ao Vivo
                </Badge>
              </div>
              <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-foreground text-lg leading-snug mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {typeof event.title === 'string' ? event.title : 'Evento'}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-3">
                  {typeof event.start_date === 'string' && (
                    <span>
                      {adjustToBrazilTimezone(
                        new Date(event.start_date)
                      ).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      {adjustToBrazilTimezone(
                        new Date(event.start_date)
                      ).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                  {event.location?.title && (
                    <>
                      <span className="text-border">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location.city || event.location.title}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {event.communities.length > 0
                      ? <>por <span className="font-medium text-foreground/80">{event.communities[0]?.title}</span></>
                      : '\u00A0'}
                  </span>
                  {event.talks.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {event.talks.length} palestra{event.talks.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
