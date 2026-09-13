import React, { useState } from 'react';
import { RegionData, RiskLevel, NavigationTab } from '../types';
import { Language, TRANSLATIONS, getLocalizedRegionName, RUSSIAN_REGION_NAMES } from '../services/i18n';
import { 
  Search, 
  Filter, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Thermometer, 
  Clock, 
  Database,
  Building2,
  ChevronRight,
  X,
  Gauge,
  Zap,
  Truck,
  Factory,
  Sliders,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface RegionalIntelligenceViewProps {
  regions: RegionData[];
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  language: Language;
}

export const RegionalIntelligenceView: React.FC<RegionalIntelligenceViewProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  onNavigate,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'demand' | 'change' | 'utilization'>('demand');

  const t = TRANSLATIONS[language];
  const regionList = Array.isArray(regions) ? regions : [];
  const selectedRegion = regionList.find(r => r.id === selectedRegionId) || regionList[0];

  // Filtering & Sorting
  const filteredRegions = regionList
    .filter(r => {
      const russianName = RUSSIAN_REGION_NAMES[r.id] || '';
      const matchesSearch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.uzbekName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        russianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.districts.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRisk = riskFilter === 'all' || r.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'demand') return b.forecastDemandMcm - a.forecastDemandMcm;
      if (sortBy === 'change') return b.changePct - a.changePct;
      if (sortBy === 'utilization') return b.pipelineUtilizationPct - a.pipelineUtilizationPct;
      return 0;
    });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {language === 'uz' ? 'KRITIK YUKLAMA' : 'CRITICAL'}
          </span>
        );
      case 'elevated':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {language === 'uz' ? 'YUQORI YUKLAMA' : 'ELEVATED'}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {language === 'uz' ? 'BARQAROR' : 'OPTIMAL'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Filter & Search Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Risk Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setRiskFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              riskFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {t.filter_all}
          </button>
          <button
            onClick={() => setRiskFilter('critical')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              riskFilter === 'critical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700'
            }`}
          >
            {t.filter_critical}
          </button>
          <button
            onClick={() => setRiskFilter('elevated')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              riskFilter === 'elevated'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700'
            }`}
          >
            {t.filter_elevated}
          </button>
          <button
            onClick={() => setRiskFilter('optimal')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              riskFilter === 'optimal'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-700'
            }`}
          >
            {t.filter_optimal}
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono hidden sm:inline">{t.sort_by}</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="demand">{t.sort_demand}</option>
            <option value="change">{language === 'uz' ? 'O\'sish foizi' : 'Growth %'}</option>
            <option value="utilization">{t.sort_utilization}</option>
          </select>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Region Navigation List */}
        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredRegions.map((region) => {
            const isSelected = region.id === selectedRegionId;
            const isCritical = region.riskLevel === 'critical';

            return (
              <div
                key={region.id}
                onClick={() => onSelectRegion(region.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">
                        {getLocalizedRegionName(region, language)}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                        {region.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {region.capital} • {region.temperatureC}°C
                    </span>
                  </div>
                  {getRiskBadge(region.riskLevel)}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {language === 'uz' ? 'Prognoz' : language === 'ru' ? 'Прогноз' : 'Forecast'}: <strong className="text-cyan-300">{region.forecastDemandMcm} {t.mcm_day}</strong>
                  </span>
                  <span className={`font-semibold ${isCritical ? 'text-rose-400' : 'text-slate-300'}`}>
                    {region.pipelineUtilizationPct}% {language === 'uz' ? 'yuklama' : language === 'ru' ? 'загрузка' : 'load'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Selected Region Profile & District Feeders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100">
                    {getLocalizedRegionName(selectedRegion, language)}
                  </h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {selectedRegion.code}
                  </span>
                  {getRiskBadge(selectedRegion.riskLevel)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'uz' ? 'Ma\'muriy markaz' : language === 'ru' ? 'Административный центр' : 'Administrative Center'}: {selectedRegion.capital} • {selectedRegion.temperatureC}°C ({selectedRegion.tempAnomalyC > 0 ? `+${selectedRegion.tempAnomalyC}` : selectedRegion.tempAnomalyC}°C anomaly)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('forecast')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t.btn_forecast}</span>
                </button>

                <button
                  onClick={() => onNavigate('scenario')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.btn_simulate}</span>
                </button>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">{language === 'uz' ? 'Prognoz talab' : 'Forecast Demand'}</span>
                <span className="text-base font-bold text-cyan-300 mt-1 block">
                  {selectedRegion.forecastDemandMcm} <span className="text-xs font-normal text-slate-400">{t.mcm_day}</span>
                </span>
                <span className="text-[10px] text-rose-400 mt-0.5 block">+{selectedRegion.changePct}% vs baseline</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">{language === 'uz' ? 'Magistral quvvati' : 'Throughput Capacity'}</span>
                <span className="text-base font-bold text-slate-200 mt-1 block">
                  {selectedRegion.pipelineCapacityMcm} <span className="text-xs font-normal text-slate-400">{t.mcm_day}</span>
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{selectedRegion.pipelineUtilizationPct}% utilization</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">{language === 'uz' ? 'Eng tig\'iz vaqt' : 'Peak Window'}</span>
                <span className="text-xs font-bold text-amber-300 mt-1 block">
                  {selectedRegion.peakPeriod}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">{language === 'uz' ? 'Taqsimot tumanlari' : 'District Feeders'}</span>
                <span className="text-base font-bold text-slate-100 mt-1 block">
                  {selectedRegion.districts.length} <span className="text-xs text-slate-400">{language === 'uz' ? 'ta tuman' : 'feeders'}</span>
                </span>
              </div>
            </div>

            {/* Fuel Mix Profile */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300 font-mono block">
                {language === 'uz' ? 'Iste\'mol turlari bo\'yicha taqsimot (Fuel Mix):' : 'Sectoral Consumption Breakdown:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">🏠 {language === 'uz' ? 'Aholi va isitish' : 'Residential Heating'}</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{selectedRegion.fuelMix.residentialHeatingPct}%</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">⚡ {language === 'uz' ? 'IES (Elektr stansiyalari)' : 'Thermal Power (IES)'}</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{selectedRegion.fuelMix.thermalPowerGenPct}%</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">🏭 {language === 'uz' ? 'Sanoat korxonalari' : 'Industrial'}</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{selectedRegion.fuelMix.industrialPct}%</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">🚗 {language === 'uz' ? 'AGTKSH (Transport)' : 'CNG Transport'}</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{selectedRegion.fuelMix.cngTransportPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-District Distribution Nodes */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>{language === 'uz' ? 'Tumanlar va gaz taqsimlash shoxobchalari (GDS)' : 'District Feeder Loops & Distribution Status'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedRegion.districts.map((d) => {
                const isCrit = d.status === 'critical';
                const isElev = d.status === 'elevated';

                return (
                  <div
                    key={d.id}
                    className={`p-3.5 rounded-xl border space-y-2 ${
                      isCrit ? 'bg-rose-950/20 border-rose-800/50' : isElev ? 'bg-amber-950/20 border-amber-800/50' : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-slate-200 text-xs sm:text-sm block">
                          {d.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {d.customerCount.toLocaleString()} {language === 'uz' ? 'iste\'molchilar' : 'consumers'}
                        </span>
                      </div>
                      {getRiskBadge(d.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[9px] block uppercase">{language === 'uz' ? 'Prognoz talab' : 'Demand'}</span>
                        <span className="text-cyan-300 font-bold">{d.forecastDemandMcm} {t.mcm_day}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[9px] block uppercase">{language === 'uz' ? 'Quvur bosimi' : 'Pressure'}</span>
                        <span className={`font-bold ${d.pipelinePressureBar < 6.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {d.pipelinePressureBar} bar
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
