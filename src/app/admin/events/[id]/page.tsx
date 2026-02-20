'use client';

import { EventForm } from '@/components/admin/event-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GET_EVENT_BY_SLUG_OR_ID, UPDATE_EVENT } from '@/lib/queries';
import { EventInput, EventResponse, UpdateEventResponse } from '@/lib/types';
import { useMutation, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { toast } = useToast();
  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery<EventResponse>(GET_EVENT_BY_SLUG_OR_ID, {
    variables: { slugOrId: id },
    skip: !id,
  });

  const [updateEvent, { loading: mutationLoading }] =
    useMutation<UpdateEventResponse>(UPDATE_EVENT);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (data?.eventBySlugOrId) {
      const event = data.eventBySlugOrId;
      setInitialData({
        title: event.title,
        slug: event.slug,
        start_date: event.start_date
          ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm")
          : '',
        end_date: event.end_date
          ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm")
          : '',
        max_slots: event.max_slots || 0,
        description: event.description,
        communityId: event.communities?.[0]?.id, // Get the first community ID if available
        location: event.location,
        id: event.id, // Keep reference for update
      });
    }
  }, [data]);

  const handleSubmit = async (formData: any) => {
    try {
      const input: EventInput = {
        title: formData.title,
        slug: formData.slug,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        max_slots: Number(formData.max_slots),
        pixai_token_integration: formData.pixai_token_integration,
        description: formData.description,
        location: formData.location?.id || formData.location, // Send ID string
      };

      // Ensure we have the id
      const eventId = data?.eventBySlugOrId?.id || id;

      await updateEvent({
        variables: {
          id: eventId,
          data: input,
        },
      });

      toast({
        title: 'Evento atualizado',
        description: 'O evento foi atualizado com sucesso.',
      });

      toast({
        title: 'Evento atualizado',
        description: 'O evento foi atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o evento.',
      });
    }
  };

  if (queryLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <p>Carregando evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <p>Erro ao carregar evento: {error.message}</p>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/events')}
          className="mt-4"
        >
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Editar Evento</h1>
        <p className="text-muted-foreground mt-2">
          Atualize os detalhes do evento abaixo.
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        {initialData && (
          <EventForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={mutationLoading}
          />
        )}
      </div>
    </div>
  );
}
