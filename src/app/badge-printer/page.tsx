'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link as LinkIcon, Printer, User } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

  const handlePrint = () => {
    if (!previewData) return;

    // Use about:blank to ensure a clean window
    const printWindow = window.open(
      'about:blank',
      '_blank',
      'width=800,height=600'
    );
    if (!printWindow) {
      alert('Por favor, permita pop-ups para imprimir seu crachá.');
      return;
    }

    // Get the QR Code data URL from the canvas
    const canvas = document.querySelector('canvas');
    const qrDataUrl = canvas ? canvas.toDataURL() : '';

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Crachá - ${previewData.fullName}</title>
          <style>
            @page {
              size: 100mm 50mm;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100mm !important;
              height: 45mm !important;
              overflow: hidden !important;
              background: white;
              font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            .badge-container {
              width: 100mm;
              height: 45mm;
              padding: 5mm;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              box-sizing: border-box;
            }
            .info-section {
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              height: 100%;
              flex: 1;
              padding-right: 5mm;
            }
            .logo-text {
              font-size: 10pt;
              font-weight: 800;
              letter-spacing: 1px;
              color: black;
            }
            .name-text {
              font-size: 18pt;
              font-weight: 900;
              text-transform: uppercase;
              margin: 0;
              line-height: 1.1;
              color: black;
              word-wrap: break-word;
              max-width: 60mm;
            }
            .link-text {
              font-size: 7.5pt;
              color: #000;
              margin: 0;
              word-break: break-all;
              max-width: 60mm;
              font-weight: 600;
            }
            .qr-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 2mm;
            }
            .qr-image {
              display: block;
              width: 32mm;
              height: 32mm;
            }
            .label-info {
              font-size: 6pt;
              color: #000;
              text-transform: uppercase;
              font-weight: bold;
            }
            .separator {
              height: 2pt;
              width: 15mm;
              background: black;
              margin: 3mm 0;
            }
          </style>
        </head>
        <body>
          <div class="badge-container">
            <div class="info-section">
              <div class="logo-text">COMUNIDADE</div>
              <div class="badge-main">
                <h1 class="name-text">${previewData.fullName}</h1>
                <div class="separator"></div>
                <p class="link-text">${previewData.link}</p>
              </div>
            </div>
            <div class="qr-section">
              <img src="${qrDataUrl}" class="qr-image" />
              <div class="label-info">100MM X 50MM</div>
            </div>
          </div>
          <script>
            window.onload = () => {
              window.focus();
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <>
      <main className="container mx-auto py-10 px-4 min-h-screen no-print">
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
