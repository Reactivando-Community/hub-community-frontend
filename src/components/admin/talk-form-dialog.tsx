'use client';

import { SpeakerFormDialog } from '@/components/admin/speaker-form-dialog';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Speaker, Talk } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const talkSchema = z.object({
  title: z.string().min(2, 'O título é obrigatório.'),
  subtitle: z.string().optional(),
  description: z.any().optional(),
  start_date: z.string().min(1, 'Hora de início é obrigatória.'), // managing as string ISO for simplicity
  end_date: z.string().min(1, 'Hora de fim é obrigatória.'),
  speakerId: z.string().optional(),
});

type TalkFormValues = z.infer<typeof talkSchema>;

interface TalkInput extends Omit<Talk, 'speakers'> {
  speakerId?: string;
  speakers: Speaker[]; // simplified to one speaker focused for now but keeping compatibility
}

interface TalkFormDialogProps {
  onSave: (talk: TalkInput) => void;
  trigger?: React.ReactNode;
  initialData?: Talk;
  // availableSpeakers could be passed here, or managed internally with a mock/query
}

// Mock speakers
const MOCK_SPEAKERS: { label: string; value: string; data: Speaker }[] = [
  {
    label: 'Diego Fernandes',
    value: 'spk-1',
    data: { id: 'spk-1', name: 'Diego Fernandes', biography: [] },
  },
  {
    label: 'Mayk Brito',
    value: 'spk-2',
    data: { id: 'spk-2', name: 'Mayk Brito', biography: [] },
  },
];

export function TalkFormDialog({
  onSave,
  trigger,
  initialData,
}: TalkFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [speakers, setSpeakers] = useState(MOCK_SPEAKERS);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<
    string | undefined
  >(initialData?.speakers?.[0]?.id);

  const form = useForm<TalkFormValues>({
    resolver: zodResolver(talkSchema),
    defaultValues: {
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      description: initialData?.description || [],
      // Assuming initialData dates might need formatting or come as strings
      start_date: initialData?.occur_date || '', // TODO: occur_date is single, might need start/end separation in Talk type or just use one
      end_date: '', // Talk type has occur_date, user request says Start/End time. I'll add fields but map to what's available
      speakerId: initialData?.speakers?.[0]?.id || '',
    },
  });

  const handleAddSpeaker = (newSpeaker: Speaker) => {
    const id = newSpeaker.id;
    const speakerOption = {
      label: newSpeaker.name,
      value: id,
      data: newSpeaker,
    };
    setSpeakers([...speakers, speakerOption]);
    setSelectedSpeakerId(id);
    form.setValue('speakerId', id);
  };

  const onSubmit = (data: TalkFormValues) => {
    const selectedSpeaker = speakers.find(
      s => s.value === data.speakerId
    )?.data;
    const speakerList = selectedSpeaker ? [selectedSpeaker] : [];

    onSave({
      id: initialData?.id || `new-talk-${Date.now()}`,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      occur_date: data.start_date, // Mapping start to occur_date for now
      // end_time: data.end_date, // We might need to extend Talk type or store in description/custom field if backend doesn't support
      speakers: speakerList,
      speakerId: data.speakerId,
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Adicionar Palestra</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Palestra' : 'Adicionar Nova Palestra'}
          </DialogTitle>
          <DialogDescription>
            Detalhes da palestra e palestrante.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da palestra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Subtítulo ou cargo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Speaker Selection */}
            <div className="space-y-3 border p-3 rounded-md">
              <div className="flex items-center justify-between">
                <FormLabel>Palestrante</FormLabel>
                <SpeakerFormDialog
                  onSave={handleAddSpeaker}
                  trigger={
                    <Button size="sm" variant="ghost" type="button">
                      <Plus className="w-3 h-3 mr-1" /> Novo Palestrante
                    </Button>
                  }
                />
              </div>
              <div className="flex gap-2">
                <Combobox
                  options={speakers}
                  value={selectedSpeakerId}
                  onSelect={val => {
                    setSelectedSpeakerId(val);
                    form.setValue('speakerId', val);
                  }}
                  placeholder="Selecione um palestrante..."
                  className="flex-1"
                />
              </div>
              {selectedSpeakerId && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <User className="h-4 w-4" />
                  <span>
                    {speakers.find(s => s.value === selectedSpeakerId)?.label}
                  </span>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                      placeholder="Descrição da palestra..."
                    />
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
              <Button type="submit">Salvar Palestra</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
