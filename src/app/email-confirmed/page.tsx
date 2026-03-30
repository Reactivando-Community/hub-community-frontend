'use client';

import { CheckCircle, LogIn } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { AuthModal } from '@/components/auth-modal';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';

function EmailConfirmedContent() {
  const searchParams = useSearchParams();
  const isAlreadyConfirmed = searchParams.get('already') === 'true';
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Auto-open login modal after a short delay
    const timer = setTimeout(() => setShowAuth(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <FadeIn direction="up" duration={0.4}>
        <div className="max-w-md w-full text-center space-y-6">
          {/* Success Icon */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isAlreadyConfirmed
                ? 'Conta já confirmada!'
                : 'Conta confirmada com sucesso!'}
            </h1>
            <p className="text-muted-foreground">
              {isAlreadyConfirmed
                ? 'Sua conta já foi ativada anteriormente. Faça login para continuar.'
                : 'Sua conta foi ativada. Agora você pode fazer login e acessar todos os recursos.'}
            </p>
          </div>

          {/* Login Button */}
          <Button
            onClick={() => setShowAuth(true)}
            className="w-full rounded-xl h-12 text-base font-medium"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Fazer Login
          </Button>
        </div>
      </FadeIn>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </div>
  );
}

export default function EmailConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-emerald-500 animate-spin" />
        </div>
      }
    >
      <EmailConfirmedContent />
    </Suspense>
  );
}
