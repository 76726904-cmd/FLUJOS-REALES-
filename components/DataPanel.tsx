import React from 'react';
import { CalculationResult, FlowRegime } from '../types';
import { Droplets, Wind, Activity, Ruler } from 'lucide-react';

interface DataPanelProps {
  data: CalculationResult;
}

const DataPanel: React.FC<DataPanelProps> = ({ data }) => {
  const getRegimeColor = (regime: FlowRegime) => {
    switch(regime) {
      case FlowRegime.LAMINAR: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case FlowRegime.TRANSITION: return 'text-amber-600 bg-amber-50 border-amber-200';
      case FlowRegime.TURBULENT: return 'text-rose-600 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      
      {/* Reynolds Number Card */}
      <div className={`col-span-2 md:col-span-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center shadow-sm transition-colors ${getRegimeColor(data.regime)}`}>
        <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Número de Reynolds</div>
        <div className="text-3xl font-black">{data.reynoldsRe.toFixed(0)}</div>
        <div className="text-sm font-semibold mt-1">{data.regime}</div>
      </div>

      {/* Caudal (Flow Rate) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Droplets className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Caudal (Q)</span>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-800">{data.flowRateQ.toExponential(3)}</div>
          <div className="text-xs text-slate-400">m³/s</div>
        </div>
      </div>

      {/* Velocidad Media */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Wind className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Velocidad (V)</span>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-800">{data.velocityV.toFixed(3)}</div>
          <div className="text-xs text-slate-400">m/s</div>
        </div>
      </div>

      {/* Viscosidad */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Viscosidad (ν)</span>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-800">{data.viscosity.toExponential(3)}</div>
          <div className="text-xs text-slate-400">m²/s</div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;