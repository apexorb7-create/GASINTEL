import React, { useState } from 'react';
import { RegionData, NavigationTab } from '../types';
import { Language, TRANSLATIONS, getLocalizedRegionName } from '../services/i18n';
import { 
  Layers, 
  Flame, 
  Thermometer, 
  Gauge, 
  Info, 
  MapPin, 
  ChevronRight, 
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  TrendingUp,
  Building2,
  Check
} from 'lucide-react';

interface InteractiveMapViewProps {
  regions: RegionData[];
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  language: Language;
}

// Custom geographical SVG paths approximating administrative divisions of Uzbekistan
// ViewBox: 0 0 1000 650
const REGION_SVG_PATHS: Record<string, string> = {
  'uz-karakalpakstan': 'M 30,120 L 160,80 L 260,110 L 320,190 L 310,290 L 250,330 L 210,310 L 180,330 L 140,290 L 80,270 L 40,220 Z',
  'uz-navoi': 'M 320,190 L 420,170 L 510,210 L 550,290 L 500,340 L 460,320 L 410,360 L 380,310 L 310,290 Z',
  'uz-bukhara': 'M 310,290 L 380,310 L 410,360 L 460,320 L 470,390 L 430,440 L 360,450 L 320,380 Z',
  'uz-samarkand': 'M 460,320 L 500,340 L 550,330 L 580,390 L 540,430 L 480,430 L 470,390 Z',
  'uz-kashkadarya': 'M 470,390 L 540,430 L 560,470 L 540,540 L 460,520 L 430,440 Z',
  'uz-surkhandarya': 'M 540,430 L 580,390 L 630,450 L 610,580 L 540,540 L 560,470 Z',
  'uz-jizzakh': 'M 550,290 L 640,280 L 670,340 L 630,400 L 580,390 L 550,330 Z',
  'uz-tk-reg': 'M 640,280 L 730,230 L 780,270 L 750,350 L 670,340 Z',
  'uz-tk-city': 'M 710,270 L 735,265 L 740,285 L 715,290 Z',
  'uz-namangan': 'M 780,270 L 840,250 L 880,290 L 830,310 L 780,290 Z',
  'uz-fergana': 'M 780,290 L 830,310 L 870,360 L 800,390 L 750,350 Z',
  'uz-andijan': 'M 840,250 L 920,270 L 930,330 L 870,360 L 830,310 L 880,290 Z',
};

// Major natural gas pipeline corridors in Uzbekistan
const TRUNK_PIPELINES = [
  { id: 'trunk-gazli-tashkent', path: 'M 350,360 Q 520,340 725,278', label: 'Gazli-Tashkent Trunk Pipeline B' },
  { id: 'trunk-shurtan-samarkand', path: 'M 500,480 Q 510,410 510,380 T 650,310 T 725,278', label: 'Shurtan-Mubarek-Tashkent Trunk' },
  { id: 'trunk-cac-north', path: 'M 350,360 Q 240,260 120,150', label: 'Central Asia-Center (CAC) Corridor' },
  { id: 'trunk-fergana-spur', path: 'M 725,278 Q 765,300 810,320 T 870,310', label: 'Kamchik-Fergana High-Pressure Branch' },
  { id: 'trunk-south-surkhandarya', path: 'M 500,480 L 580,510', label: 'Kashkadarya-Surkhandarya Interconnector' }
];

