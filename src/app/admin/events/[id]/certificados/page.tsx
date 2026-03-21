'use client';

import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GET_EVENT_BY_SLUG_OR_ID } from '@/lib/queries';
import { useQuery } from '@apollo/client';
import { ArrowLeft, Loader2, Download } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface Participant {
  id: number;
  documentId: string;
  name: string;
  email: string;
  identifier: string; // CPF
  phone_number: string;
  createdAt: string;
}

export default function CertificadosAdminPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: eventData, loading: eventLoading } = useQuery(
    GET_EVENT_BY_SLUG_OR_ID,
    {
      variables: { slugOrId: id },
      skip: !id,
    }
  );

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eventData?.eventBySlugOrId?.documentId) {
      if (!eventLoading) setLoading(false);
      return;
    }

    const fetchParticipants = async () => {
      try {
        const eventDocId = eventData.eventBySlugOrId.documentId;
        const res = await fetch(
          `https://manager.hubcommunity.io/api/participants?populate=*&filters[event][$eq]=${eventDocId}&sort=createdAt:desc`
        );
        if (!res.ok) throw new Error('Falha ao buscar os participantes');

        const json = await res.json();
        setParticipants(json.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro desconhecido ao carregar os dados.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventData, eventLoading]);

  const handleDownloadCSV = () => {
    if (participants.length === 0) return;

    const wsData = participants.map(p => {
      const date = p.createdAt
        ? new Date(p.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '--/--/----';

      let formattedCpf = p.identifier || '-';
      if (formattedCpf.length === 11) {
        formattedCpf = formattedCpf.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          '$1.$2.$3-$4'
        );
      }

      let formattedPhone = p.phone_number || '-';
      if (formattedPhone.length >= 10 && formattedPhone.length <= 11) {
        formattedPhone = formattedPhone.replace(
          /(\d{2})(\d{4,5})(\d{4})/,
          '($1) $2-$3'
        );
      }

      return {
        'Nome': p.name || '-',
        'CPF': formattedCpf,
        'E-mail': p.email || '-',
        'WhatsApp': formattedPhone,
        'Data da Solicitação': date,
      };
    });

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Certificados');
    XLSX.writeFile(wb, `certificados-${eventData?.eventBySlugOrId?.slug || 'evento'}.csv`, { bookType: 'csv' });
  };

  if (eventLoading || (loading && !error)) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const eventTitle = eventData?.eventBySlugOrId?.title || 'Evento';

  return (
    <FadeIn direction="up" duration={0.3}>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Solicitações de Certificado
            </h1>
            <p className="text-muted-foreground mt-1">{eventTitle}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>Participantes ({participants.length})</CardTitle>
                <CardDescription>
                  Lista de pessoas que solicitaram o certificado.
                </CardDescription>
              </div>
              {participants.length > 0 && (
                <Button onClick={handleDownloadCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
                {error}
              </div>
            ) : participants.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma solicitação encontrada.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Data da Solicitação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map(p => {
                      const date = p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--/--/----';

                      let formattedCpf = p.identifier || '-';
                      if (formattedCpf.length === 11) {
                        formattedCpf = formattedCpf.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          '$1.$2.$3-$4'
                        );
                      }

                      let formattedPhone = p.phone_number || '-';
                      if (
                        formattedPhone.length >= 10 &&
                        formattedPhone.length <= 11
                      ) {
                        formattedPhone = formattedPhone.replace(
                          /(\d{2})(\d{4,5})(\d{4})/,
                          '($1) $2-$3'
                        );
                      }

                      return (
                        <TableRow key={p.documentId || p.id}>
                          <TableCell className="font-medium whitespace-nowrap">
                            {p.name || '-'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formattedCpf}
                          </TableCell>
                          <TableCell>{p.email || '-'}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formattedPhone}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {date}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  );
}
