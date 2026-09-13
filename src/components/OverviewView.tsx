import React, { useState } from 'react';
import { RegionData, AlertItem, HourlyForecastPoint, ForecastMetrics, NavigationTab, RiskLevel } from '../types';
import { Language, TRANSLATIONS, getLocalizedRegionName, RUSSIAN_REGION_NAMES } from '../services/i18n';
import { 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Gauge, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  ChevronRight, 
  BarChart3,
  Sliders,
  MapPin,
  Maximize2,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  Check,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Legend
} from 'recharts';

interface OverviewViewProps {
  regions: RegionData[];
  alerts: AlertItem[];
  hourlyPoints: HourlyForecastPoint[];
  metrics: ForecastMetrics;
  onNavigate: (tab: NavigationTab) => void;
  onSelectRegion: (regionId: string) => void;
  onSelectAlert: (alert: AlertItem) => void;
  onAcknowledgeAllAlerts?: () => void;
  language: Language;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  regions,
  alerts,
  hourlyPoints,
  metrics,
  onNavigate,
  onSelectRegion,
  onSelectAlert,
  onAcknowledgeAllAlerts,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [sortBy, setSortBy] = useState<'demand' | 'utilization' | 'temp' | 'name'>('demand');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<'all' | 'critical' | 'high'>('all');

  const t = TRANSLATIONS[language];

  // Aggregate stats
  const totalCurrentDemand = regions.reduce((sum, r) => sum + r.currentDemandMcm, 0);
  const totalForecastDemand = regions.reduce((sum, r) => sum + r.forecastDemandMcm, 0);
  const totalCapacity = regions.reduce((sum, r) => sum + r.pipelineCapacityMcm, 0);
  const aggregateUtilization = ((totalForecastDemand / totalCapacity) * 100).toFixed(1);
  const criticalCount = regions.filter(r => r.riskLevel === 'critical').length;
  const elevatedCount = regions.filter(r => r.riskLevel === 'elevated').length;
  const optimalCount = regions.filter(r => r.riskLevel === 'optimal' || r.riskLevel === 'normal').length;
  const overallChangePct = (((totalForecastDemand - totalCurrentDemand) / totalCurrentDemand) * 100).toFixed(1);