// Major compressor stations & hubs
const COMPRESSOR_STATIONS = [
  { id: 'cs-gazli', name: 'Gazli Hub & UGS', x: 350, y: 360, capacity: '45 bcm/y' },
  { id: 'cs-mubarek', name: 'Mubarek Processing Hub', x: 485, y: 440, capacity: '30 bcm/y' },
  { id: 'cs-shurtan', name: 'Shurtan Gas Chemical', x: 500, y: 480, capacity: '20 bcm/y' },
  { id: 'cs-yangier', name: 'Yangier Transit Station', x: 650, y: 310, capacity: '25 bcm/y' },
  { id: 'cs-tashkent', name: 'Tashkent Metro Distribution', x: 725, y: 278, capacity: '28 bcm/y' },
  { id: 'cs-kuvasay', name: 'Kuvasay Valley Booster', x: 830, y: 340, capacity: '18 bcm/y' },
];

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  onNavigate,
  language,
}) => {
  const [mapMetric, setMapMetric] = useState<'demand' | 'utilization' | 'temperature'>('demand');
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [showPipelines, setShowPipelines] = useState<boolean>(true);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const t = TRANSLATIONS[language];
  const regionList = Array.isArray(regions) ? regions : [];
  const selectedRegion = regionList.find(r => r.id === selectedRegionId) || regionList[0];

  // Helper to calculate fill color based on selected metric
  const getRegionFillColor = (region: RegionData, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return '#06b6d4'; // Cyan highlight

    if (mapMetric === 'demand') {
      if (region.forecastDemandMcm > 26) return isHovered ? '#f43f5e' : '#e11d48';
      if (region.forecastDemandMcm > 20) return isHovered ? '#fb923c' : '#f97316';
      if (region.forecastDemandMcm > 16) return isHovered ? '#38bdf8' : '#0284c7';
      return isHovered ? '#22d3ee' : '#0ea5e9';
    }

    if (mapMetric === 'utilization') {
      if (region.pipelineUtilizationPct > 90) return isHovered ? '#f43f5e' : '#e11d48';
      if (region.pipelineUtilizationPct > 80) return isHovered ? '#fb923c' : '#f97316';
      if (region.pipelineUtilizationPct > 70) return isHovered ? '#22d3ee' : '#0284c7';
      return isHovered ? '#34d399' : '#059669';
    }

    // Temperature
    if (region.temperatureC < -4) return isHovered ? '#6366f1' : '#4f46e5';
    if (region.temperatureC < -1) return isHovered ? '#38bdf8' : '#0284c7';
    return isHovered ? '#34d399' : '#10b981';
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-6">
      {/* 1. Quick Jump Regions Pills Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-mono text-slate-400 shrink-0 font-medium mr-1">
            📍 {language === 'uz' ? 'Hududga o\'tish' : 'Quick Jump'}:
          </span>
          {regions.map(r => {
            const isSelected = r.id === selectedRegionId;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {getLocalizedRegionName(r, language)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Map Controls & Layer Toggles Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Metric Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setMapMetric('demand')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mapMetric === 'demand'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.map_metric_demand}</span>
          </button>
          <button
            onClick={() => setMapMetric('utilization')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mapMetric === 'utilization'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{t.map_metric_utilization}</span>
          </button>
          <button
            onClick={() => setMapMetric('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mapMetric === 'temperature'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>{t.map_metric_temperature}</span>
          </button>
        </div>

        {/* Layer Toggles & Zoom Toolbar */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => setShowPipelines(!showPipelines)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              showPipelines ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span>⚡ {t.layer_pipelines}</span>
          </button>

          <button
            onClick={() => setShowStations(!showStations)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              showStations ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span>⭘ {t.layer_compressor_stations}</span>
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              showLabels ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span>🏷️ {t.layer_labels}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title={t.map_zoom_in}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title={t.map_zoom_out}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title={t.map_reset_view}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Map Canvas & Inspector Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Map Canvas */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>
              {language === 'uz' ? 'O\'zbekiston Respublikasi tabiiy gaz infratuzilmasi xaritasi' : 'Republic of Uzbekistan Natural Gas Grid Topography'}
            </span>
            <span>Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
          </div>

          <div className="w-full h-[460px] flex items-center justify-center overflow-hidden bg-slate-950/60 rounded-lg border border-slate-800/80 relative">
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Flow animation gradient */}
                <linearGradient id="pipelinePulse" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Regions Polygonal Paths */}
              {regions.map((region) => {
                const path = REGION_SVG_PATHS[region.id];
                if (!path) return null;
                const isSelected = region.id === selectedRegionId;
                const isHovered = hoveredRegion?.id === region.id;
                const fillColor = getRegionFillColor(region, isHovered, isSelected);

                return (
                  <path
                    key={region.id}
                    d={path}
                    fill={fillColor}
                    stroke={isSelected ? '#38bdf8' : '#1e293b'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="cursor-pointer transition-colors duration-200"
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => onSelectRegion(region.id)}
                  />
                );
              })}

              {/* Trunk Pipelines */}
              {showPipelines && TRUNK_PIPELINES.map((pipe) => (
                <g key={pipe.id}>
                  <path
                    d={pipe.path}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                    className="opacity-80"
                  />
                </g>
              ))}

              {/* Compressor Stations & Hubs */}
              {showStations && COMPRESSOR_STATIONS.map((cs) => (
                <g key={cs.id} className="cursor-pointer">
                  <circle
                    cx={cs.x}
                    cy={cs.y}
                    r="6"
                    fill="#0f172a"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={cs.x}
                    cy={cs.y}
                    r="2.5"
                    fill="#38bdf8"
                  />
                  <text
                    x={cs.x + 9}
                    y={cs.y + 4}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {cs.name}
                  </text>
                </g>
              ))}

              {/* Region Labels */}
              {showLabels && regions.map((region) => {
                const path = REGION_SVG_PATHS[region.id];
                if (!path) return null;
                const coord = region.coordinates;
                const svgX = (coord.x / 100) * 1000;
                const svgY = (coord.y / 100) * 650;
                const displayName = getLocalizedRegionName(region, language);

                return (
                  <g key={`label-${region.id}`} className="pointer-events-none">
                    <text
                      x={svgX}
                      y={svgY}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="drop-shadow"
                    >
                      {displayName}
                    </text>
                    <text
                      x={svgX}
                      y={svgY + 13}
                      fill="#cbd5e1"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {mapMetric === 'demand' 
                        ? `${region.forecastDemandMcm} ${t.mcm_day}` 
                        : mapMetric === 'utilization'
                        ? `${region.pipelineUtilizationPct}%`
                        : `${region.temperatureC}°C`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span>{language === 'uz' ? 'Shkala' : 'Scale'}:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-500"></span>
                <span>{language === 'uz' ? 'Optimal / Standart' : 'Low / Stable'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500"></span>
                <span>{language === 'uz' ? 'Yuqori yuklama' : 'Elevated'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500"></span>
                <span>{language === 'uz' ? 'Kritik cho\'qqi' : 'Critical'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-amber-400"></span>
              <span>{language === 'uz' ? 'Magistral quvur' : 'Trunkline'}</span>
            </div>
          </div>
        </div>

        {/* Selected Region Detailed Inspector Card */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">{t.selected_geographic_node}</span>
                <h3 className="text-base font-bold text-slate-100">
                  {getLocalizedRegionName(selectedRegion, language)}
                </h3>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3 my-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">{language === 'uz' ? 'Prognoz gaz talabi' : 'Forecast Demand'}</span>
                <span className="text-cyan-300 font-bold text-base">
                  {selectedRegion.forecastDemandMcm} <span className="text-xs font-normal text-slate-400">{t.mcm_day}</span>
                </span>
                <span className="text-[10px] text-rose-400 block mt-0.5">
                  +{selectedRegion.changePct}% {t.vs_baseline}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">{language === 'uz' ? 'Quvur zaxirasi yuklamasi' : 'Linepack Utilization'}</span>
                <span className={`text-base font-bold ${selectedRegion.pipelineUtilizationPct > 90 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {selectedRegion.pipelineUtilizationPct}%
                </span>
                <div className="w-full h-1.5 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${selectedRegion.pipelineUtilizationPct > 90 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                    style={{ width: `${selectedRegion.pipelineUtilizationPct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">{language === 'uz' ? 'Harorat' : 'Temperature'}</span>
                  <span className="text-amber-300 font-bold">{selectedRegion.temperatureC}°C</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">{language === 'uz' ? 'Tumanlar' : 'Districts'}</span>
                  <span className="text-slate-200 font-bold">{selectedRegion.districts.length} ta</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">{language === 'uz' ? 'Eng tig\'iz vaqt' : 'Peak Window'}</span>
                <span className="text-amber-300 font-semibold text-xs">
                  {selectedRegion.peakPeriod}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('forecast')}
              className="w-full py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'uz' ? 'Talab prognozini ko\'rish' : 'View Detailed Forecast'}</span>
            </button>

            <button
              onClick={() => onNavigate('scenario')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'uz' ? 'Ssenariyda sinab ko\'rish' : 'Simulate Scenarios'}</span>
            </button>

            <button
              onClick={() => onNavigate('regions')}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'uz' ? 'Tumanlar va iste\'molchilar' : 'District Breakdown'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
