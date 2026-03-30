'use client';

import {
  ArrowRight,
  Building2,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mic,
  Shield,
  Vote,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '';

const adminRoutes = [
  {
    title: 'Gerenciar Eventos',
    description: 'Crie, edite e exclua eventos. Gerencie certificados e inscrições.',
    href: '/admin/events',
    icon: Calendar,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderHover: 'hover:border-emerald-500/30',
    shadowHover: 'hover:shadow-emerald-500/5',
  },
  {
    title: 'Gerenciar Palestrantes',
    description: 'Cadastre palestrantes, gerencie avatares e destaques.',
    href: '/admin/speakers',
    icon: Mic,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderHover: 'hover:border-violet-500/30',
    shadowHover: 'hover:shadow-violet-500/5',
  },
  {
    title: 'Sessões de Votação',
    description: 'Crie e gerencie sessões de votação para a comunidade.',
    href: '/admin/voting-sessions',
    icon: Vote,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderHover: 'hover:border-amber-500/30',
    shadowHover: 'hover:shadow-amber-500/5',
  },
  {
    title: 'Gerenciar Comunidades',
    description: 'Cadastre comunidades, gerencie logos e informações.',
    href: '/admin/communities',
    icon: Building2,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderHover: 'hover:border-cyan-500/30',
    shadowHover: 'hover:shadow-cyan-500/5',
  },
];

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_authorized');
    if (stored === 'true') {
      setIsAuthorized(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authorized', 'true');
      setIsAuthorized(true);
    } else {
      setError('Senha incorreta');
      setPassword('');
    }
  };

  // Loading state while checking sessionStorage
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Password gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <FadeIn direction="up" duration={0.4}>
          <div className="w-full max-w-sm">
            {/* Lock icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-1">
              Área Administrativa
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Digite a senha para acessar o painel
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha de acesso"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={`pl-10 pr-10 h-12 rounded-xl border-border/60 focus:border-primary ${
                    error ? 'border-destructive focus:border-destructive' : ''
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center animate-shake">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold"
                disabled={!password.trim()}
              >
                Acessar Painel
              </Button>
            </form>
          </div>
        </FadeIn>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <FadeIn direction="up" duration={0.3}>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Painel Admin
                </h1>
              </div>
              <p className="text-muted-foreground ml-[52px]">
                Gerencie eventos, palestrantes, comunidades e votações
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <FadeIn direction="up" duration={0.3} delay={0.05}>
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Módulos
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {adminRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <StaggerItem key={route.href}>
                <Link href={route.href} className="block group h-full">
                  <div
                    className={`relative flex flex-col h-full rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 ${route.borderHover} hover:shadow-lg ${route.shadowHover}`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl ${route.bgColor} flex items-center justify-center mb-4`}
                    >
                      <Icon className={`h-6 w-6 ${route.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {route.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {route.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Acessar
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
