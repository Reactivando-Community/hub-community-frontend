'use client';

import { useQuery } from '@apollo/client';
import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { TalkCard } from '@/components/talk-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpandableRichText } from '@/components/ui/expandable-rich-text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { trackViewEventDetail } from '@/lib/analytics';
import { GET_AGENDA_BY_EVENT_ID, GET_EVENT_BY_ID } from '@/lib/queries';
import { EventResponse } from '@/lib/types';
import { adjustToBrazilTimezone } from '@/utils/event';

interface EventDetailsProps {
  eventId: string;
}

export function EventDetails({ eventId }: EventDetailsProps) {
  const { isAuthenticated } = useAuth();
  const [optimisticAgendaTalks, setOptimisticAgendaTalks] = useState<
    Set<string>
  >(new Set());

  // Track event detail view
  useEffect(() => {
    trackViewEventDetail(eventId);
  }, [eventId]);

  const { data, loading, error } = useQuery<EventResponse>(GET_EVENT_BY_ID, {
    variables: { eventId },
  });

  const {
    data: agendaData,
    loading: agendaLoading,
    refetch: refetchAgenda,
  } = useQuery(GET_AGENDA_BY_EVENT_ID, {
    variables: { eventId },
    skip: !isAuthenticated,
    fetchPolicy: 'cache-and-network',
  });

  // Handle agenda changes
  const handleAgendaChange = () => {
    setOptimisticAgendaTalks(new Set()); // Reset optimistic state
    refetchAgenda();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="container mx-auto px-4 py-12">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erro ao carregar evento
          </h2>
          <p className="text-gray-600 mb-4">
            Não foi possível carregar os detalhes do evento.
          </p>
          <Button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const event = data?.event;

  // Get agenda information
  const agenda = agendaData?.agendas?.data?.[0];
  const agendaTalkIds =
    agenda?.talks?.map((talk: any) => talk.documentId) || [];

  // Function to check if a talk is in the agenda (considering optimistic updates)
  const isTalkInAgenda = (talkDocumentId: string | undefined) => {
    if (!talkDocumentId) return false;
    return (
      agendaTalkIds.includes(talkDocumentId) ||
      optimisticAgendaTalks.has(talkDocumentId)
    );
  };

  // Function to handle optimistic updates
  const handleOptimisticUpdate = (
    talkDocumentId: string,
    isInAgenda: boolean
  ) => {
    setOptimisticAgendaTalks(prev => {
      const newSet = new Set(prev);
      if (isInAgenda) {
        newSet.add(talkDocumentId);
      } else {
        newSet.delete(talkDocumentId);
      }
      return newSet;
    });
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Evento não encontrado
          </h2>
          <p className="text-gray-600">
            O evento que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  // Validate that required fields are present and are strings
  if (
    !event.start_date ||
    !event.end_date ||
    typeof event.start_date !== 'string' ||
    typeof event.end_date !== 'string'
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dados do evento inválidos
          </h2>
          <p className="text-gray-600">
            Os dados do evento estão incompletos ou inválidos.
          </p>
        </div>
      </div>
    );
  }

  const startDate = adjustToBrazilTimezone(new Date(event.start_date));
  const endDate = adjustToBrazilTimezone(new Date(event.end_date));
  const isMultiDay = startDate.toDateString() !== endDate.toDateString();

  // Group talks by day and then by time
  const talksByDay =
    event.talks?.reduce(
      (acc, talk) => {
        if (!talk.occur_date) return acc;

        const talkDate = adjustToBrazilTimezone(new Date(talk.occur_date));
        const dateKey = talkDate.toLocaleDateString('pt-BR');
        const timeKey = talkDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });

        if (!acc[dateKey]) {
          acc[dateKey] = {};
        }
        if (!acc[dateKey][timeKey]) {
          acc[dateKey][timeKey] = [];
        }
        acc[dateKey][timeKey].push(talk);
        return acc;
      },
      {} as Record<string, Record<string, typeof event.talks>>
    ) || {};

  // Sort date keys chronologically
  const sortedDateKeys = Object.keys(talksByDay).sort((a, b) => {
    const [aDay, aMonth, aYear] = a.split('/').map(Number);
    const [bDay, bMonth, bYear] = b.split('/').map(Number);
    const dateA = new Date(aYear, aMonth - 1, aDay);
    const dateB = new Date(bYear, bMonth - 1, bDay);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-64 md:min-h-80 lg:min-h-96 bg-gradient-to-r from-blue-600 to-purple-700">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(${event.images?.[0] || '/placeholder.jpg'})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-4 h-full flex items-center py-8 md:py-12">
          <div className="text-white max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {typeof event.title === 'string' ? event.title : 'Evento'}
            </h1>

            <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {startDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {isMultiDay && (
                    <>
                      {' - '}
                      {endDate.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {startDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                  {' - '}
                  {startDate.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {isMultiDay && (
                    <>
                      {' até '}
                      {endDate.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}
                      {' - '}
                      {endDate.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </>
                  )}
                </span>
              </div>
              {event.talks?.length > 0 && Array.isArray(event.talks) && (
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  <span>{event.talks.length} palestras</span>
                </div>
              )}
              {event.communities?.length > 0 &&
                Array.isArray(event.communities) && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{event.communities.length} comunidades</span>
                  </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                disabled={!event.subscription_link}
                onClick={() => {
                  if (!event.subscription_link) {
                    alert('Link de inscrição não disponível.');
                    return;
                  }

                  if (typeof window !== 'undefined') {
                    window.open(event.subscription_link, '_blank');
                  }
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Participar do Evento
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent w-full sm:w-auto"
                onClick={() => {
                  if (
                    typeof navigator !== 'undefined' &&
                    typeof window !== 'undefined' &&
                    'share' in navigator
                  ) {
                    navigator.share({
                      title: `Confira o evento ${
                        typeof event.title === 'string' ? event.title : 'Evento'
                      }\n`,
                      text: `\n${
                        typeof event?.description === 'string'
                          ? event.description
                          : 'Descrição não disponível'
                      }`,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 leading-relaxed mb-6">
                  <ExpandableRichText content={event?.description || ''} />
                </div>
              </CardContent>
            </Card>

            {/* Talks */}
            <Card>
              <CardHeader>
                <CardTitle>Programação</CardTitle>
              </CardHeader>
              <CardContent>
                {event.talks &&
                Array.isArray(event.talks) &&
                event.talks.length > 0 ? (
                  sortedDateKeys.length > 0 ? (
                    <div className="space-y-8">
                      {sortedDateKeys.map(dateKey => {
                        const talksByTime = talksByDay[dateKey];
                        const sortedTimeKeys = Object.keys(talksByTime).sort(
                          (a, b) => {
                            const [aHour, aMin] = a.split(':').map(Number);
                            const [bHour, bMin] = b.split(':').map(Number);
                            return aHour * 60 + aMin - (bHour * 60 + bMin);
                          }
                        );

                        return (
                          <div key={dateKey} className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                              {dateKey}
                            </h3>
                            <Tabs
                              defaultValue={sortedTimeKeys[0]}
                              className="w-full"
                            >
                              <TabsList className="flex w-full overflow-x-auto">
                                {sortedTimeKeys.map(timeKey => (
                                  <TabsTrigger key={timeKey} value={timeKey}>
                                    {timeKey}
                                  </TabsTrigger>
                                ))}
                              </TabsList>
                              {sortedTimeKeys.map(timeKey => (
                                <TabsContent
                                  key={timeKey}
                                  value={timeKey}
                                  className="space-y-4 mt-6"
                                >
                                  {talksByTime[timeKey]?.map(talk => (
                                    <TalkCard
                                      key={talk.documentId}
                                      talk={talk}
                                      eventDocumentId={event.documentId}
                                      agendaDocumentId={agenda?.documentId}
                                      isInAgenda={isTalkInAgenda(
                                        talk.documentId
                                      )}
                                      onAgendaChange={handleAgendaChange}
                                      onOptimisticUpdate={
                                        handleOptimisticUpdate
                                      }
                                      showAgendaActions={isAuthenticated}
                                    />
                                  ))}
                                </TabsContent>
                              ))}
                            </Tabs>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {event.talks.map(talk => (
                        <TalkCard
                          key={talk.documentId}
                          talk={talk}
                          eventDocumentId={event.documentId}
                          agendaDocumentId={agenda?.documentId}
                          isInAgenda={isTalkInAgenda(talk.documentId)}
                          onAgendaChange={handleAgendaChange}
                          onOptimisticUpdate={handleOptimisticUpdate}
                          showAgendaActions={isAuthenticated}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Programação ainda não divulgada.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Communities */}
            <Card>
              <CardHeader>
                <CardTitle>Comunidades Organizadoras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.communities &&
                  Array.isArray(event.communities) &&
                  event.communities.length > 0 ? (
                    event.communities.map(community => (
                      <Link
                        key={community.id}
                        href={`/communities/${community.id}`}
                        className="block"
                      >
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          {community.images?.[0] && (
                            <Image
                              src={community.images[0]}
                              alt={community.title}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover"
                              unoptimized
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {typeof community.title === 'string'
                                ? community.title
                                : 'Comunidade'}
                            </h4>
                            {community.short_description &&
                              typeof community.short_description ===
                                'string' && (
                                <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                                  {community.short_description}
                                </p>
                              )}
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma comunidade organizadora listada.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Data</p>
                    <p className="text-sm text-gray-600">
                      {startDate.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {isMultiDay && (
                        <>
                          <br />
                          até{' '}
                          {endDate.toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-sm text-gray-600">
                      {startDate.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {isMultiDay && (
                        <>
                          {' - '}
                          {endDate.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            {event.location && (
              <Card>
                <CardHeader>
                  <CardTitle>Localização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {event.location.title && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {event.location.title}
                      </span>
                    </div>
                  )}
                  {event.location.full_address && (
                    <div className="text-sm text-gray-600">
                      {event.location.full_address}
                    </div>
                  )}
                  {event.location.city && (
                    <div className="text-sm text-gray-600">
                      {event.location.city}
                    </div>
                  )}
                  {event.location.google_maps_url && (
                    <a
                      href={event.location.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Ver no Google Maps
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Palestras</span>
                  <span className="font-semibold">
                    {Array.isArray(event.talks) ? event.talks.length : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comunidades</span>
                  <span className="font-semibold">
                    {Array.isArray(event.communities)
                      ? event.communities.length
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração</span>
                  <span className="font-semibold">
                    {(() => {
                      const diffMs = endDate.getTime() - startDate.getTime();
                      const diffHours = diffMs / (1000 * 60 * 60);
                      return diffHours.toFixed(0) + ' horas';
                    })()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
