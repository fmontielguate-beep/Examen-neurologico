
import React, { useState } from 'react';
import { AnatomicalLayer, ClinicalTest, ClinicalCase, AnalysisResponse } from './types';
import { CLINICAL_TESTS } from './constants';
import { analyzeClinicalFinding, searchClinicalKnowledge } from './services/geminiService';
import HumanModel from './components/HumanModel';
import ExamControls from './components/ExamControls';
import DetailPanel from './components/DetailPanel';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [highlightedRegion, setHighlightedRegion] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<AnatomicalLayer>(AnatomicalLayer.Skin);
  const [activeCase, setActiveCase] = useState<ClinicalCase | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const availableTests = CLINICAL_TESTS.filter(test => test.region === selectedRegion);

  const resetToHome = () => {
    setSelectedRegion(null);
    setHighlightedRegion(null);
    setActiveCase(null);
    setAnalysis(null);
    setFeedback(null);
    setActiveLayer(AnatomicalLayer.Skin);
  };

  const handleTestSelection = async (test: ClinicalTest) => {
    setSelectedRegion(null); 
    setLoading(true);
    setFeedback(null);
    
    if (activeCase) {
      if (test.id === activeCase.correctTestId) {
        setFeedback("✅ ¡Deducción correcta!");
      } else {
        setFeedback("❌ Considera otra vía anatómica.");
      }
    }

    const result = await analyzeClinicalFinding(test.name, test.region, test.type);
    setAnalysis(result);
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setFeedback(null);
    setSelectedRegion(null);
    const result = await searchClinicalKnowledge(query);
    setAnalysis(result);
    setLoading(false);
  };

  const handleCaseSelection = (c: ClinicalCase | null) => {
    setActiveCase(c);
    setAnalysis(null);
    setFeedback(null);
    setSelectedRegion(null);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100 selection:bg-cyan-500/30">
      <aside className="w-80 flex-shrink-0 flex flex-col bg-slate-900 border-r border-white/5 z-30 shadow-[10px_0_40px_rgba(0,0,0,0.8)]">
        <div 
          className="h-24 flex items-center px-8 cursor-pointer hover:bg-slate-800/50 transition-all group border-b border-white/5"
          onClick={resetToHome}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)] group-hover:rotate-12 transition-all duration-500">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic">NEURO<span className="text-cyan-400">SCAN</span></h1>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ExamControls 
            activeLayer={activeLayer} 
            setActiveLayer={setActiveLayer}
            activeCase={activeCase}
            onCaseSelect={handleCaseSelection}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full"></div>

        <header className="h-20 bg-slate-900/60 backdrop-blur-3xl border-b border-white/10 px-10 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-10">
            {(activeCase || selectedRegion || analysis) && (
              <button 
                onClick={resetToHome}
                className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-2xl text-xs font-black transition-all border border-white/10 shadow-2xl group uppercase tracking-widest"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Inicio
              </button>
            )}
            
            <div className="flex flex-col">
              {activeCase ? (
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-[10px] font-black text-emerald-400 border border-emerald-500/30 uppercase tracking-[0.2em]">Paciente Crítico</div>
                  <h2 className="text-xl font-black text-white tracking-tight">{activeCase.title}</h2>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-[10px] font-black text-cyan-400 border border-cyan-500/30 uppercase tracking-[0.2em]">Análisis Bio-Funcional</div>
                  <h2 className="text-xl font-black text-white tracking-tight">Estación de Mapeo</h2>
                </div>
              )}
            </div>
          </div>
          
          {feedback && (
            <div className={`px-8 py-3.5 rounded-2xl text-sm font-black shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in slide-in-from-top-6 duration-500 border-2 ${feedback.includes('✅') ? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-rose-500 border-rose-300 text-white'}`}>
              {feedback}
            </div>
          )}
        </header>

        <div className="flex-1 flex p-10 gap-10 overflow-hidden z-10 relative">
          <div className="flex-[0.75] flex flex-col gap-8 h-full">
            {activeCase && (
              <div className="bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in slide-in-from-left-12 duration-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Cuadro Clínico</h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-semibold italic">
                  "{activeCase.patientProfile}"
                </p>
                <div className="mt-3 text-[11px] text-white/50 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-6 h-px bg-white/20"></span>
                  Localizar: {activeCase.findings}
                </div>
              </div>
            )}
            
            <div className="flex-1 relative flex items-center justify-center min-h-0">
               <HumanModel 
                selectedRegion={selectedRegion} 
                highlightedRegion={highlightedRegion}
                onRegionSelect={setSelectedRegion} 
                activeLayer={activeLayer}
                analysis={analysis}
              />
            </div>
          </div>

          <div className="flex-[1.25] flex flex-col min-w-[450px]">
            <DetailPanel 
              analysis={analysis} 
              loading={loading} 
              onStructureHover={setHighlightedRegion} 
            />
          </div>

          {selectedRegion && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-10">
              <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={() => setSelectedRegion(null)}
              ></div>
              
              <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] p-12 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                      Protocolo de <span className="text-cyan-400">{selectedRegion}</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase">Selecciona el examen a realizar</p>
                  </div>
                  <button 
                    onClick={() => setSelectedRegion(null)}
                    className="p-4 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {availableTests.length > 0 ? (
                    availableTests.map((test) => (
                      <button
                        key={test.id}
                        onClick={() => handleTestSelection(test)}
                        className="p-8 bg-slate-800 hover:bg-cyan-600 border border-white/5 hover:border-cyan-300 rounded-[2.5rem] transition-all duration-300 group/btn shadow-2xl flex flex-col items-start gap-4 text-left"
                      >
                        <div className="p-3 bg-white/5 rounded-2xl group-hover/btn:bg-white/20 transition-colors">
                          <svg className="w-6 h-6 text-cyan-400 group-hover/btn:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="block text-lg font-black text-white tracking-tight group-hover/btn:translate-x-1 transition-transform">{test.name}</span>
                          <span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest group-hover/btn:text-cyan-100">{test.type}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2 py-20 text-center space-y-4">
                      <div className="text-6xl">🔍</div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest italic">No se encontraron protocolos específicos para esta región.</p>
                      <button 
                        onClick={() => setSelectedRegion(null)}
                        className="px-6 py-2 bg-slate-800 text-xs font-black rounded-xl hover:bg-slate-700"
                      >
                        Cerrar Buscador
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
