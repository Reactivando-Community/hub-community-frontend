'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, Info, Loader2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { VotingOption, VotingSessionResponse } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VotacaoPage() {
  const params = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [options, setOptions] = useState<VotingOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [ipAddress, setIpAddress] = useState('127.0.0.1');

  const documentId = params.id as string;

  // Initialize fingerprint and fetch IP
  useEffect(() => {
    let fingerprint = localStorage.getItem('hub_vote_fingerprint');
    if (!fingerprint) {
      fingerprint = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now();
      localStorage.setItem('hub_vote_fingerprint', fingerprint);
    }

    const checkPreviousVote = () => {
      const votesStr = localStorage.getItem('hub_voted_sessions');
      if (votesStr) {
        try {
          const votes = JSON.parse(votesStr);
          if (votes[documentId]) {
            setHasVoted(true);
          }
        } catch (e) {
          // ignore
        }
      }
    };

    checkPreviousVote();

    // Fetch IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress('unknown'));
  }, [documentId]);

  // Fetch Session Details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`https://manager.hubcommunity.io/api/voting-sessions/${documentId}?populate=*`);
        if (!res.ok) throw new Error('Sessão não encontrada');
        
        const data: VotingSessionResponse = await res.json();
        setSession(data.data);
        
        if (data.data.voting_options) {
          // Sort options by pitch_order
          const sortedOptions = [...data.data.voting_options].sort((a, b) => a.pitch_order - b.pitch_order);
          setOptions(sortedOptions);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar',
          description: 'Não foi possível carregar a sessão de votação.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchSession();
    }
  }, [documentId, toast]);

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const submitVote = async () => {
    if (!selectedOptionId) return;
    
    try {
      setSubmitting(true);
      
      const fingerprint = localStorage.getItem('hub_vote_fingerprint') || 'unknown';
      
      const payload = {
        data: {
          ip_address: ipAddress,
          fingerprint: fingerprint,
          voting_session: documentId,
          voting_option: selectedOptionId,
        }
      };

      const res = await fetch('https://manager.hubcommunity.io/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Falha ao registrar voto');
      }

      // Record in local storage
      const votesStr = localStorage.getItem('hub_voted_sessions');
      const votes = votesStr ? JSON.parse(votesStr) : {};
      
      if (!votes[documentId]) {
        votes[documentId] = [];
      }
      
      votes[documentId].push(selectedOptionId);
      localStorage.setItem('hub_voted_sessions', JSON.stringify(votes));
      
      setHasVoted(true);
      triggerConfetti();
      
      toast({
        title: 'Voto Computado!',
        description: 'Seu voto foi registrado com sucesso.',
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Ocorreu um erro ao registrar seu voto. Tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
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
        <p className="text-muted-foreground">Carregando votação...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Sessão não encontrada</h1>
        <p className="text-muted-foreground">A sessão de votação que você está procurando não existe ou foi removida.</p>
      </div>
    );
  }

  if (session.status === 'closed' || session.status === 'archived') {
    return (
      <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
        <Trophy className="h-16 w-16 mx-auto text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-4">Votação Encerrada</h1>
        <p className="text-muted-foreground">Esta sessão de votação já foi finalizada. Obrigado pela participação!</p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <FadeIn direction="up">
        <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
          <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Voto Computado!</h1>
          <p className="text-muted-foreground text-lg">
            Agradecemos sua participação nesta batalha de pitchs. 
            Seu voto é muito importante para os competidores!
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header Section */}
      <div className="bg-background border-b pt-10 pb-12 mb-8">
        <FadeIn direction="down" duration={0.4}>
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {session.title}
            </h1>
            {session.description && (
              <p className="text-lg text-muted-foreground">
                {session.description}
              </p>
            )}
          </div>
        </FadeIn>
      </div>

      <FadeIn direction="up" duration={0.5}>
        <div className="container mx-auto px-4 max-w-3xl">
          {options.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Nenhuma opção cadastrada</AlertTitle>
              <AlertDescription>
                Ainda não há competidores ou opções cadastradas nesta sessão de votação.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-6 text-center">
                Selecione o seu favorito:
              </p>
              
              <div className="grid gap-4">
                {options.map((option) => (
                  <label
                    key={option.documentId}
                    className={`
                      relative flex flex-col md:flex-row md:items-center p-5 cursor-pointer rounded-xl border-2 transition-all
                      ${selectedOptionId === option.documentId 
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                        : 'border-transparent bg-background shadow-sm hover:border-border hover:bg-muted/50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="voting_option"
                      value={option.documentId}
                      checked={selectedOptionId === option.documentId}
                      onChange={() => handleSelect(option.documentId)}
                      className="peer sr-only"
                    />
                    
                    <div className="flex items-start md:items-center gap-4 flex-1">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 text-sm font-bold
                        ${selectedOptionId === option.documentId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        {option.pitch_order}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg md:text-xl text-foreground">
                          {option.name}
                        </h3>
                        {option.description && (
                          <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className={`
                      hidden md:flex items-center justify-center w-6 h-6 rounded-full border-2 ml-4 flex-shrink-0 transition-colors
                      ${selectedOptionId === option.documentId ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}
                    `}>
                      {selectedOptionId === option.documentId && <Check className="w-3.5 h-3.5" />}
                    </div>
                    
                    {/* Mobile check indicator */}
                    <div className="absolute top-5 right-5 md:hidden">
                       <div className={`
                        flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors
                        ${selectedOptionId === option.documentId ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}
                      `}>
                        {selectedOptionId === option.documentId && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Sticky Bottom Action Bar */}
      {options.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
          <div className="container mx-auto max-w-3xl flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">
              {selectedOptionId 
                ? 'Opção selecionada. Pronto para votar?' 
                : 'Selecione uma opção acima para votar.'}
            </span>
            <Button 
              size="lg" 
              className="w-full sm:w-auto font-bold px-8 shadow-lg hover:shadow-xl transition-all"
              disabled={!selectedOptionId || submitting}
              onClick={submitVote}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registrando voto...
                </>
              ) : (
                'Confirmar Voto'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
