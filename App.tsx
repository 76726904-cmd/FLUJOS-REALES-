import React, { useState, useEffect } from 'react';
import PipeSimulation from './components/PipeSimulation';
import DataPanel from './components/DataPanel';
import ChartSection from './components/ChartSection';
import { calculateFlowDynamics } from './services/physicsService';
import { EXPERIMENT_PRESETS, DEFAULT_TEMP_C, COLLECTION_TIME_S } from './constants';
import { CalculationResult, FlowRegime } from './types';
import { FlaskConical, Settings, Info, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [volumeCollected, setVolumeCollected] = useState<number>(120); // mL
  const [temperature, setTemperature] = useState<number>(DEFAULT_TEMP_C);
  const [physicsData, setPhysicsData] = useState<CalculationResult | null>(null);

  // Initial Calculation & Updates
  useEffect(() => {
    const data = calculateFlowDynamics(volumeCollected, temperature);
    setPhysicsData(data);
  }, [volumeCollected, temperature]);

  if (!physicsData) return <div className="min-h-screen flex items-center justify-center">Cargando simulador...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <FlaskConical size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Simulador de Reynolds</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Laboratorio de Mecánica de Fluidos</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded text-slate-600 border border-slate-200">
               T = {temperature}°C
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Section: Visualization & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Controls & Context */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Control Panel */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-bold text-slate-800">Controles del Experimento</h2>
              </div>
              
              {/* Volume Slider */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <label htmlFor="volume" className="text-sm font-medium text-slate-700">
                    Volumen Recogido (30s)
                  </label>
                  <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {volumeCollected.toFixed(1)} mL
                  </span>
                </div>
                <input
                  type="range"
                  id="volume"
                  min="50"
                  max="2000"
                  step="10"
                  value={volumeCollected}
                  onChange={(e) => setVolumeCollected(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-xs text-slate-500">
                  Controla la apertura de la válvula de salida, aumentando el caudal.
                </p>
              </div>

              {/* Presets */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Casos de Estudio</span>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIMENT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setVolumeCollected(preset.volumeMl)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        Math.abs(volumeCollected - preset.volumeMl) < 5
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-600 italic">
                  {EXPERIMENT_PRESETS.find(p => Math.abs(volumeCollected - p.volumeMl) < 5)?.description || "Ajuste manual del caudal..."}
                </div>
              </div>
            </div>

            {/* Theory Box */}
            <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-indigo-300" />
                    <h3 className="font-bold">Marco Teórico</h3>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                  El número de Reynolds (Re) es adimensional y predice el régimen de flujo:
                </p>
                <div className="font-mono bg-indigo-950/50 p-3 rounded text-sm mb-4 border border-indigo-700">
                  Re = (V · D) / ν
                </div>
                <ul className="text-xs space-y-2 text-indigo-200">
                  <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Re &lt; 2000: Laminar</li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div> 2000 &lt; Re &lt; 4000: Transición</li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Re &gt; 4000: Turbulento</li>
                </ul>
               </div>
               {/* Decorative background circle */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full opacity-20 blur-2xl"></div>
            </div>

          </div>

          {/* Right: Simulation & Results */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Simulation Canvas */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  Visualización de Flujo
                </h2>
                <div className="text-xs text-slate-400">Tubo: {8}mm diam.</div>
              </div>
              <div className="p-4">
                <PipeSimulation 
                  reynolds={physicsData.reynoldsRe} 
                  velocity={physicsData.velocityV}
                  regime={physicsData.regime}
                />
                <div className="mt-4 flex justify-between text-xs text-slate-500">
                  <span>Inyector de Tinta</span>
                  <span>Flujo de Agua &rarr;</span>
                </div>
              </div>
            </div>

            {/* Numerical Data */}
            <DataPanel data={physicsData} />

            {/* Charts */}
            <ChartSection currentData={physicsData} />

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;