  // Filtered & Sorted Regions
  const filteredRegions = regions
    .filter(r => {
      const russianName = RUSSIAN_REGION_NAMES[r.id] || '';
      const nameMatch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.uzbekName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        russianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase());
      const riskMatch = riskFilter === 'all' 
        ? true 
        : riskFilter === 'optimal' 
          ? (r.riskLevel === 'optimal' || r.riskLevel === 'normal')
          : r.riskLevel === riskFilter;
      return nameMatch && riskMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'demand') return b.forecastDemandMcm - a.forecastDemandMcm;
      if (sortBy === 'utilization') return b.pipelineUtilizationPct - a.pipelineUtilizationPct;
      if (sortBy === 'temp') return a.temperatureC - b.temperatureC; // Coldest first
      if (sortBy === 'name') {
        const nameA = getLocalizedRegionName(a, language);
        const nameB = getLocalizedRegionName(b, language);
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  // Filter hourly points for chart display
  const chartData = hourlyPoints.map((p) => ({
    time: p.hourStr,
    actual: p.historicalMcm,
    forecast: p.forecastMcm,
    lower: p.lowerBoundMcm,
    upper: p.upperBoundMcm,
    temp: p.temperatureC,
    isPeak: p.isPeak,
  }));

  // Filtered Alerts
  const filteredAlerts = alerts.filter(a => {
    if (alertSeverityFilter === 'all') return true;
    return a.severity === alertSeverityFilter;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
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
            {language === 'uz' ? 'BARQAROR' : 'NOMINAL'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Forecast Demand */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{t.kpi_total_forecast}</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {totalForecastDemand.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">{t.mcm_day}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-rose-400 font-semibold font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{overallChangePct}%
            </span>
            <span className="text-slate-400">{t.vs_baseline}</span>
          </div>
        </div>

        {/* Current Estimated Demand */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{t.kpi_current_load}</span>
            <Gauge className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {totalCurrentDemand.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">{t.mcm_day}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t.linepack_utilization}: <strong className="text-slate-200">{aggregateUtilization}%</strong></span>
          </div>
        </div>

        {/* Peak Demand Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{t.kpi_peak_window}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-300">
              19:00 - 21:30
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>{language === 'uz' ? 'Maksimal oqim' : 'Max flow rate'}: <strong>3.94 {t.mcm_hour}</strong></span>
          </div>
        </div>

        {/* High Demand Regions Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{t.kpi_stressed_nodes}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {criticalCount + elevatedCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 12 {language === 'uz' ? 'hudud' : 'regions'}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>{criticalCount} {t.critical_nodes}</span>
          </div>
        </div>

        {/* System Confidence / MAPE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{t.kpi_confidence}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.confidenceScorePct}%
            </span>
            <span className="text-xs text-emerald-500 font-mono">R²: {metrics.r2}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            <span>{t.historical_mape}: <strong className="text-slate-300">{metrics.mape}%</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Diurnal Load Curve Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">
                {language === 'uz' ? "O'zbekiston bo'yicha 24 soatlik tabiiy gaz iste'moli egri chizig'i" : "Uzbekistan Aggregate 24-Hour Diurnal Gas Demand Curve"}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'uz' ? "Tarixiy va kutilayotgan soatlik talab (95% ishonchlilik oralig'i bilan)" : "Historical vs projected hourly load with ±1.96σ statistical uncertainty bands"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('forecast')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>{t.btn_forecast}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickMargin={8} />
              <YAxis stroke="#64748b" fontSize={11} unit={` ${t.mcm_hour.split('/')[0]}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
                formatter={(val: any, name: any) => {
                  if (name === 'forecast') return [`${val} ${t.mcm_hour}`, language === 'uz' ? 'Prognoz talab' : 'Forecast'];
                  if (name === 'actual') return [`${val ? val + ' ' + t.mcm_hour : '-'}`, language === 'uz' ? 'Haqiqiy iste\'mol' : 'Historical Load'];
                  return [val, name];
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
              <ReferenceLine x="19:00" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: language === 'uz' ? 'Tig\'iz vaqt (19:00)' : 'Peak Hour', fill: '#f59e0b', fontSize: 10 }} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confidenceArea)" name={language === 'uz' ? 'Ishonchlilik oralig\'i' : 'Confidence Band'} />
              <Area type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={2.5} fill="url(#forecastArea)" name={language === 'uz' ? 'Prognoz talab' : 'Forecast Demand'} />
              <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="none" strokeDasharray="4 4" name={language === 'uz' ? 'O\'tgan davr (Fakt)' : 'Historical Actual'} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Convenient Controls Bar for Regional Gas Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
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

          {/* Risk Level Filter Pill Buttons */}
          <div className="flex items-center flex-wrap gap-1.5">
            <button
              onClick={() => setRiskFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                riskFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {t.filter_all} ({regions.length})
            </button>
            <button
              onClick={() => setRiskFilter('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                riskFilter === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-rose-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              ⚠️ {t.filter_critical} ({criticalCount})
            </button>
            <button
              onClick={() => setRiskFilter('elevated')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                riskFilter === 'elevated'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              ⚡ {t.filter_elevated} ({elevatedCount})
            </button>
            <button
              onClick={() => setRiskFilter('optimal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                riskFilter === 'optimal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              ✓ {t.filter_optimal} ({optimalCount})
            </button>
          </div>

          {/* Sorting & Layout Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="demand">{t.sort_demand}</option>
                <option value="utilization">{t.sort_utilization}</option>
                <option value="temp">{t.sort_temp}</option>
                <option value="name">{t.sort_name}</option>
              </select>
            </div>

            <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title={t.view_grid}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title={t.view_table}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Regional Gas Intelligence: Grid or Table Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegions.map((region) => {
            const isCritical = region.riskLevel === 'critical';
            const isElevated = region.riskLevel === 'elevated';

            return (
              <div
                key={region.id}
                className={`bg-slate-900 border rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all hover:border-slate-700 ${
                  isCritical ? 'border-rose-800/60 bg-rose-950/10' : isElevated ? 'border-amber-800/40' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">
                          {getLocalizedRegionName(region, language)}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {region.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {language === 'uz' ? 'Markaz' : language === 'ru' ? 'Центр' : 'Hub'}: {region.capital} • {region.temperatureC}°C ({region.tempAnomalyC > 0 ? `+${region.tempAnomalyC}` : region.tempAnomalyC}°C)
                      </span>
                    </div>
                    {getRiskBadge(region.riskLevel)}
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-400 text-[10px] block uppercase">
                        {language === 'uz' ? 'Prognoz talab' : 'Forecast Demand'}
                      </span>
                      <span className="text-cyan-300 font-bold text-sm">
                        {region.forecastDemandMcm} <span className="text-[10px] font-normal text-slate-400">{t.mcm_day}</span>
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-400 text-[10px] block uppercase">
                        {language === 'uz' ? 'Quvur quvvati' : 'Capacity'}
                      </span>
                      <span className="text-slate-200 font-bold text-sm">
                        {region.pipelineCapacityMcm} <span className="text-[10px] font-normal text-slate-400">{t.mcm_day}</span>
                      </span>
                    </div>
                  </div>

                  {/* Linepack Utilization Progress Bar */}
                  <div className="space-y-1 my-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{t.linepack_utilization}:</span>
                      <span className={`font-bold ${isCritical ? 'text-rose-400' : isElevated ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {region.pipelineUtilizationPct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          region.pipelineUtilizationPct > 90 ? 'bg-rose-500' : region.pipelineUtilizationPct > 80 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(region.pipelineUtilizationPct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Convenient Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => {
                      onSelectRegion(region.id);
                      onNavigate('forecast');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    {t.btn_forecast}
                  </button>

                  <button
                    onClick={() => {
                      onSelectRegion(region.id);
                      onNavigate('map');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium text-center transition-colors cursor-pointer"
                  >
                    {t.btn_map}
                  </button>

                  <button
                    onClick={() => {
                      onSelectRegion(region.id);
                      onNavigate('regions');
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    title={t.btn_details}
                  >
                    {t.btn_details}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 uppercase font-mono text-[11px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">{language === 'uz' ? 'Hudud nomi' : language === 'ru' ? 'Регион' : 'Region Name'}</th>
                  <th className="py-3 px-4">{language === 'uz' ? 'Joriy talab' : language === 'ru' ? 'Текущий спрос' : 'Current Demand'}</th>
                  <th className="py-3 px-4">{language === 'uz' ? '24s Prognoz' : language === 'ru' ? 'Прогноз 24ч' : '24h Forecast'}</th>
                  <th className="py-3 px-4">{language === 'uz' ? 'O\'zgarish' : language === 'ru' ? 'Динамика' : 'Change'}</th>
                  <th className="py-3 px-4">{language === 'uz' ? 'Quvvat' : language === 'ru' ? 'Мощность' : 'Capacity'}</th>
                  <th className="py-3 px-4">{language === 'uz' ? 'Yuklama' : language === 'ru' ? 'Загрузка %' : 'Load %'}</th>
                  <th className="py-3 px-4">{language === 'uz' ? 'Harorat' : language === 'ru' ? 'Температура' : 'Temp'}</th>
                  <th className="py-3 px-4">{language === 'uz' ? 'Holat' : language === 'ru' ? 'Статус' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{language === 'uz' ? 'Amallar' : language === 'ru' ? 'Действия' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {filteredRegions.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {getLocalizedRegionName(r, language)} <span className="text-slate-400 text-[10px]">[{r.code}]</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{r.currentDemandMcm} {t.mcm_day}</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{r.forecastDemandMcm} {t.mcm_day}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${r.changePct >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        +{r.changePct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{r.pipelineCapacityMcm} {t.mcm_day}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${r.pipelineUtilizationPct > 90 ? 'text-rose-400' : r.pipelineUtilizationPct > 80 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {r.pipelineUtilizationPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-amber-300">{r.temperatureC}°C</td>
                    <td className="py-3 px-4">{getRiskBadge(r.riskLevel)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectRegion(r.id);
                            onNavigate('forecast');
                          }}
                          className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          {t.btn_forecast}
                        </button>
                        <button
                          onClick={() => {
                            onSelectRegion(r.id);
                            onNavigate('map');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors cursor-pointer"
                        >
                          {t.btn_map}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Alerts & Operational Advisory Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              {language === 'uz' ? "Operativ ogohlantirishlar va dispetcherlik tavsiyalari" : language === 'ru' ? "Оперативные предупреждения и диспетчерские рекомендации" : "Operational Alerts & Dispatch Advisories"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => setAlertSeverityFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  alertSeverityFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                }`}
              >
                {t.filter_all}
              </button>
              <button
                onClick={() => setAlertSeverityFilter('critical')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  alertSeverityFilter === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'
                }`}
              >
                {t.filter_critical}
              </button>
            </div>

            <button
              onClick={() => onAcknowledgeAllAlerts?.()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.btn_acknowledge_all}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredAlerts.map((alert) => {
            const isAcknowledged = alert.status === 'acknowledged';
            const isCritical = alert.severity === 'critical';

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all hover:border-slate-600 ${
                  isAcknowledged
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : isCritical
                    ? 'bg-rose-950/20 border-rose-800/60 hover:bg-rose-950/30'
                    : 'bg-amber-950/15 border-amber-800/50 hover:bg-amber-950/25'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-xs sm:text-sm">
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {alert.regionName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[11px] font-mono text-slate-500">{alert.timestamp}</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-cyan-300 text-xs font-semibold hover:bg-slate-700">
                    {t.btn_inspect} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
