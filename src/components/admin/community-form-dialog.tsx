'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CREATE_COMMUNITY, GET_COMMUNITIES } from '@/lib/queries';
import { CreateCommunityResponse } from '@/lib/types';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const communitySchema = z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres.'),
  slug: z.string().min(2, 'O slug é obrigatório.'),
  short_description: z.string().optional(),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

interface CommunityFormDialogProps {
  onSave: (community: any) => void;
  trigger?: React.ReactNode;
}

export function CommunityFormDialog({
  onSave,
  trigger,
}: CommunityFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [createCommunity, { loading }] = useMutation<CreateCommunityResponse>(
    CREATE_COMMUNITY,
    {
      refetchQueries: [{ query: GET_COMMUNITIES }],
    }
  );

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      title: '',
      slug: '',
      short_description: '',
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

  const onSubmit = async (data: CommunityFormValues) => {
    try {
      const { data: responseData } = await createCommunity({
        variables: {
          data: {
            title: data.title,
            slug: data.slug,
            short_description: data.short_description,
          },
        },
      });

      if (responseData?.createCommunity) {
        onSave(responseData.createCommunity);
        setOpen(false);
        form.reset();
        toast({
          title: 'Comunidade criada',
          description: 'A comunidade foi criada com sucesso.',
        });
      }
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar comunidade',
        description: 'Não foi possível criar a comunidade.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Adicionar Comunidade</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Comunidade</DialogTitle>
          <DialogDescription>
            Crie uma nova comunidade para vincular ao evento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Comunidade</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: React Brasil"
                      {...field}
                      onChange={e => {
                        field.onChange(e);
                        // Optional: auto-generate slug
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
                  <FormLabel>Slug</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="react-brasil" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSlug}
                    >
                      Gerar
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Uma breve descrição..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
