'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Medal, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { VotingSessionResponse } from '@/lib/types';

interface VotingResult {
  option: string;
  votes: number;
}

export default function VotacaoResultadosPage() {
  const params = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [results, setResults] = useState<VotingResult[]>([]);

  const documentId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch session to check status
        const sessionRes = await fetch(`https://manager.hubcommunity.io/api/voting-sessions/${documentId}`);
        if (!sessionRes.ok) throw new Error('Sessão não encontrada');
        
        const sessionData: VotingSessionResponse = await sessionRes.json();
        const currentSession = sessionData.data;
        setSession(currentSession);

        // If not open, fetch results
        if (currentSession.status !== 'open') {
          const resultsRes = await fetch(`https://manager.hubcommunity.io/api/voting/results/${documentId}`);
          if (!resultsRes.ok) throw new Error('Falha ao obter resultados');
          
          const resultsData: VotingResult[] = await resultsRes.json();
          // Sort results primarily by votes (descending)
          const sortedResults = [...resultsData].sort((a, b) => b.votes - a.votes);
          setResults(sortedResults);

          // Trigger confetti only if we actually have results and winners
          if (sortedResults.length > 0) {
            triggerConfetti();
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar',
          description: 'Não foi possível carregar os resultados da votação.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchData();
    }
  }, [documentId, toast]);

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Apuração dos votos em andamento...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Sessão não encontrada</h1>
        <p className="text-muted-foreground">A sessão de votação que você está procurando não existe.</p>
        <Link href="/">
          <Button className="mt-6">Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  if (session.status === 'open') {
    return (
      <FadeIn direction="up">
        <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
          <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Votação em Andamento!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Os resultados desta sessão estarão disponíveis apenas quando a votação for encerrada.
          </p>
          <Link href={`/votacao/${documentId}`}>
            <Button size="lg">Acessar página de Votação</Button>
          </Link>
        </div>
      </FadeIn>
    );
  }

  // The actual winners (Top 3)
  const top3 = results.slice(0, 3);
  const otherResults = results.slice(3);

  return (
    <div className="min-h-screen bg-muted/30 pb-24 pattern-zigzag-3D">
      {/* Header Section */}
      <div className="bg-background border-b pt-10 pb-12 mb-12 shadow-sm">
        <FadeIn direction="down" duration={0.4}>
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-100 text-yellow-600 rounded-full mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Resultados Oficiais
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {session.title}
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Sem votos computados</h3>
            <p className="text-muted-foreground">Não houve participação nesta sessão de votação.</p>
          </div>
        ) : (
          <>
            {/* Podium for Top 3 */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 mb-16 pt-8">
              {/* 2nd Place */}
              {top3[1] && (
                <FadeIn direction="up" delay={0.3} className="w-full md:w-1/3 order-2 md:order-1">
                  <div className="flex flex-col items-center">
                    <div className="bg-background border-2 border-slate-300 rounded-xl p-6 shadow-lg w-full text-center relative z-10 hover:scale-105 transition-transform">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-200 text-slate-600 rounded-full p-2 border-2 border-white shadow-sm">
                        <Medal className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-xl mt-4 mb-1 line-clamp-1" title={top3[1].option}>
                        {top3[1].option}
                      </h3>
                      <p className="text-3xl font-black text-slate-500">{top3[1].votes} <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">votos</span></p>
                    </div>
                    <div className="h-16 md:h-24 w-full bg-slate-300 rounded-b-lg -mt-2 border-x-2 border-b-2 border-slate-300/50 opacity-80" />
                  </div>
                </FadeIn>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <FadeIn direction="up" delay={0.6} className="w-full md:w-1/3 order-1 md:order-2">
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-400 rounded-xl p-8 shadow-xl w-full text-center relative z-20 scale-105 hover:scale-110 transition-transform">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-600 rounded-full p-3 border-4 border-white shadow-md">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <h3 className="font-extrabold text-2xl mt-4 mb-1 text-yellow-950 line-clamp-1" title={top3[0].option}>
                        {top3[0].option}
                      </h3>
                      <p className="text-4xl font-black text-yellow-900">{top3[0].votes} <span className="text-sm font-bold uppercase tracking-widest text-yellow-800/80">votos</span></p>
                    </div>
                    <div className="h-8 md:h-32 w-[98%] bg-yellow-500 rounded-b-lg -mt-2 border-x-2 border-b-2 border-yellow-400/50 opacity-80" />
                  </div>
                </FadeIn>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <FadeIn direction="up" delay={0.1} className="w-full md:w-1/3 order-3 md:order-3">
                  <div className="flex flex-col items-center">
                    <div className="bg-background border-2 border-amber-600/50 rounded-xl p-6 shadow-md w-full text-center relative z-10 hover:scale-105 transition-transform">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-700 rounded-full p-2 border-2 border-white shadow-sm">
                        <Medal className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg mt-4 mb-1 line-clamp-1" title={top3[2].option}>
                        {top3[2].option}
                      </h3>
                      <p className="text-2xl font-black text-amber-900/80">{top3[2].votes} <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">votos</span></p>
                    </div>
                    <div className="h-4 md:h-16 w-[96%] bg-amber-600/50 rounded-b-lg -mt-2 border-x-2 border-b-2 border-amber-600/30 opacity-80" />
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Other Results (if any) */}
            {otherResults.length > 0 && (
              <FadeIn direction="up" delay={0.8}>
                <div className="max-w-2xl mx-auto">
                  <h4 className="text-lg font-bold mb-4 text-center text-muted-foreground">Demais Colocações</h4>
                  <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    {otherResults.map((result, index) => (
                      <div 
                        key={result.option} 
                        className={`flex items-center justify-between p-4 ${index !== otherResults.length - 1 ? 'border-b' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-muted-foreground w-6 text-center">
                            {index + 4}º
                          </span>
                          <span className="font-medium">{result.option}</span>
                        </div>
                        <span className="font-semibold px-3 py-1 bg-muted rounded-full text-sm">
                          {result.votes} votos
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </div>
  );
}
