
import React, { useState } from 'react';
import { AnalysisResponse, StructureInfo } from '../types';
import { getStructureDeepDive } from '../services/geminiService';

interface DetailPanelProps {
  analysis: AnalysisResponse | null;
  loading: boolean;
  onStructureHover: (region: string | null) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ analysis, loading, onStructureHover }) => {
  const [activeStructure, setActiveStructure] = useState<StructureInfo | null>(null);
  const [fetchingStructure, setFetchingStructure] = useState(false);

  // Mapeo simple de estructuras neuroanatómicas comunes a regiones del modelo
  const mapStructureToRegion = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('corteza') || n.includes('mesencéfalo') || n.includes('puente') || n.includes('bulbo') || n.includes('giro') || n.includes('ojo') || n.includes('par craneal') || n.includes('núcleo')) return 'head';
    if (n.includes('brazo') || n.includes('mano') || n.includes('braquial') || n.includes('bíceps') || n.includes('tríceps')) return 'arm';
    if (n.includes('médula') || n.includes('dermatoma') || n.includes('torácico') || n.includes('abdominal')) return 'torso';
    if (n.includes('pierna') || n.includes('femoral') || n.includes('ciático') || n.includes('aquiliano')) return 'leg';
    if (n.includes('pie') || n.includes('marcha') || n.includes('tándem')) return 'foot';
    return 'head'; // Default al centro de control
  };

  const handleStructureClick = async (name: string) => {
    setFetchingStructure(true);
    try {
      const info = await getStructureDeepDive(name);
      setActiveStructure(info);
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingStructure(false);
    }
  };

  const renderContentWithButtons = (content: string) => {
    const parts = content.split(/(\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const name = part.slice(2, -2);
        return (
          <button
            key={i}
            onMouseEnter={() => onStructureHover(mapStructureToRegion(name))}
            onMouseLeave={() => onStructureHover(null)}
            onClick={() => handleStructureClick(name)}
            className="mx-1 px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-md border border-cyan-500/30 transition-all font-black text-[11px] uppercase tracking-tighter shadow-sm"
          >
            {name}
          </button>
        );
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: part
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mb-8 text-white tracking-tighter italic border-b border-white/5 pb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-black mt-12 mb-6 text-cyan-400 flex items-center gap-3"><span class="w-2 h-8 bg-cyan-500 rounded-full"></span>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xs font-black mt-8 mb-4 text-indigo-400 uppercase tracking-[0.3em]">$1</h3>')
        .replace(/^\d\. (.*$)/gim, '<div class="p-6 bg-slate-950/60 rounded-[2rem] mb-6 border border-white/5 font-medium text-slate-300 leading-relaxed shadow-inner">$1</div>')
        .replace(/\n/g, '<br/>')
      }} />;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent animate-pulse" />
        <div className="relative z-10">
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(34,211,238,0.2)] mx-auto"></div>
          <h3 className="text-white font-black text-2xl tracking-tighter mb-3">CONECTANDO VÍAS...</h3>
          <p className="text-[10px] text-cyan-400 uppercase font-black tracking-[0.4em]">Decodificando Neuroanatomía</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-16 text-center bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-800 opacity-60 group hover:opacity-100 transition-opacity duration-700">
        <div className="w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center mb-8 shadow-2xl border border-white/5 transition-transform group-hover:scale-110 duration-500">
          <svg className="w-12 h-12 text-cyan-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-white font-black text-lg mb-3 tracking-tight italic">SISTEMA LISTO</h4>
        <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] font-medium">Inicia una exploración táctil en el modelo o consulta el buscador para desglosar la conectividad cerebral.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] transition-all duration-700 relative">
      {(activeStructure || fetchingStructure) && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden flex flex-col max-h-full">
            {fetchingStructure ? (
              <div className="flex flex-col items-center py-20 gap-6">
                <div className="w-12 h-12 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Consultando Atlas Embryo...</p>
              </div>
            ) : activeStructure && (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Knowledge Hub</h4>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">{activeStructure.name}</h3>
                  </div>
                  <button onClick={() => setActiveStructure(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar">
                  <div>
                    <h5 className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-cyan-400/30"></span> Embriología
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeStructure.embryology}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-emerald-400/30"></span> Localización
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeStructure.localization}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-violet-400/30"></span> Función
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeStructure.function}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex-shrink-0 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Expert Insight</h2>
        </div>
        <div className="px-4 py-1.5 bg-cyan-500/10 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest border border-cyan-500/20">
          Neurología 3.0
        </div>
      </div>
      
      <div className="p-10 overflow-y-auto flex-1 scroll-smooth custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.05),transparent)]">
        <div className="prose prose-invert prose-sm max-w-none text-slate-300 text-sm leading-relaxed">
          {renderContentWithButtons(analysis.content)}
        </div>
        
        {analysis.sources.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 text-center">Grounding Base de Datos</h4>
            <div className="grid grid-cols-1 gap-4">
              {analysis.sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-5 bg-slate-950 border border-white/5 rounded-[1.8rem] hover:bg-cyan-500 transition-all duration-500 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 flex-shrink-0 bg-slate-900 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-white group-hover:text-cyan-600 transition-all duration-500 shadow-xl">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <span className="truncate font-black text-slate-200 text-[11px] group-hover:text-white transition-colors tracking-tight">{source.title}</span>
                  </div>
                  <svg className="w-5 h-5 text-slate-700 group-hover:text-white transform group-hover:translate-x-2 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
