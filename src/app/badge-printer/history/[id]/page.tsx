'use client';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import * as XLSX from 'xlsx';

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

interface CSVRow {
  [key: string]: any;
  __printed?: boolean;
  __manual?: boolean;
}

interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: number;
  data: CSVRow[];
  headers: string[];
  nameColumn: string;
  eventName: string;
  link: string;
}

const STORAGE_KEY = 'badge-printer-history-v1';

const COLORS = [
  '#22c55e',
  '#ef4444',
  '#3b82f6',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
];

export default function HistoryDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const history: HistoryItem[] = JSON.parse(saved);
        const found = history.find(h => h.id === id);
        if (found) {
          setItem(found);
        }
      } catch (e) {
        console.error('Error loading history item:', e);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        Carregando relatório...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto py-10 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Relatório não encontrado</h1>
        <Link href="/badge-printer/csv">
          <Button>Voltar para Impressão</Button>
        </Link>
      </div>
    );
  }

  const total = item.data.length;
  const printed = item.data.filter(row => row.__printed).length;
  const manual = item.data.filter(row => row.__manual).length;
  const notPrinted = total - printed;

  const printData = [
    { name: 'Impresso', value: printed },
    { name: 'Não Impresso', value: notPrinted },
  ];

  // Logic to find categorical columns (e.g., ticket types, sectors)
  const categoricalStats = item.headers
    .filter(header => {
      if (header === item.nameColumn || header.startsWith('__')) return false;
      // Heuristic: if it has between 2 and 8 unique values, it's likely categorical
      const values = item.data.map(row => String(row[header] || 'Vazio'));
      const uniqueValues = new Set(values);
      return uniqueValues.size > 1 && uniqueValues.size <= 8;
    })
    .map(header => {
      const counts: Record<string, number> = {};
      item.data.forEach(row => {
        const val = String(row[header] || 'Vazio');
        counts[val] = (counts[val] || 0) + 1;
      });
      const data = Object.entries(counts).map(([name, value]) => ({
        name,
        value,
      }));
      return { header, data };
    });

  const exportReport = () => {
    const exportData = item.data.map(row => {
      const { __printed, __manual, ...rest } = row;
      return {
        ...rest,
        'Impresso?': __printed ? 'Sim' : 'Não',
        Origem: __manual ? 'Manual' : 'Importado',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, `relatorio_${item.fileName.split('.')[0]}.xlsx`);
  };

  return (
    <main className="container mx-auto py-10 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/badge-printer/csv">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <FileText className="w-8 h-8 text-primary" />
                Relatório: {item.fileName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.timestamp).toLocaleString('pt-BR')}
                </span>
                <span className="font-bold text-primary">{item.eventName}</span>
              </div>
            </div>
          </div>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar XLSX
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">
                Participantes no lote
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-green-600">
                Impressos
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{printed}</div>
              <p className="text-xs text-muted-foreground">
                {((printed / total) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-blue-600">
                Manuais
              </CardTitle>
              <Printer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{manual}</div>
              <p className="text-xs text-muted-foreground">
                Criados na recepção
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-red-600">
                Restante
              </CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {notPrinted}
              </div>
              <p className="text-xs text-muted-foreground">
                Crachás não impressos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Progresso de Impressão</CardTitle>
              <CardDescription>Percentual de crachás entregues</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={printData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#f1f5f9" stroke="#e2e8f0" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {categoricalStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Distribuição: {categoricalStats[0].header}
                </CardTitle>
                <CardDescription>
                  Análise por {categoricalStats[0].header.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoricalStats[0].data}>
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {categoricalStats[0].data.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Categories Bar Charts Grid */}
        {categoricalStats.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoricalStats.slice(1).map((stat, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">Por {stat.header}</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stat.data} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        fontSize={10}
                        width={80}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Listagem Completa</CardTitle>
            <CardDescription>
              Todos os dados salvos nesta sessão.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    {item.headers
                      .slice(0, 3)
                      .map(
                        h =>
                          h !== item.nameColumn && (
                            <TableHead key={h}>{h}</TableHead>
                          )
                      )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {row.__printed ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Impresso
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                            Pendente
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {row[item.nameColumn]}
                      </TableCell>
                      <TableCell>
                        {row.__manual ? (
                          <span className="text-[10px] text-blue-600 font-bold uppercase">
                            Manual
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-bold uppercase">
                            Importado
                          </span>
                        )}
                      </TableCell>
                      {item.headers
                        .slice(0, 3)
                        .map(
                          h =>
                            h !== item.nameColumn && (
                              <TableCell key={h}>
                                {String(row[h] || '-')}
                              </TableCell>
                            )
                        )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
