'use client';

import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

import { EventForm } from '@/components/admin/event-form';
import { useToast } from '@/components/ui/use-toast';
import { CREATE_EVENT } from '@/lib/queries';
import { CreateEventResponse, EventInput } from '@/lib/types';

export default function NewEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [createEvent, { loading }] =
    useMutation<CreateEventResponse>(CREATE_EVENT);

  const handleSubmit = async (data: any) => {
    try {
      const input: EventInput = {
        title: data.title,
        slug: data.slug,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        max_slots: Number(data.max_slots),
        pixai_token_integration: data.pixai_token_integration,
        description: data.description, // Assuming it's compatible or handled by backend/form
        communities: data.communityId ? [data.communityId] : [],
        location: data.location?.id || data.location,
      };

      await createEvent({ variables: { data: input } });

      toast({
        title: 'Evento criado',
        description: 'O evento foi criado com sucesso.',
      });

      toast({
        title: 'Evento criado',
        description: 'O evento foi criado com sucesso.',
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar',
        description:
          'Não foi possível criar o evento. Verifique os dados e tente novamente.',
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Novo Evento</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os detalhes abaixo para criar um novo evento.
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <EventForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
}
