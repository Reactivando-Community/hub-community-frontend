'use client';

import { useMutation } from '@apollo/client';
import { Clock, ExternalLink, MapPin, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  trackAddTalkToAgenda,
  trackCreateAgenda,
  trackRemoveTalkFromAgenda,
} from '@/lib/analytics';
import { CREATE_AGENDA, UPDATE_AGENDA } from '@/lib/queries';
import { Talk } from '@/lib/types';
import { adjustToBrazilTimezone } from '@/utils/event';

interface TalkCardProps {
  talk: Talk;
  eventDocumentId?: string;
  eventSlug?: string;
  agendaDocumentId?: string;
  isInAgenda?: boolean;
  onAgendaChange?: () => void;
  showAgendaActions?: boolean;
  onOptimisticUpdate?: (talkDocumentId: string, isInAgenda: boolean) => void;
}

export function TalkCard({
  talk,
  eventDocumentId,
  eventSlug,
  agendaDocumentId,
  isInAgenda = false,
  onAgendaChange,
  showAgendaActions = false,
  onOptimisticUpdate,
}: TalkCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [createAgenda] = useMutation(CREATE_AGENDA);
  const [updateAgenda] = useMutation(UPDATE_AGENDA);

  const handleAddToAgenda = async () => {
    if (!talk.documentId || !eventDocumentId) return;

    setIsLoading(true);
    try {
      if (!agendaDocumentId) {
        // Criar agenda se não existir
        const { data: createData } = await createAgenda({
          variables: {
            input: {
              is_public: false,
              event: eventDocumentId,
            },
          },
        });

        if (createData?.createAgenda?.documentId) {
          // Track analytics event for creating agenda
          trackCreateAgenda(eventSlug || eventDocumentId!);

          // Adicionar talk à agenda recém-criada
          await updateAgenda({
            variables: {
              updateAgendaId: createData.createAgenda.documentId,
              input: {
                talksToAdd: [talk.documentId],
              },
            },
          });
        }
      } else {
        // Adicionar talk à agenda existente
        await updateAgenda({
          variables: {
            updateAgendaId: agendaDocumentId,
            input: {
              talksToAdd: [talk.documentId],
            },
          },
        });
      }

      // Update optimistically
      onOptimisticUpdate?.(talk.documentId, true);

      // Track analytics event
      trackAddTalkToAgenda(talk.documentId!, eventSlug || eventDocumentId!);

      toast({
        title: 'Talk adicionada à agenda',
        description: `"${talk.title}" foi adicionada à sua agenda.`,
      });

      onAgendaChange?.();
    } catch (error) {
      console.error('Erro ao adicionar talk à agenda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a talk à agenda.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromAgenda = async () => {
    if (!talk.documentId || !agendaDocumentId) return;

    setIsLoading(true);
    try {
      await updateAgenda({
        variables: {
          updateAgendaId: agendaDocumentId,
          input: {
            talksToRemove: [talk.documentId],
          },
        },
      });

      // Update optimistically
      onOptimisticUpdate?.(talk.documentId, false);

      // Track analytics event
      trackRemoveTalkFromAgenda(talk.documentId!, eventSlug || eventDocumentId!);

      toast({
        title: 'Talk removida da agenda',
        description: `"${talk.title}" foi removida da sua agenda.`,
      });

      onAgendaChange?.();
    } catch (error) {
      console.error('Erro ao remover talk da agenda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a talk da agenda.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
        talk.highlight ? 'border-blue-200 bg-blue-50' : ''
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">
            {typeof talk.title === 'string'
              ? talk.title
              : 'Título não disponível'}
          </h4>
          {talk.highlight && (
            <Badge variant="default" className="bg-blue-600">
              Destaque
            </Badge>
          )}
        </div>

        {talk.occur_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
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
        )}

        {talk.description && typeof talk.description === 'string' && (
          <p className="text-sm text-gray-600">{talk.description}</p>
        )}

        {talk.room_description && typeof talk.room_description === 'string' && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{talk.room_description}</span>
          </div>
        )}

        {talk.speakers &&
          Array.isArray(talk.speakers) &&
          talk.speakers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {talk.speakers.map(speaker => (
                <div key={speaker.id} className="flex items-center gap-2">
                  <Image
                    src={speaker.avatar || '/placeholder-user.jpg'}
                    alt={
                      typeof speaker.name === 'string'
                        ? speaker.name
                        : 'Speaker'
                    }
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                    unoptimized
                  />
                  <span className="text-sm font-medium">
                    {typeof speaker.name === 'string'
                      ? speaker.name
                      : 'Speaker'}
                  </span>
                </div>
              ))}
            </div>
          )}

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {talk.documentId && (
            <Link href={`/talks/${talk.documentId}`}>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </Link>
          )}

          {showAgendaActions && eventDocumentId && talk.documentId && (
            <>
              {isInAgenda ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemoveFromAgenda}
                  disabled={isLoading}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  {isLoading ? 'Removendo...' : 'Remover da Agenda'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleAddToAgenda}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isLoading ? 'Adicionando...' : 'Adicionar à Agenda'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
