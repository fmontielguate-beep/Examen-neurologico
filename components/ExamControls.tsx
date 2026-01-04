
import React, { useState } from 'react';
import { AnatomicalLayer, ClinicalCase } from '../types';
import { CLINICAL_CASES } from '../constants';

interface ExamControlsProps {
  activeLayer: AnatomicalLayer;
  setActiveLayer: (layer: AnatomicalLayer) => void;
  onCaseSelect: (c: ClinicalCase | null) => void;
  onSearch: (query: string) => void;
  activeCase: ClinicalCase | null;
  loading: boolean;
}

const ExamControls: React.FC<ExamControlsProps> = ({ 
  activeLayer, 
  setActiveLayer, 
  onCaseSelect, 
  onSearch, 
  activeCase, 
  loading 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-slate-900 text-slate-400 h-full overflow-y-auto custom-scrollbar">
      {/* Search Section */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] block ml-1">
          Buscador Cerebral
        </label>
        <form onSubmit={handleSearchSubmit} className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Analizar técnica..."
            className="w-full bg-slate-950 text-white pl-5 pr-12 py-4 text-sm border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-700 shadow-2xl"
          />
          <button 
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-cyan-400 disabled:opacity-30 transition-all hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      <div className="h-px bg-white/5 mx-2" />

      {/* Layers Section */}
      <div className="space-y-5">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Configuración Óptica</h3>
        <div className="grid grid-cols-1 gap-2.5">
          {Object.values(AnatomicalLayer).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-5 py-3.5 text-left text-xs rounded-2xl transition-all font-black flex items-center justify-between group border-2 ${
                activeLayer === layer 
                  ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_25px_rgba(34,211,238,0.3)]' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {layer}
              {activeLayer === layer && (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Section */}
      <div className="space-y-5">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Simulaciones Reales</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onCaseSelect(null)}
            className={`px-5 py-3.5 text-left text-xs rounded-2xl border-2 border-dashed font-black transition-all ${
              !activeCase 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                : 'border-slate-800 text-slate-700 hover:border-slate-700 hover:text-slate-500'
            }`}
          >
            Exploración Estándar
          </button>
          {CLINICAL_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => onCaseSelect(c)}
              className={`px-5 py-4 text-left text-xs rounded-2xl transition-all font-black border-2 ${
                activeCase?.id === c.id 
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              <span className="block mb-1 opacity-50 text-[9px] uppercase tracking-tighter">Case Study</span>
              {c.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamControls;
