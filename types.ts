export enum FlowRegime {
  LAMINAR = 'Laminar',
  TRANSITION = 'Transición',
  TURBULENT = 'Turbulento',
}

export interface SimulationParams {
  volumeCollectedMl: number; // Volume collected in 30 seconds
  temperatureC: number;
}

export interface CalculationResult {
  volumeM3: number;
  flowRateQ: number; // m3/s
  velocityV: number; // m/s
  reynoldsRe: number;
  regime: FlowRegime;
  viscosity: number;
}

export interface ExperimentPreset {
  id: number;
  name: string;
  volumeMl: number;
  description: string;
}