'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileText,
  Link as LinkIcon,
  Plus,
  Printer,
  Upload,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const formSchema = z.object({
  link: z.string().url({
    message: 'Insira um link válido.',
  }),
  eventName: z.string().min(1, {
    message: 'Insira o nome do evento ou comunidade.',
  }),
  nameColumn: z.string().min(1, {
    message: 'Selecione a coluna que contém o nome.',
  }),
});

interface CSVRow {
  [key: string]: string;
}

export default function CSVBadgePrinterPage() {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [manualName, setManualName] = useState<string>('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: 'https://joincommunity.com.br',
      eventName: 'Reactivando',
      nameColumn: '',
    },
  });

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSearchTerm(''); // Reset search on new upload
    const reader = new FileReader();

    reader.onload = e => {
      const data = e.target?.result;
      let rows: CSVRow[] = [];
      let headerRow: string[] = [];

      try {
        if (file.name.endsWith('.csv')) {
          const text = data as string;
          const workbook = XLSX.read(text, { type: 'string' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as any[][];

          if (json.length > 0) {
            headerRow = json[0].map(h => String(h || '').trim());
            rows = XLSX.utils.sheet_to_json(worksheet, {
              defval: '',
            }) as CSVRow[];
          }
        } else {
          const arrayBuffer = data as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as any[][];

          if (json.length > 0) {
            headerRow = json[0].map(h => String(h || '').trim());
            rows = XLSX.utils.sheet_to_json(worksheet, {
              defval: '',
            }) as CSVRow[];
          }
        }

        setHeaders(headerRow);
        setCsvData(rows);

        // Auto-select "Nome" if it exists
        if (headerRow.includes('Nome')) {
          form.setValue('nameColumn', 'Nome');
        } else if (headerRow.includes('Name')) {
          form.setValue('nameColumn', 'Name');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        alert(
          'Erro ao processar o arquivo. Verifique se o formato está correto.'
        );
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handlePrint = (name: string, link: string, eventName: string) => {
    const printWindow = window.open(
      'about:blank',
      '_blank',
      'width=800,height=600'
    );
    if (!printWindow) {
      alert('Por favor, permita pop-ups para imprimir.');
      return;
    }

    const qrDataUrl =
      document
        .getElementById(`qr-canvas-${name}`)
        ?.querySelector('canvas')
        ?.toDataURL() || '';

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Crachá - ${name}</title>
          <style>
            @page { size: 100mm 50mm; margin: 0; }
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
            .logo-text { font-size: 10pt; font-weight: 800; letter-spacing: 1px; color: black; text-transform: uppercase; }
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
            .qr-section { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2mm; }
            .qr-image { display: block; width: 32mm; height: 32mm; }
            .label-info { font-size: 6pt; color: #000; text-transform: uppercase; font-weight: bold; }
            .separator { height: 2pt; width: 15mm; background: black; margin: 3mm 0; }
          </style>
        </head>
        <body>
          <div class="badge-container">
            <div class="info-section">
              <div class="logo-text">${eventName}</div>
              <div class="badge-main">
                <h1 class="name-text">${name}</h1>
                <div class="separator"></div>
              </div>
            </div>
            <div class="qr-section">
              <img src="${qrDataUrl}" class="qr-image" />
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

  const selectedNameColumn = form.watch('nameColumn');
  const staticLink = form.watch('link');
  const currentEventName = form.watch('eventName');

  const filteredData = csvData.filter(row => {
    if (!searchTerm) return true;
    const name = selectedNameColumn
      ? String(row[selectedNameColumn] || '')
      : '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <main className="container mx-auto py-10 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Impressão em Massa (CSV/XLSX)
            </h1>
            <p className="text-muted-foreground">
              Faça upload de um arquivo CSV ou Excel e mapeie a coluna de nomes
              para imprimir crachás individuais.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog
              open={isManualModalOpen}
              onOpenChange={setIsManualModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Impressão Manual
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Impressão Manual de Crachá</DialogTitle>
                  <DialogDescription>
                    Digite o nome do participante para gerar o crachá
                    individualmente.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Participante</Label>
                    <Input
                      placeholder="Nome Completo"
                      value={manualName}
                      onChange={e => setManualName(e.target.value)}
                    />
                  </div>
                  {/* Hidden QR Code for manual print */}
                  <div id={`qr-canvas-${manualName}`} className="hidden">
                    <QRCodeCanvas value={staticLink} size={128} />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setManualName('');
                      setIsManualModalOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={!manualName}
                    onClick={() => {
                      handlePrint(manualName, staticLink, currentEventName);
                      setIsManualModalOpen(false);
                      setManualName('');
                    }}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Arquivo
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Configure o link do QR Code e o nome do evento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Evento/Comunidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Reactivando" {...field} />
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
                        <FormLabel>Link do QR Code (Estático)</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nameColumn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coluna de Nome</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a coluna" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {headers.map(header => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Qual coluna do arquivo contém os nomes?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fileName && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm">
                      <FileText className="w-4 h-4" />
                      <span className="truncate">{fileName}</span>
                    </div>
                  )}
                </div>
              </Form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Lista de Participantes</CardTitle>
              <CardDescription>
                Visualize e imprima os crachás individualmente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {csvData.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Pesquisar por nome..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        onClick={() => setSearchTerm('')}
                        className="text-muted-foreground"
                      >
                        Resetar
                      </Button>
                    )}
                  </div>

                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead className="w-[100px] text-right">
                            Ações
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((row, index) => {
                          const name = selectedNameColumn
                            ? String(row[selectedNameColumn] || '')
                            : '';
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {name || (
                                  <span className="text-muted-foreground italic">
                                    Vazio
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <div
                                    id={`qr-canvas-${name}`}
                                    className="hidden"
                                  >
                                    <QRCodeCanvas
                                      value={staticLink}
                                      size={128}
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={!name || !selectedNameColumn}
                                    onClick={() =>
                                      handlePrint(
                                        name,
                                        staticLink,
                                        currentEventName
                                      )
                                    }
                                  >
                                    <Printer className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {filteredData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={2} className="h-24 text-center">
                              Nenhum participante encontrado.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                  <Upload className="w-8 h-8 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Faça upload de um arquivo CSV ou Excel para começar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
