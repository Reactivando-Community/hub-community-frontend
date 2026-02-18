'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// import { CommentData } from '@/lib/types';
import { useRouter } from 'next/navigation';

const eventSchema = z.object({
  title: z.string().min(2, {
    message: 'O título deve ter pelo menos 2 caracteres.',
  }),
  slug: z.string().min(2, {
    message: 'O slug deve ter pelo menos 2 caracteres.',
  }),
  start_date: z.string({
    required_error: 'A data de início é obrigatória.',
  }),
  end_date: z.string({
    required_error: 'A data de término é obrigatória.',
  }),
  max_slots: z.coerce.number().min(1, {
    message: 'O número de vagas deve ser pelo menos 1.',
  }),
  pixai_token_integration: z.string().optional(),
  description: z.any().optional(), // Complex type, validating as any for now
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: EventFormValues & { documentId?: string }; // Adjust based on actual data structure
  onSubmit: (data: EventFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function EventForm({
  initialData,
  onSubmit,
  isLoading,
}: EventFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.documentId;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      start_date: '',
      end_date: '',
      max_slots: 0,
      pixai_token_integration: '',
      description: [],
    },
  });

  const generateSlug = () => {
    const title = form.getValues('title');
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    form.setValue('slug', slug);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Evento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Workshop de React"
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      // Optional: auto-generate slug capability could be added here
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL amigável)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="ex-workshop-de-react"
                      {...field}
                      disabled={isEditing}
                    />
                  </FormControl>
                  {isEditing ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `/events/${field.value || initialData?.slug}`,
                          '_blank'
                        )
                      }
                    >
                      Ver página
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSlug}
                    >
                      Gerar
                    </Button>
                  )}
                </div>
                <FormDescription>
                  Url que será usada para acessar o evento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="datetime-local" className="block" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <Input type="datetime-local" className="block" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_slots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vagas Máximas</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditing && (
            <FormField
              control={form.control}
              name="pixai_token_integration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token de Integração Pix Aí</FormLabel>
                  <FormControl>
                    <Input placeholder="Token do Pix Aí" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira o token de integração do Pix Aí.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                {/* 
                  TODO: The RichTextEditor expects CommentData[] but we might need to handle 
                  conversion if the API returns something else for existing events.
                  For now assuming it matches or we default to empty array.
                */}
                <RichTextEditor
                  value={Array.isArray(field.value) ? field.value : []}
                  onChange={field.onChange}
                  placeholder="Descreva os detalhes do evento..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Evento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
