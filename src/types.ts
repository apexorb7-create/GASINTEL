export type RiskLevel = 'optimal' | 'normal' | 'elevated' | 'critical';

export interface DistrictInfo {
  id: string;
  name: string;
  currentDemandMcm: number;
  forecastDemandMcm: number;
  customerCount: number;
  pipelinePressureBar: number;
  status: RiskLevel;
}

export interface RegionData {
  id: string;
  name: string;
  uzbekName: string;
  code: string;
  capital: string;
  coordinates: { x: number; y: number }; // SVG map percentage coordinates
  mapPathId: string;
  baseConsumptionMcm: number; // Million cubic meters / day baseline
  currentDemandMcm: number;
  forecastDemandMcm: number;
  changePct: number;
  peakPeriod: string;
  pipelineCapacityMcm: number;
  pipelineUtilizationPct: number;
  riskLevel: RiskLevel;
  dataCompletenessPct: number;
  lastUpdated: string;
  temperatureC: number;
  tempAnomalyC: number;
  populationIndex: number;
  economicActivityIndex: number;
  fuelMix: {
    residentialHeatingPct: number;
    thermalPowerGenPct: number;
    industrialPct: number;
    cngTransportPct: number;
  };
  districts: DistrictInfo[];
}

export interface HourlyForecastPoint {
  timestamp: string;
  hourStr: string;
  hour: number;
  historicalMcm: number | null;
  forecastMcm: number;
  lowerBoundMcm: number;
  upperBoundMcm: number;
  temperatureC: number;
  isPeak: boolean;
  isHistorical: boolean;
  heatingDegreeDay: number;
}

export interface DailyForecastPoint {
  date: string;
  dateStr: string;
  dayName: string;
  historicalMcm: number | null;
  forecastMcm: number;
  lowerBoundMcm: number;
  upperBoundMcm: number;
  avgTempC: number;
  minTempC: number;
  maxTempC: number;
  isHoliday: boolean;
  demandIndex: number;
}

export interface AlertItem {
  id: string;
  regionId: string;
  regionName: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  description: string;
  timestamp: string;
  projectedDeficitMcm: number;
  triggerReason: string;
  recommendedAction: string;
  status: 'active' | 'acknowledged';
}

export interface ScenarioParameters {
  temperatureDeltaC: number; // e.g. -15 to +10
  seasonalMultiplier: number; // e.g. 0.8 to 1.5
  industrialActivityPct: number; // e.g. 80 to 130%
  populationGrowthPct: number; // e.g. -5% to +15%
  pipelineCapacityConstraintPct: number; // 0% to 30% reduction
}

export interface ForecastMetrics {
  mape: number; // Mean Absolute Percentage Error (%)
  rmse: number; // Root Mean Square Error (mcm)
  r2: number; // Coefficient of determination
  peakDemandMcm: number;
  peakDemandTime: string;
  baselineDemandMcm: number;
  totalForecast24hMcm: number;
  totalForecast7dMcm: number;
  confidenceScorePct: number;
}

export type NavigationTab = 
  | 'overview'
  | 'forecast'
  | 'regions'
  | 'map'
  | 'scenario'
  | 'methodology';
