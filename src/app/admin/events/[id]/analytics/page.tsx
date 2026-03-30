'use client';

import { useQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Ticket,
  Award,
  TrendingUp,
  UserPlus,
  DollarSign,
  BarChart3,
  Loader2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

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
import { GET_EVENT_ANALYTICS } from '@/lib/queries';
import { EventAnalyticsResponse } from '@/lib/types';

/* ─── Color Palette ──────────────────────────────────────────── */
const COLORS = {
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDim: 'rgba(16, 185, 129, 0.15)',
  secondary: '#8B5CF6',
  secondaryDim: 'rgba(139, 92, 246, 0.15)',
  accent: '#F59E0B',
  accentDim: 'rgba(245, 158, 11, 0.15)',
  info: '#3B82F6',
  infoDim: 'rgba(59, 130, 246, 0.15)',
  slate: '#64748B',
  slateDim: 'rgba(100, 116, 139, 0.15)',
};

const PIE_COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#3B82F6', '#EF4444', '#EC4899'];

/* ─── Metric Card Component ─────────────────────────────────── */
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor,
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  delay?: number;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 
                 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at top right, ${bgColor}, transparent 70%)`,
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className="rounded-xl p-3 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Occupancy Ring ─────────────────────────────────────────── */
function OccupancyRing({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  const getColor = (pct: number) => {
    if (pct >= 90) return '#EF4444';
    if (pct >= 70) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-border/30"
        />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          ocupação
        </span>
      </div>
    </div>
  );
}

/* ─── Custom Tooltip for Area Chart ──────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const date = new Date(label + 'T12:00:00');
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1">{formattedDate}</p>
      <p className="text-sm font-semibold">
        {payload[0].value}{' '}
        <span className="text-muted-foreground font-normal">
          inscriç{payload[0].value === 1 ? 'ão' : 'ões'}
        </span>
      </p>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function EventAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, loading, error, refetch } = useQuery<EventAnalyticsResponse>(
    GET_EVENT_ANALYTICS,
    {
      variables: { slugOrId: id },
      skip: !id,
      fetchPolicy: 'network-only',
    }
  );

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="w-10 h-10 animate-spin text-primary relative" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Carregando analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
          <BarChart3 className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Erro ao carregar analytics</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {error.message}
        </p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const analytics = data?.eventAnalytics;
  if (!analytics) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <p className="text-muted-foreground">Evento não encontrado.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  // Calculate total revenue
  const totalRevenue = analytics.products_breakdown.reduce((sum, product) => {
    return sum + product.batches.reduce((bSum, batch) => bSum + batch.revenue, 0);
  }, 0);

  // Prepare pie data for free vs paid
  const signupDistribution = [
    { name: 'Gratuitas', value: analytics.free_signups, color: COLORS.primary },
    { name: 'Pagas', value: analytics.paid_signups, color: COLORS.secondary },
  ].filter(d => d.value > 0);

  // Prepare timeline data with formatted labels
  const timelineData = analytics.signups_timeline.map(point => ({
    ...point,
    label: new Date(point.date + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
  }));

  // Cumulative signups
  let cumulative = 0;
  const cumulativeData = timelineData.map(point => {
    cumulative += point.count;
    return { ...point, cumulative };
  });

  return (
    <FadeIn direction="up" duration={0.3}>
      <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
        {/* ─── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {analytics.event_title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics do Evento
                {analytics.event_slug && (
                  <span className="text-xs opacity-60">
                    /{analytics.event_slug}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(`/events/${analytics.event_slug || id}`, '_blank')
              }
              className="gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Evento
            </Button>
          </div>
        </div>

        {/* ─── KPI Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Inscritos"
            value={analytics.total_signups}
            subtitle={
              analytics.max_slots
                ? `de ${analytics.max_slots} vagas`
                : undefined
            }
            icon={Users}
            color={COLORS.primary}
            bgColor={COLORS.primaryDim}
            delay={0}
          />
          <MetricCard
            title="Inscrições Gratuitas"
            value={analytics.free_signups}
            subtitle={
              analytics.total_signups > 0
                ? `${Math.round(
                    (analytics.free_signups / analytics.total_signups) * 100
                  )}% do total`
                : undefined
            }
            icon={Ticket}
            color={COLORS.info}
            bgColor={COLORS.infoDim}
            delay={50}
          />
          <MetricCard
            title="Inscrições Pagas"
            value={analytics.paid_signups}
            subtitle={
              totalRevenue > 0
                ? `R$ ${totalRevenue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })} arrecadados`
                : undefined
            }
            icon={DollarSign}
            color={COLORS.secondary}
            bgColor={COLORS.secondaryDim}
            delay={100}
          />
          <MetricCard
            title="Solicitações de Certificado"
            value={analytics.certificate_requests}
            subtitle={
              analytics.total_signups > 0
                ? `${Math.round(
                    (analytics.certificate_requests /
                      analytics.total_signups) *
                      100
                  )}% dos inscritos`
                : undefined
            }
            icon={Award}
            color={COLORS.accent}
            bgColor={COLORS.accentDim}
            delay={150}
          />
        </div>

        {/* ─── Charts Row ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Chart */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Inscrições ao Longo do Tempo
              </CardTitle>
              <CardDescription>
                Evolução diária e acumulada das inscrições
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cumulativeData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={cumulativeData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="gradientPrimary"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={COLORS.primary}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor={COLORS.primary}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke={COLORS.primary}
                        strokeWidth={2.5}
                        fill="url(#gradientPrimary)"
                        dot={false}
                        activeDot={{
                          r: 6,
                          fill: COLORS.primary,
                          stroke: '#fff',
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhuma inscrição registrada ainda.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Occupancy + Distribution */}
          <div className="space-y-6">
            {/* Occupancy */}
            {analytics.max_slots && analytics.occupancy_percentage !== null && (
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Ocupação
                  </CardTitle>
                  <CardDescription>
                    {analytics.total_signups} de {analytics.max_slots} vagas
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <OccupancyRing
                    percentage={analytics.occupancy_percentage}
                  />
                </CardContent>
              </Card>
            )}

            {/* Signup Distribution Pie */}
            {signupDistribution.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Distribuição
                  </CardTitle>
                  <CardDescription>Gratuitas vs. Pagas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[160px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={signupDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {signupDistribution.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid hsl(var(--border))',
                            backgroundColor: 'hsl(var(--card))',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-2">
                    {signupDistribution.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">
                          {entry.name}
                        </span>
                        <span className="font-semibold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ─── Products Breakdown ──────────────────────────────── */}
        {analytics.products_breakdown.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Ticket className="w-4 h-4 text-secondary" />
                Produtos e Lotes
              </CardTitle>
              <CardDescription>
                Vendas e receita por produto/lote
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Bar chart for product comparison */}
              {analytics.products_breakdown.length > 1 && (
                <div className="h-[200px] w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.products_breakdown.map((p) => ({
                        name:
                          p.product_name.length > 20
                            ? p.product_name.slice(0, 20) + '…'
                            : p.product_name,
                        inscritos: p.total_signups,
                      }))}
                      margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 11,
                          fill: 'hsl(var(--muted-foreground))',
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: 'hsl(var(--muted-foreground))',
                        }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid hsl(var(--border))',
                          backgroundColor: 'hsl(var(--card))',
                          fontSize: '12px',
                        }}
                      />
                      <Bar
                        dataKey="inscritos"
                        fill={COLORS.secondary}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Product details table */}
              <div className="space-y-4">
                {analytics.products_breakdown.map((product, pIndex) => (
                  <div
                    key={product.product_id}
                    className="rounded-xl border border-border/50 overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        backgroundColor:
                          PIE_COLORS[pIndex % PIE_COLORS.length] + '10',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-8 rounded-full"
                          style={{
                            backgroundColor:
                              PIE_COLORS[pIndex % PIE_COLORS.length],
                          }}
                        />
                        <div>
                          <p className="font-semibold text-sm">
                            {product.product_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.total_signups} inscriç
                            {product.total_signups === 1 ? 'ão' : 'ões'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {product.batches.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="text-xs">Lote</TableHead>
                            <TableHead className="text-xs">
                              Valor Unitário
                            </TableHead>
                            <TableHead className="text-xs">
                              Vendidos
                            </TableHead>
                            <TableHead className="text-xs">
                              Capacidade
                            </TableHead>
                            <TableHead className="text-xs text-right">
                              Receita
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.batches.map((batch) => (
                            <TableRow
                              key={batch.batch_id}
                              className="hover:bg-muted/30"
                            >
                              <TableCell className="font-medium text-sm">
                                Lote {batch.batch_number}
                              </TableCell>
                              <TableCell className="text-sm">
                                {batch.value > 0
                                  ? `R$ ${batch.value.toLocaleString('pt-BR', {
                                      minimumFractionDigits: 2,
                                    })}`
                                  : 'Gratuito'}
                              </TableCell>
                              <TableCell className="text-sm">
                                <span className="font-semibold">
                                  {batch.sold_quantity}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                {batch.max_quantity || '∞'}
                              </TableCell>
                              <TableCell className="text-sm text-right font-medium">
                                {batch.revenue > 0
                                  ? `R$ ${batch.revenue.toLocaleString(
                                      'pt-BR',
                                      {
                                        minimumFractionDigits: 2,
                                      }
                                    )}`
                                  : '—'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── Recent Signups ──────────────────────────────────── */}
        {analytics.recent_signups.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" />
                Inscrições Recentes
              </CardTitle>
              <CardDescription>
                Últimas {analytics.recent_signups.length} inscrições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.recent_signups.map((signup, index) => {
                      const date = signup.created_at
                        ? new Date(signup.created_at).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )
                        : '—';

                      let phone = signup.phone_number || '—';
                      if (phone.length >= 10 && phone.length <= 11) {
                        phone = phone.replace(
                          /(\d{2})(\d{4,5})(\d{4})/,
                          '($1) $2-$3'
                        );
                      }

                      return (
                        <TableRow key={index} className="hover:bg-muted/30">
                          <TableCell className="font-medium whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                {(signup.name || 'A').charAt(0).toUpperCase()}
                              </div>
                              {signup.name || '—'}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {signup.email || '—'}
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {phone}
                          </TableCell>
                          <TableCell className="text-sm">
                            {signup.product_name || '—'}
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                            {date}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </FadeIn>
  );
}
