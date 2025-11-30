import { CalculationResult, FlowRegime } from '../types';
import { 
  PIPE_DIAMETER_M, 
  COLLECTION_TIME_S, 
  FLOW_THRESHOLDS,
  REPORT_VISCOSITY_22C 
} from '../constants';

// Calculate Kinematic Viscosity (m^2/s) based on Temperature (C)
// Using an approximation formula, but anchoring close to report's 22C value
export const calculateViscosity = (tempC: number): number => {
  if (tempC === 22) return REPORT_VISCOSITY_22C;
  
  // Poiseuille's formula approximation for water
  // v = 1.78 * 10^-6 / (1 + 0.0337T + 0.000221T^2)
  const numerator = 1.78e-6;
  const denominator = 1 + 0.0337 * tempC + 0.000221 * Math.pow(tempC, 2);
  return numerator / denominator;
};

export const calculateFlowDynamics = (volumeMl: number, tempC: number): CalculationResult => {
  // 1. Convert Volume mL to m3
  const volumeM3 = volumeMl * 1e-6;

  // 2. Calculate Flow Rate (Q) = Vol / t
  const flowRateQ = volumeM3 / COLLECTION_TIME_S;

  // 3. Calculate Area (A) = pi * (D/2)^2
  const radius = PIPE_DIAMETER_M / 2;
  const area = Math.PI * Math.pow(radius, 2);

  // 4. Calculate Velocity (V) = Q / A
  const velocityV = flowRateQ / area;

  // 5. Get Viscosity (v)
  const viscosity = calculateViscosity(tempC);

  // 6. Calculate Reynolds (Re) = (V * D) / v
  const reynoldsRe = (velocityV * PIPE_DIAMETER_M) / viscosity;

  // 7. Determine Regime
  let regime = FlowRegime.LAMINAR;
  if (reynoldsRe >= FLOW_THRESHOLDS.LAMINAR_LIMIT && reynoldsRe < FLOW_THRESHOLDS.TURBULENT_START) {
    regime = FlowRegime.TRANSITION;
  } else if (reynoldsRe >= FLOW_THRESHOLDS.TURBULENT_START) {
    regime = FlowRegime.TURBULENT;
  }

  return {
    volumeM3,
    flowRateQ,
    velocityV,
    reynoldsRe,
    regime,
    viscosity
  };
};