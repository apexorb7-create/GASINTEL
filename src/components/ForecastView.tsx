import React, { useState, useMemo } from 'react';
import { RegionData, HourlyForecastPoint, DailyForecastPoint } from '../types';
import { generateHourlyForecast, generateDailyForecast } from '../services/forecastingEngine';
import { Language, TRANSLATIONS, getLocalizedRegionName } from '../services/i18n';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Download, 
  Info, 
  Thermometer, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ChevronDown,
  Layers,
  Sparkles,
  BarChart2,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Legend 
} from 'recharts';

interface ForecastViewProps {
  regions: RegionData[];
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  language: Language;
}

type UnitType = 'mcm_d' | 'mcm_h' | 'gcal_h';

export const ForecastView: React.FC<ForecastViewProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  language,
}) => {
  const [horizon, setHorizon] = useState<'24h' | '7d' | 'decomp'>('24h');
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('mcm_h');
  const [showTemperatureOverlay, setShowTemperatureOverlay] = useState<boolean>(true);
  const [showConfidenceBand, setShowConfidenceBand] = useState<boolean>(true);
  const [tableFilter, setTableFilter] = useState<'all' | 'peak' | 'forecast_only'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const t = TRANSLATIONS[language];

  // Unit conversion multipliers (baseline in mcm/h for hourly, mcm/d for daily)
  const unitMultiplier = selectedUnit === 'mcm_d' ? 24 : selectedUnit === 'gcal_h' ? 8000 : 1;
  const unitLabel = selectedUnit === 'mcm_d' ? t.mcm_day : selectedUnit === 'gcal_h' ? t.gcal_hour : t.mcm_hour;

  // Generate data based on selected region & horizon
  const { points: hourlyPoints, metrics: hourlyMetrics } = useMemo(() => {
    return generateHourlyForecast(selectedRegionId);
  }, [selectedRegionId]);

  const dailyPoints: DailyForecastPoint[] = useMemo(() => {
    return generateDailyForecast(selectedRegionId);
  }, [selectedRegionId]);

  const currentRegion = (regions || []).find(r => r.id === selectedRegionId);
  const regionName = currentRegion 
    ? getLocalizedRegionName(currentRegion, language) 
    : t.all_regions;

  // Format data for 24h chart
  const hourlyChartData = useMemo(() => {
    return hourlyPoints.map(p => ({
      label: p.hourStr,
      time: p.hourStr,
      historical: p.historicalMcm ? Number((p.historicalMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(2)) : null,
      forecast: Number((p.forecastMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(2)),
      lowerBound: Number((p.lowerBoundMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(2)),
      upperBound: Number((p.upperBoundMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(2)),
      temp: p.temperatureC,
      hdd: p.heatingDegreeDay,
      isPeak: p.isPeak,
    }));
  }, [hourlyPoints, selectedUnit]);

  // Format data for 7d chart
  const dailyChartData = useMemo(() => {
    return dailyPoints.map(p => ({
      label: p.dateStr,
      time: p.dateStr,
      historical: p.historicalMcm ? Number((p.historicalMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(1)) : null,
      forecast: Number((p.forecastMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(1)),
      lowerBound: Number((p.lowerBoundMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(1)),
      upperBound: Number((p.upperBoundMcm * (selectedUnit === 'gcal_h' ? 8000 : 1)).toFixed(1)),
      temp: p.avgTempC,
      demandIndex: p.demandIndex,
    }));
  }, [dailyPoints, selectedUnit]);

  // Decomposition factors data for 24h
  const decompData = useMemo(() => {
    return hourlyPoints.map(p => {
      const baseLoad = Number((p.forecastMcm * 0.45).toFixed(2));
      const weatherHeating = Number((p.forecastMcm * (p.heatingDegreeDay > 0 ? 0.35 : 0.15)).toFixed(2));
      const industrialLoad = Number((p.forecastMcm * (p.hour >= 8 && p.hour <= 18 ? 0.20 : 0.10)).toFixed(2));
      return {
        time: p.hourStr,
        base: baseLoad,
        weather: weatherHeating,
        industry: industrialLoad,
        total: p.forecastMcm,
      };
    });
  }, [hourlyPoints]);

  // CSV Export
  const handleExportCsv = () => {
    let csvHeader = '';
    let csvRows: (string | number)[][] = [];

    if (horizon === '24h') {
      csvHeader = `Time,Forecast_${selectedUnit},LowerBound,UpperBound,Temperature_C,IsPeak,HeatingDegreeDays`;
      csvRows = hourlyPoints.map(p => [
        p.hourStr,
        p.forecastMcm,
        p.lowerBoundMcm,
        p.upperBoundMcm,
        p.temperatureC,
        p.isPeak ? 'YES' : 'NO',
        p.heatingDegreeDay,
      ]);
    } else {
      csvHeader = `Date,Forecast_Mcm_Day,LowerBound,UpperBound,AvgTemp_C,IsHoliday`;
      csvRows = dailyPoints.map(p => [
        p.dateStr,
        p.forecastMcm,
        p.lowerBoundMcm,
        p.upperBoundMcm,
        p.avgTempC,
        p.isHoliday ? 'YES' : 'NO',
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [csvHeader, ...csvRows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GASINTEL_${selectedRegionId}_${horizon}_Forecast.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Filtered table rows
  const tableData = useMemo(() => {
    if (horizon === '24h') {
      let filtered = [...hourlyPoints];
      if (tableFilter === 'peak') filtered = filtered.filter(p => p.isPeak);
      if (tableFilter === 'forecast_only') filtered = filtered.filter(p => !p.isHistorical);
      return filtered;
    } else {
      let filtered = [...dailyPoints];
      if (tableFilter === 'forecast_only') filtered = filtered.filter(p => p.historicalMcm === null);
      return filtered;
    }
  }, [horizon, hourlyPoints, dailyPoints, tableFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Quick Region Selector Pill Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-mono text-slate-400 shrink-0 font-medium mr-1">
            📍 {language === 'uz' ? 'Hudud' : 'Region'}:
          </span>
          <button
            onClick={() => onSelectRegion('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedRegionId === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            {t.all_regions}
          </button>
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedRegionId === r.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {getLocalizedRegionName(r, language)}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Horizon & Unit Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Horizon Segmented Switch */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setHorizon('24h')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              horizon === '24h'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.forecast_horizon_24h}</span>
          </button>
          <button
            onClick={() => setHorizon('7d')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              horizon === '7d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.forecast_horizon_7d}</span>
          </button>
          <button
            onClick={() => setHorizon('decomp')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              horizon === 'decomp'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{t.forecast_decomposition}</span>
          </button>
        </div>

        {/* Display Unit Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">{t.unit_toggle}</span>
          <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
            <button
              onClick={() => setSelectedUnit('mcm_h')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedUnit === 'mcm_h' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
              }`}
            >
              {t.mcm_hour}
            </button>
            <button
              onClick={() => setSelectedUnit('mcm_d')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedUnit === 'mcm_d' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
              }`}
            >
              {t.mcm_day}
            </button>
            <button
              onClick={() => setSelectedUnit('gcal_h')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedUnit === 'gcal_h' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
              }`}
            >
              {t.gcal_hour}
            </button>
          </div>
        </div>

        {/* Overlay Toggles & CSV Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemperatureOverlay(!showTemperatureOverlay)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border cursor-pointer ${
              showTemperatureOverlay
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.temp_overlay}</span>
          </button>

          <button
            onClick={() => setShowConfidenceBand(!showConfidenceBand)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border cursor-pointer ${
              showConfidenceBand
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.confidence_bands}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloadSuccess ? (language === 'uz' ? 'Yuklandi' : 'Downloaded') : t.btn_download_csv}</span>
          </button>
        </div>
      </div>

      {/* 3. Statistical Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">{t.peak_hour}</span>
          <span className="text-lg font-bold font-mono text-amber-300 mt-1 block">
            {hourlyMetrics.peakDemandTime}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {hourlyMetrics.peakDemandMcm} {t.mcm_hour}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">{t.model_r2}</span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
            {hourlyMetrics.r2}
          </span>
          <span className="text-[11px] text-emerald-500 font-mono">High Goodness-of-Fit</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">{t.model_rmse}</span>
          <span className="text-lg font-bold font-mono text-slate-100 mt-1 block">
            {hourlyMetrics.rmse} {t.mcm_hour}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">MAPE: {hourlyMetrics.mape}%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">
            {horizon === '7d' ? (language === 'uz' ? '7 kunlik jami' : '7-Day Total') : (language === 'uz' ? '24 soatlik jami' : '24-Hour Total')}
          </span>
          <span className="text-lg font-bold font-mono text-cyan-300 mt-1 block">
            {horizon === '7d' ? hourlyMetrics.totalForecast7dMcm : hourlyMetrics.totalForecast24hMcm} <span className="text-xs text-slate-400">{t.mcm_day}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {language === 'uz' ? 'Bazaga nisbatan' : 'Baseline'}: {hourlyMetrics.baselineDemandMcm} {t.mcm_day}
          </span>
        </div>
      </div>

      {/* 4. Main Dynamic Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{t.forecast_chart_title} — {regionName}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.forecast_chart_subtitle}
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {horizon === 'decomp' ? (
              <ComposedChart data={decompData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit={` ${unitLabel.split('/')[0]}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                <Bar dataKey="base" stackId="a" fill="#3b82f6" name={language === 'uz' ? 'Bazaviy doimiy yuklama' : 'Base Load'} />
                <Bar dataKey="weather" stackId="a" fill="#f59e0b" name={language === 'uz' ? 'Isitish va ob-havo yuki' : 'Weather / HDD Load'} />
                <Bar dataKey="industry" stackId="a" fill="#10b981" name={language === 'uz' ? 'Sanoat va transport' : 'Industrial / CNG'} />
                <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2.5} dot={false} name={language === 'uz' ? 'Jami prognoz' : 'Total Demand'} />
              </ComposedChart>
            ) : (
              <ComposedChart data={horizon === '24h' ? hourlyChartData : dailyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="confidenceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="demand" stroke="#64748b" fontSize={11} unit={` ${unitLabel.split('/')[0]}`} />
                {showTemperatureOverlay && (
                  <YAxis yAxisId="temp" orientation="right" stroke="#f59e0b" fontSize={11} unit="°C" domain={[-15, 35]} />
                )}
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                
                {showConfidenceBand && (
                  <Area yAxisId="demand" type="monotone" dataKey="upperBound" stroke="none" fill="url(#confidenceFill)" name={language === 'uz' ? 'Yuqori chegara (+1.96σ)' : 'Upper 95% Bound'} />
                )}
                <Area yAxisId="demand" type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={2.5} fill="url(#forecastFill)" name={language === 'uz' ? 'Prognoz talab' : 'Forecast Demand'} />
                <Line yAxisId="demand" type="monotone" dataKey="historical" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} name={language === 'uz' ? 'Tarixiy fakt' : 'Historical Actual'} />
                
                {showTemperatureOverlay && (
                  <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={1.5} dot={false} name={language === 'uz' ? 'Harorat (°C)' : 'Temperature (°C)'} />
                )}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Detailed Forecast Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-slate-100 font-mono">
            {horizon === '24h' 
              ? (language === 'uz' ? '24 Soatlik tafsilotlar jadvali' : '24-Hour Tabular Breakdown')
              : (language === 'uz' ? '7 Kunlik tafsilotlar jadvali' : '7-Day Tabular Breakdown')}
          </h4>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setTableFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                tableFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
              }`}
            >
              {t.filter_all}
            </button>
            {horizon === '24h' && (
              <button
                onClick={() => setTableFilter('peak')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  tableFilter === 'peak' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
                }`}
              >
                {language === 'uz' ? 'Faqat tig\'iz soatlar' : 'Peak Hours Only'}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-[11px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{horizon === '24h' ? (language === 'uz' ? 'Soat' : 'Hour') : (language === 'uz' ? 'Sana' : 'Date')}</th>
                <th className="py-2.5 px-3">{language === 'uz' ? 'Prognoz' : 'Forecast'} ({unitLabel})</th>
                <th className="py-2.5 px-3">{language === 'uz' ? '95% Quyi' : '95% Lower'}</th>
                <th className="py-2.5 px-3">{language === 'uz' ? '95% Yuqori' : '95% Upper'}</th>
                <th className="py-2.5 px-3">{language === 'uz' ? 'Harorat' : 'Temp'}</th>
                <th className="py-2.5 px-3">{language === 'uz' ? 'Holat' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tableData.slice(0, 12).map((row: any, idx: number) => {
                const isPeak = row.isPeak;
                return (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {row.hourStr || row.dateStr}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">
                      {row.forecastMcm}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {row.lowerBoundMcm}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {row.upperBoundMcm}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300">
                      {row.temperatureC !== undefined ? `${row.temperatureC}°C` : `${row.avgTempC}°C`}
                    </td>
                    <td className="py-2.5 px-3">
                      {isPeak ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'uz' ? 'TIG\'IZ VAQT' : 'PEAK'}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">
                          {language === 'uz' ? 'STANDART' : 'NORMAL'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
