
import React, { useMemo } from 'react';
import { AnalysisResponse, ExamType } from '../types';

interface HumanModelProps {
  onRegionSelect: (region: string) => void;
  selectedRegion: string | null;
  highlightedRegion: string | null;
  activeLayer: string;
  analysis: AnalysisResponse | null;
}

const EXAM_STEPS = [
  { id: 'head', step: 'I', label: 'Mental / Pares Craneales', y: 40, color: '#f87171' },
  { id: 'arm', step: 'II', label: 'Motor MS / Reflejos', y: 140, color: '#fbbf24' },
  { id: 'torso', step: 'III', label: 'Sensibilidad / Dermatomas', y: 220, color: '#34d399' },
  { id: 'leg', step: 'IV', label: 'Motor MI / Coordinación', y: 320, color: '#60a5fa' },
  { id: 'foot', step: 'V', label: 'Marcha / Estación', y: 430, color: '#a78bfa' },
];

const HumanModel: React.FC<HumanModelProps> = ({ 
  onRegionSelect, 
  selectedRegion, 
  highlightedRegion,
  activeLayer, 
  analysis 
}) => {
  const activePathway = useMemo(() => {
    if (!analysis) return null;
    const content = analysis.content.toLowerCase();
    if (content.includes('corticoespinal') || content.includes('piramidal')) return 'motor';
    if (content.includes('espinotalámica') || content.includes('dolor')) return 'pain';
    if (content.includes('columnas posteriores') || content.includes('vibración')) return 'sensory';
    if (content.includes('cerebelo') || content.includes('ataxia')) return 'cerebellar';
    return null;
  }, [analysis]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative group select-none">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center">
        <div className="w-1 h-64 bg-slate-800 rounded-full relative overflow-hidden">
          <div className="absolute top-0 w-full bg-cyan-500 transition-all duration-1000" 
               style={{ height: selectedRegion ? '100%' : '20%' }} />
        </div>
      </div>

      <div className="relative h-full aspect-[3/5] max-h-[85vh] flex items-center">
        <svg 
          viewBox="0 0 250 500" 
          className="h-full w-full drop-shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-1000"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="nodeGlow">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <filter id="areaGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Silueta Humana Médica con Iluminación Reactiva */}
          <g strokeWidth="0.8">
            <path 
              d="M125,15 c-18,0 -30,12 -30,35 c0,18 12,30 30,30 s30,-12 30,-30 c0,-23 -12,-35 -30,-35" 
              className={`transition-all duration-500 ${highlightedRegion === 'head' ? 'fill-cyan-500/40 stroke-cyan-400' : 'fill-slate-900/80 stroke-slate-700/50'}`}
              filter={highlightedRegion === 'head' ? 'url(#areaGlow)' : ''}
            />
            <path 
              d="M95,80 l-12,12 v110 l12,18 h60 l12,-18 v-110 l-12,-12 z" 
              className={`transition-all duration-500 ${highlightedRegion === 'torso' ? 'fill-cyan-500/40 stroke-cyan-400' : 'fill-slate-900/80 stroke-slate-700/50'}`}
              filter={highlightedRegion === 'torso' ? 'url(#areaGlow)' : ''}
            />
            <path 
              d="M80,85 l-28,12 v90 l18,12 v-90 z" 
              className={`transition-all duration-500 ${highlightedRegion === 'arm' ? 'fill-cyan-500/40 stroke-cyan-400' : 'fill-slate-900/80 stroke-slate-700/50'}`}
              filter={highlightedRegion === 'arm' ? 'url(#areaGlow)' : ''}
            />
            <path 
              d="M170,85 l28,12 v90 l-18,12 v-90 z" 
              className={`transition-all duration-500 ${highlightedRegion === 'arm' ? 'fill-cyan-500/40 stroke-cyan-400' : 'fill-slate-900/80 stroke-slate-700/50'}`}
              filter={highlightedRegion === 'arm' ? 'url(#areaGlow)' : ''}
            />
            <path 
              d="M95,210 l-6,12 v160 l24,6 v-168 z" 
              className={`transition-all duration-500 ${highlightedRegion === 'leg' ? 'fill-cyan-500/40 stroke-cyan-400' : 'fill-slate-900/80 stroke-slate-700/50'}`}
              filter={highlightedRegion === 'leg' ? 'url(#areaGlow)' : ''}
            />
            <path 
              d="M155,210 l6,12 v160 l-24,6 v-168 z" 
              className={`transition-all duration-500 ${highlightedRegion === 'leg' ? 'fill-cyan-500/40 stroke-cyan-400' : 'fill-slate-900/80 stroke-slate-700/50'}`}
              filter={highlightedRegion === 'leg' ? 'url(#areaGlow)' : ''}
            />
          </g>

          {activePathway && (
            <g className="animate-in fade-in duration-500">
              <path 
                d={activePathway === 'motor' ? "M125,35 L125,430" : "M125,430 L125,35"} 
                stroke={activePathway === 'motor' ? '#818cf8' : '#22d3ee'}
                strokeWidth="2"
                strokeDasharray="10 5"
                fill="none"
                className="animate-[dash_1.5s_linear_infinite]"
              />
            </g>
          )}

          {EXAM_STEPS.map((step, i) => (
            <g 
              key={step.step} 
              className="cursor-pointer group/node" 
              onClick={() => onRegionSelect(step.id)}
            >
              <circle 
                cx="125" cy={step.y} r="6" 
                className={`transition-all duration-500 ${
                  selectedRegion === step.id || highlightedRegion === step.id ? 'fill-white' : 'fill-slate-700 group-hover/node:fill-cyan-400'
                }`}
              />
              <circle 
                cx="125" cy={step.y} r="12" 
                fill="url(#nodeGlow)" 
                className={`transition-opacity duration-500 ${selectedRegion === step.id || highlightedRegion === step.id ? 'opacity-100' : 'opacity-0'}`}
              />

              <g transform={`translate(145, ${step.y})`} className="opacity-60 group-hover/node:opacity-100 transition-opacity">
                <rect x="0" y="-8" width="100" height="16" rx="4" className="fill-slate-900/50 stroke-white/5" />
                <text x="8" y="3" className="text-[7px] font-black fill-white uppercase tracking-tighter">
                  {step.step}. {step.label}
                </text>
              </g>

              {i < EXAM_STEPS.length - 1 && (
                <line 
                  x1="125" y1={step.y + 6} 
                  x2="125" y2={EXAM_STEPS[i+1].y - 6} 
                  stroke="white" strokeWidth="0.5" strokeOpacity="0.1"
                />
              )}
            </g>
          ))}
        </svg>

        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -30; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default HumanModel;
