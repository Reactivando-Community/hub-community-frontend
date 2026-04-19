'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link as LinkIcon, Printer, User } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { printBadge } from '@/lib/badge-print';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'O nome completo deve ter pelo menos 2 caracteres.',
  }),
  link: z.string().url({
    message: 'Insira um link válido.',
  }),
});

export default function BadgePrinterPage() {
  const [previewData, setPreviewData] = useState<{
    fullName: string;
    link: string;
  } | null>(null);

  const isDev = process.env.NODE_ENV === 'development';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: isDev ? 'Pedro Goiania' : '',
      link: isDev ? 'https://linkedin.com/in/pedrogoiania' : '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPreviewData(values);
  }

  const handlePrint = async () => {
    if (!previewData) return;
    const canvas = document.querySelector('canvas');
    const qrDataUrl = canvas ? canvas.toDataURL() : '';
    await printBadge({
      fullName: previewData.fullName,
      qrDataUrl,
      logoText: 'COMUNIDADE',
      link: previewData.link,
    });
  };

  return (
    <>
      <main className="container mx-auto py-10 px-4 min-h-screen no-print">
        <FadeIn direction="up" duration={0.3}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Gerador de Crachás
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para gerar e imprimir seu crachá (100mm x
              50mm).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Crachá</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="João Silva"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (URL)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="https://exemplo.com"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Este link será associado ao seu crachá e
                            transformado em QR Code.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1">
                        Visualizar
                      </Button>
                      {previewData && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrint}
                          className="flex gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Imprimir
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prévia do Crachá</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center bg-muted/30 p-8 rounded-lg">
                {/* Badge Preview (Scalable) */}
                <div className="badge-preview bg-white border shadow-xl relative overflow-hidden flex items-center p-4 text-black text-[10px]">
                  {previewData ? (
                    <div className="flex w-full items-center gap-4">
                      <div className="flex-1 space-y-2 text-left">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-black leading-tight">
                          {previewData.fullName}
                        </h2>
                        <div className="h-px w-8 bg-black" />
                        <p className="text-[8px] text-muted-foreground break-all max-w-[100px]">
                          {previewData.link}
                        </p>
                      </div>
                      <div className="flex-shrink-0 bg-white p-1 border border-muted">
                        <QRCodeCanvas
                          value={previewData.link}
                          size={60}
                          level="H"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full justify-center">
                      <p className="text-muted-foreground italic text-center">
                        Preencha o formulário para visualizar
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </FadeIn>
      </main>

      {/* Printer content is now handled by isolated window in handlePrint */}

      <style jsx global>{`
        /* Styles for the preview on screen */
        .badge-preview {
          width: 300px;
          height: 150px; /* 100x50 proportion */
          border-radius: 4px;
        }

        .print-only {
          display: none;
        }
      `}</style>
    </>
  );
}
