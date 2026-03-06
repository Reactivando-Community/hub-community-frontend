'use client';

import { useMutation, useQuery } from '@apollo/client';
import { Calendar, Clock, Minus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { FadeIn } from '@/components/animations';
import { AgendaDetailsSkeleton } from '@/components/agenda-details-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { trackViewAgendaDetail } from '@/lib/analytics';
import { GET_AGENDA_BY_ID, UPDATE_AGENDA } from '@/lib/queries';
import { AgendaDetailResponse } from '@/lib/types';
import { adjustToBrazilTimezone } from '@/utils/event';

interface AgendaDetailsProps {
  agendaId: string;
}

export function AgendaDetails({ agendaId }: AgendaDetailsProps) {
  const { toast } = useToast();
  const [removingTalkIds, setRemovingTalkIds] = useState<Set<string>>(
    new Set()
  );

  // Track agenda detail view
  useEffect(() => {
    trackViewAgendaDetail(agendaId);
  }, [agendaId]);

  const { data, loading, error, refetch } = useQuery<AgendaDetailResponse>(
    GET_AGENDA_BY_ID,
    {
      variables: { agendaId },
      fetchPolicy: 'network-only',
    }
  );

  const [updateAgenda] = useMutation(UPDATE_AGENDA);

  const handleRemoveFromAgenda = async (talkDocumentId: string) => {
    setRemovingTalkIds(prev => new Set(prev).add(talkDocumentId));

    try {
      await updateAgenda({
        variables: {
          updateAgendaId: agendaId,
          input: {
            talksToRemove: [talkDocumentId],
          },
        },
      });

      toast({
        title: 'Talk removida da agenda',
        description: 'A palestra foi removida da sua agenda com sucesso.',
      });

      // Refetch to update the list
      refetch();
    } catch (error) {
      console.error('Erro ao remover talk da agenda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a palestra da agenda.',
        variant: 'destructive',
      });
    } finally {
      setRemovingTalkIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(talkDocumentId);
        return newSet;
      });
    }
  };

  if (loading) {
    return <AgendaDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Erro ao carregar agenda
          </h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar os detalhes da agenda.
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

  const agenda = data?.agenda;

  if (!agenda) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Agenda não encontrada
          </h2>
          <p className="text-muted-foreground">
            A agenda que você está procurando não existe ou foi removida.
          </p>
        </div>
      </div>
    );
  }

  // Sort talks by occur_date
  const sortedTalks = [...agenda.talks].sort(
    (a, b) =>
      new Date(a.occur_date).getTime() - new Date(b.occur_date).getTime()
  );

  return (
    <FadeIn direction="up" duration={0.3}>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Minha Agenda
          </h1>
          <p className="text-lg text-muted-foreground">
            {agenda.talks.length} palestra{agenda.talks.length !== 1 ? 's' : ''}{' '}
            agendada{agenda.talks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Talks List */}
        {sortedTalks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Você ainda não adicionou nenhuma palestra à sua agenda.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedTalks.map(talk => (
              <Card
                key={talk.documentId}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {talk.title}
                      </h3>
                      {talk.subtitle && (
                        <p className="text-muted-foreground mb-3">{talk.subtitle}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {adjustToBrazilTimezone(
                              new Date(talk.occur_date)
                            ).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {adjustToBrazilTimezone(
                              new Date(talk.occur_date)
                            ).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <Link href={`/talks/${talk.documentId}`}>
                        <Button variant="outline">Ver Detalhes</Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveFromAgenda(talk.documentId)}
                        disabled={removingTalkIds.has(talk.documentId)}
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        {removingTalkIds.has(talk.documentId)
                          ? 'Removendo...'
                          : 'Remover'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    </div>
    </FadeIn>
  );
}
