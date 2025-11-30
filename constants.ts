import { ExperimentPreset } from './types';

// Constants from the lab report
export const PIPE_DIAMETER_MM = 8;
export const PIPE_DIAMETER_M = 0.008;
export const COLLECTION_TIME_S = 30;
export const DEFAULT_TEMP_C = 22;

// Viscosity at 22C from report: 9.596 * 10^-7
// We will use a simplified formula for other temps, but anchor to the report value.
export const REPORT_VISCOSITY_22C = 9.596e-7;

export const FLOW_THRESHOLDS = {
  LAMINAR_LIMIT: 2000,
  TURBULENT_START: 4000,
};

export const EXPERIMENT_PRESETS: ExperimentPreset[] = [
  { id: 1, name: "Prueba 1", volumeMl: 120.6, description: "Línea de tinta recta y estable." },
  { id: 2, name: "Prueba 2", volumeMl: 301.6, description: "Línea clara, ligera difusión al final." },
  { id: 3, name: "Prueba 3", volumeMl: 392.1, description: "Trazador comienza a ondular (Transición)." },
  { id: 4, name: "Prueba 4", volumeMl: 603.2, description: "Ondulaciones fuertes y mezcla parcial." },
  { id: 5, name: "Prueba 5", volumeMl: 829.4, description: "Dispersión rápida, mezcla completa." },
  { id: 6, name: "Prueba 6", volumeMl: 1658.8, description: "Tinta se disipa instantáneamente (Turbulento Pleno)." },
];