import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { EXPERIMENT_PRESETS, FLOW_THRESHOLDS } from '../constants';
import { CalculationResult } from '../types';
import { calculateFlowDynamics } from '../services/physicsService';

interface ChartSectionProps {
  currentData: CalculationResult;
}

const ChartSection: React.FC<ChartSectionProps> = ({ currentData }) => {
  // Generate curve data points
  const chartData = [];
  for (let vol = 50; vol <= 2000; vol += 50) {
    const dynamics = calculateFlowDynamics(vol, 22);
    chartData.push({
      velocity: dynamics.velocityV,
      reynolds: dynamics.reynoldsRe,
      name: vol
    });
  }

  // Create current point for the chart
  const currentPoint = [
    { velocity: currentData.velocityV, reynolds: currentData.reynoldsRe }
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Relación Velocidad vs. Número de Reynolds</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="velocity" 
              type="number" 
              domain={[0, 1.2]} 
              tickCount={10}
              label={{ value: 'Velocidad (m/s)', position: 'insideBottomRight', offset: -10 }} 
            />
            <YAxis 
              label={{ value: 'Reynolds (Re)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value: number) => value.toFixed(0)}
              labelFormatter={(label) => `V: ${Number(label).toFixed(3)} m/s`}
            />
            
            {/* Zones Background */}
            <ReferenceArea y1={0} y2={FLOW_THRESHOLDS.LAMINAR_LIMIT} fill="rgba(16, 185, 129, 0.1)" stroke="none" label={{ value: "Laminar", position: "insideTopLeft", fill: "#059669", fontSize: 12 }} />
            <ReferenceArea y1={FLOW_THRESHOLDS.LAMINAR_LIMIT} y2={FLOW_THRESHOLDS.TURBULENT_START} fill="rgba(245, 158, 11, 0.1)" stroke="none" label={{ value: "Transición", position: "insideTopLeft", fill: "#d97706", fontSize: 12 }} />
            <ReferenceArea y1={FLOW_THRESHOLDS.TURBULENT_START} y2={12000} fill="rgba(225, 29, 72, 0.1)" stroke="none" label={{ value: "Turbulento", position: "insideTopLeft", fill: "#be123c", fontSize: 12 }} />

            {/* Threshold Lines */}
            <ReferenceLine y={FLOW_THRESHOLDS.LAMINAR_LIMIT} stroke="#059669" strokeDasharray="3 3" />
            <ReferenceLine y={FLOW_THRESHOLDS.TURBULENT_START} stroke="#be123c" strokeDasharray="3 3" />

            {/* Main Trend Line */}
            <Line type="monotone" dataKey="reynolds" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={false} />

            {/* Current Position Indicator (Custom Dot) */}
            <Line 
              data={currentPoint} 
              dataKey="reynolds" 
              stroke="none"
              isAnimationActive={false}
              dot={{ r: 8, fill: '#1e293b', stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;