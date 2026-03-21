'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, PartyPopper, Camera, ArrowLeft, Star, Sparkles, Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function VencedoresPage() {
  const [winners, setWinners] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedWinners = localStorage.getItem('draw_winners_history');
    if (savedWinners) {
      try {
        const parsed = JSON.parse(savedWinners);
        // Ordem cronológica (1º sorteado no topo)
        setWinners([...parsed].reverse());
      } catch (e) {
        console.error("Erro ao carregar ganhadores", e);
      }
    }
  }, []);

  const exportAsPDF = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);

    try {
      // Pequeno delay para garantir que o DOM está pronto e animações paradas
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = captureRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('galeria-vencedores-hub.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsImage = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = captureRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = 'vencedores-hub-community.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden winners-page">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Floating Controls (No-Print) */}
      <div className="fixed top-6 left-6 z-[60] flex gap-3 print:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-slate-900/50 border-slate-700 backdrop-blur-md hover:bg-slate-800"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="fixed top-6 right-6 z-[60] flex gap-3 print:hidden">
        <AnimatePresence>
          {isExporting ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md"
            >
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-sm font-medium">Gerando...</span>
            </motion.div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="rounded-full bg-slate-900/50 border-slate-700 backdrop-blur-md hover:bg-slate-800 gap-2 px-6"
                onClick={exportAsImage}
              >
                <Camera className="w-4 h-4" />
                PNG
              </Button>
              <Button 
                className="rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 gap-2 px-6"
                onClick={exportAsPDF}
              >
                <FileText className="w-4 h-4" />
                Baixar PDF
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area - Landscape Inspired */}
      <div 
        ref={captureRef}
        id="capture-area" 
        className="relative w-full max-w-[1280px] min-h-[720px] flex items-center justify-center bg-[#020617] border border-slate-800/50 rounded-[48px] shadow-2xl p-12 overflow-visible landscape-frame"
      >
        
        {/* Decorative Internal Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <Star className="absolute top-12 left-12 text-blue-500/20 w-8 h-8 opacity-50" />
           <Star className="absolute bottom-12 right-12 text-purple-500/20 w-12 h-12 opacity-50" />
           <Sparkles className="absolute top-24 right-24 text-blue-400/20 w-6 h-6 animate-bounce" />
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
            {/* Header */}
            <header className="text-center mb-12 flex flex-col items-center">
              <div
                className="flex items-center justify-center gap-3 px-6 h-11 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-black uppercase tracking-[0.25em] mb-8 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]"
              >
                <Trophy className="w-4 h-4 flex-shrink-0" />
                <span className="leading-[0] mt-0.5">Hall of Fame 2026</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
                Grandes Ganhadores
              </h1>
              <div className="h-1.5 w-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
            </header>

            {/* Next Winner Button */}
            {visibleCount < winners.length && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex justify-center print:hidden"
                data-html2canvas-ignore="true"
              >
                 <Button 
                   onClick={() => setVisibleCount(prev => prev + 1)}
                   className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/25 border-0 gap-3 px-8 py-6 text-lg font-bold text-white transition-all hover:scale-105"
                 >
                   <Sparkles className="w-6 h-6" />
                   {visibleCount === 0 ? "Revelar 1º Ganhador" : "Revelar Próximo Ganhador"}
                 </Button>
              </motion.div>
            )}

            {/* List Grid - Centralized and Balanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
              {winners.length > 0 ? (
                winners.slice(0, visibleCount).map((name, index) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    key={`${name}-${index}`}
                    className="relative group pr-4"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[32px] blur opacity-20" />
                    <div className="relative flex items-center gap-5 p-7 bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl min-h-[110px]">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 grid place-items-center">
                        <span className="font-black text-2xl text-white leading-none tabular-nums">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Vencedor</p>
                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight break-words">
                          {name}
                        </h3>
                      </div>
                      <PartyPopper className="w-5 h-5 text-blue-500/40 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                   <p className="text-slate-500 italic">Aguardando os novos campeões...</p>
                </div>
              )}
            </div>

            {/* Platform Footer */}
            <footer className="mt-20 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-[1px] bg-slate-800" />
                 <span className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">Hub Community</span>
                 <div className="w-12 h-[1px] bg-slate-800" />
              </div>
              <p className="text-xs text-slate-600 font-medium">Comunidade & Inovação • 2026</p>
            </footer>
        </div>
      </div>

      <style jsx global>{`
        /* Oculta Navbar e Elementos Globais na Impressão */
        @media print {
          header, nav, footer:not(.landscape-frame footer), .no-print {
            display: none !important;
          }
          
          body, html {
            background-color: #020617 !important;
            color: #f8fafc !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .winners-page {
            padding: 0 !important;
            margin: 0 !important;
            background: #020617 !important;
          }

          #capture-area {
            border: none !important;
            border-radius: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            background-color: #020617 !important;
          }
        }

        .landscape-frame {
           scrollbar-width: none;
        }
        .landscape-frame::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
