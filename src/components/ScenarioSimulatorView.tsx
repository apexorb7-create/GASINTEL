import React, { useState, useMemo } from 'react';
import { RegionData, ScenarioParameters } from '../types';
import { calculateScenarioImpact } from '../services/forecastingEngine';
import { Language, TRANSLATIONS, getLocalizedRegionName } from '../services/i18n';
import { 
  Sliders, 
  RotateCcw, 
  AlertTriangle, 
  Thermometer, 
  TrendingUp, 
  Users, 
  Factory, 
  ShieldAlert, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Sparkles,
  Info,
  Download,
  Copy,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceLine 
} from 'recharts';

interface ScenarioSimulatorViewProps {
  regions: RegionData[];
  onSelectRegion: (id: string) => void;
  language: Language;
}

const DEFAULT_SCENARIO: ScenarioParameters = {
  temperatureDeltaC: 0,
  seasonalMultiplier: 1.0,
  industrialActivityPct: 100,
  populationGrowthPct: 0,
  pipelineCapacityConstraintPct: 0,
};

export const ScenarioSimulatorView: React.FC<ScenarioSimulatorViewProps> = ({
  regions,
  onSelectRegion,
  language,
}) => {
  const [scenario, setScenario] = useState<ScenarioParameters>(DEFAULT_SCENARIO);
  const [activePreset, setActivePreset] = useState<string>('default');
  const [copied, setCopied] = useState(false);

  const t = TRANSLATIONS[language];

  // Recalculate simulation outcome based on current parameters
  const impact = useMemo(() => {
    return calculateScenarioImpact(scenario);
  }, [scenario]);

  // Presets
  const applyPreset = (name: string) => {
    setActivePreset(name);
    switch (name) {
      case 'arctic-freeze':
        setScenario({
          temperatureDeltaC: -10,
          seasonalMultiplier: 1.25,
          industrialActivityPct: 105,
          populationGrowthPct: 2,
          pipelineCapacityConstraintPct: 5,
        });
        break;
      case 'industrial-surge':
        setScenario({
          temperatureDeltaC: -2,
          seasonalMultiplier: 1.05,
          industrialActivityPct: 125,
          populationGrowthPct: 3,
          pipelineCapacityConstraintPct: 0,
        });
        break;
      case 'pipeline-bottleneck':
        setScenario({
          temperatureDeltaC: -4,
          seasonalMultiplier: 1.1,
          industrialActivityPct: 100,
          populationGrowthPct: 0,
          pipelineCapacityConstraintPct: 20,
        });
        break;
      case 'summer-heatwave':
        setScenario({
          temperatureDeltaC: 8,
          seasonalMultiplier: 0.85,
          industrialActivityPct: 110,
          populationGrowthPct: 0,
          pipelineCapacityConstraintPct: 0,
        });
        break;
      case 'reset':
      default:
        setScenario(DEFAULT_SCENARIO);
        setActivePreset('default');
        break;
    }
  };

  // Steppers for precision control
  const stepTemp = (delta: number) => {
    setScenario(prev => ({
      ...prev,
      temperatureDeltaC: Math.max(-15, Math.min(10, prev.temperatureDeltaC + delta))
    }));
  };

  const stepSeasonal = (delta: number) => {
    setScenario(prev => ({
      ...prev,
      seasonalMultiplier: Number(Math.max(0.7, Math.min(1.5, prev.seasonalMultiplier + delta)).toFixed(2))
    }));
  };

  const stepIndustrial = (delta: number) => {
    setScenario(prev => ({
      ...prev,
      industrialActivityPct: Math.max(70, Math.min(140, prev.industrialActivityPct + delta))
    }));
  };

  const stepPopulation = (delta: number) => {
    setScenario(prev => ({
      ...prev,
      populationGrowthPct: Math.max(-5, Math.min(15, prev.populationGrowthPct + delta))
    }));
  };

  const stepConstraint = (delta: number) => {
    setScenario(prev => ({
      ...prev,
      pipelineCapacityConstraintPct: Math.max(0, Math.min(30, prev.pipelineCapacityConstraintPct + delta))
    }));
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    return impact.regionalImpacts.map(r => {
      const originalRegion = (regions || []).find(reg => reg.id === r.regionId);
      const name = originalRegion 
        ? getLocalizedRegionName(originalRegion, language) 
        : r.regionName;

      return {
        name,
        code: originalRegion?.code || '',
        base: Number(r.baselineDemandMcm.toFixed(1)),
        simulated: Number(r.simulatedDemandMcm.toFixed(1)),
        capacity: Number(r.effectiveCapacityMcm.toFixed(1)),
        deficit: Number(r.deficitMcm.toFixed(1)),
        utilization: Number(r.simulatedUtilizationPct.toFixed(0)),
        isDeficit: r.deficitMcm > 0,
      };
    });
  }, [impact, regions, language]);

  const handleCopySummary = () => {
    const summaryText = `GASINTEL Ssenariy Simulyatsiyasi:
Jami talab: ${impact.totalSimulatedDemandMcm.toFixed(1)} ${t.mcm_day} (${impact.overallChangePct > 0 ? '+' : ''}${impact.overallChangePct.toFixed(1)}%)
Jami quvvat: ${impact.totalSimulatedCapacityMcm.toFixed(1)} ${t.mcm_day}
Tizim defitsiti: ${impact.totalDeficitMcm > 0 ? impact.totalDeficitMcm.toFixed(1) + ' ' + t.mcm_day : 'Yo\'q (Barqaror)'}
Xavf ostidagi hududlar soni: ${impact.affectedRegionsCount} ta`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Scenario Presets Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">
                {t.sim_title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.sim_subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? (language === 'uz' ? 'Nusxalandi' : 'Copied') : t.btn_copy_summary}</span>
            </button>

            <button
              onClick={() => applyPreset('reset')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.btn_reset}</span>
            </button>
          </div>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => applyPreset('arctic-freeze')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'arctic-freeze'
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-950'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="font-semibold text-xs block">{t.preset_cold_snap}</span>
            <span className="text-[11px] text-slate-400 block mt-1">ΔT = -10°C • {language === 'uz' ? 'Maksimal isitish' : 'Max heating'}</span>
          </button>

          <button
            onClick={() => applyPreset('industrial-surge')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'industrial-surge'
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-950'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="font-semibold text-xs block">{t.preset_industrial_surge}</span>
            <span className="text-[11px] text-slate-400 block mt-1">125% {language === 'uz' ? 'sanoat iste\'moli' : 'industrial load'}</span>
          </button>

          <button
            onClick={() => applyPreset('pipeline-bottleneck')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'pipeline-bottleneck'
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-950'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="font-semibold text-xs block">{t.preset_pipeline_constraint}</span>
            <span className="text-[11px] text-slate-400 block mt-1">-20% {language === 'uz' ? 'magistral quvvati' : 'trunk capacity'}</span>
          </button>

          <button
            onClick={() => applyPreset('summer-heatwave')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'summer-heatwave'
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-950'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="font-semibold text-xs block">{t.preset_summer_drop}</span>
            <span className="text-[11px] text-slate-400 block mt-1">ΔT = +8°C • {language === 'uz' ? 'Yozgi pasayish' : 'Summer shoulder'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Parameter Sliders with +/- Stepper Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Temperature Delta Slider with Steppers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              {t.slider_temp_delta}
            </span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {scenario.temperatureDeltaC > 0 ? `+${scenario.temperatureDeltaC}` : scenario.temperatureDeltaC}°C
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="10"
            step="1"
            value={scenario.temperatureDeltaC}
            onChange={(e) => {
              setActivePreset('custom');
              setScenario({ ...scenario, temperatureDeltaC: parseFloat(e.target.value) });
            }}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>-15°C</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => stepTemp(-1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                onClick={() => stepTemp(1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
            <span>+10°C</span>
          </div>
        </div>

        {/* Seasonal Multiplier with Steppers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              {t.slider_seasonal}
            </span>
            <span className="font-mono font-bold text-cyan-300 text-sm">
              {scenario.seasonalMultiplier}x
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.05"
            value={scenario.seasonalMultiplier}
            onChange={(e) => {
              setActivePreset('custom');
              setScenario({ ...scenario, seasonalMultiplier: parseFloat(e.target.value) });
            }}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>0.7x</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => stepSeasonal(-0.05)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                onClick={() => stepSeasonal(0.05)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
            <span>1.5x</span>
          </div>
        </div>

        {/* Industrial Activity with Steppers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-cyan-400" />
              {t.slider_industrial}
            </span>
            <span className="font-mono font-bold text-slate-200 text-sm">
              {scenario.industrialActivityPct}%
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="140"
            step="5"
            value={scenario.industrialActivityPct}
            onChange={(e) => {
              setActivePreset('custom');
              setScenario({ ...scenario, industrialActivityPct: parseFloat(e.target.value) });
            }}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>70%</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => stepIndustrial(-5)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                onClick={() => stepIndustrial(5)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
            <span>140%</span>
          </div>
        </div>

        {/* Population Growth Slider with Steppers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              {t.slider_population}
            </span>
            <span className="font-mono font-bold text-slate-200 text-sm">
              {scenario.populationGrowthPct > 0 ? `+${scenario.populationGrowthPct}` : scenario.populationGrowthPct}%
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="15"
            step="1"
            value={scenario.populationGrowthPct}
            onChange={(e) => {
              setActivePreset('custom');
              setScenario({ ...scenario, populationGrowthPct: parseFloat(e.target.value) });
            }}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>-5%</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => stepPopulation(-1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                onClick={() => stepPopulation(1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
            <span>+15%</span>
          </div>
        </div>

        {/* Pipeline Capacity Constraint with Steppers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 lg:col-span-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              {t.slider_capacity_constraint}
            </span>
            <span className="font-mono font-bold text-rose-400 text-sm">
              -{scenario.pipelineCapacityConstraintPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={scenario.pipelineCapacityConstraintPct}
            onChange={(e) => {
              setActivePreset('custom');
              setScenario({ ...scenario, pipelineCapacityConstraintPct: parseFloat(e.target.value) });
            }}
            className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>0% (Nominal)</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => stepConstraint(-5)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                onClick={() => stepConstraint(5)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
            <span>-30% ({language === 'uz' ? 'Jiddiy avariya' : 'Major outage'})</span>
          </div>
        </div>
      </div>

      {/* 3. National Impact Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">{language === 'uz' ? 'Simulyatsiya talabi' : 'Simulated Demand'}</span>
          <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">
            {impact.totalSimulatedDemandMcm.toFixed(1)} <span className="text-xs text-slate-400">{t.mcm_day}</span>
          </span>
          <span className="text-[11px] text-rose-400 font-mono block mt-1">
            {impact.overallChangePct > 0 ? `+${impact.overallChangePct.toFixed(1)}%` : `${impact.overallChangePct.toFixed(1)}%`} vs baseline
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">{language === 'uz' ? 'Mavjud o\'tkazish quvvati' : 'Effective Capacity'}</span>
          <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">
            {impact.totalSimulatedCapacityMcm.toFixed(1)} <span className="text-xs text-slate-400">{t.mcm_day}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">
            {impact.systemUtilizationPct.toFixed(1)}% {t.linepack_utilization}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">{language === 'uz' ? 'Kutilayotgan umumiy defitsit' : 'Projected Deficit'}</span>
          <span className={`text-xl font-bold font-mono mt-1 block ${impact.totalDeficitMcm > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {impact.totalDeficitMcm > 0 ? `+${impact.totalDeficitMcm.toFixed(1)} ${t.mcm_day}` : (language === 'uz' ? 'Defitsit yo\'q' : 'No Deficit')}
          </span>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">
            {impact.affectedRegionsCount} {language === 'uz' ? 'hududda yuklama yuqori' : 'stressed zones'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-slate-400 text-[10px] font-mono uppercase block">{language === 'uz' ? 'Infratuzilma holati' : 'Grid Status'}</span>
          <span className={`text-sm font-bold font-mono mt-1 block ${impact.totalDeficitMcm > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {impact.totalDeficitMcm > 0 ? (language === 'uz' ? '⚠️ Cheklanish xavfi' : '⚠️ Strain Alert') : (language === 'uz' ? '✓ Barqaror muvozanat' : '✓ Stable Grid')}
          </span>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">
            {language === 'uz' ? 'Matematik prognoz modeli' : 'Mathematical simulation'}
          </span>
        </div>
      </div>

      {/* 4. Comparative Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">
            {t.sim_results_title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'uz' ? "Bazaviy talab va simulyatsiya qilingan talabning magistral quvur quvvatiga nisbati" : "Baseline vs simulated demand against effective pipeline throughput capacities"}
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="code" stroke="#64748b" fontSize={11} interval={0} angle={-35} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} unit={` ${t.mcm_day.split('/')[0]}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                formatter={(val: any, name: any) => [`${val} ${t.mcm_day}`, name]}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
              <Bar dataKey="base" fill="#475569" name={language === 'uz' ? 'Bazaviy talab' : 'Baseline Demand'} />
              <Bar dataKey="simulated" fill="#06b6d4" name={language === 'uz' ? 'Ssenariy talabi' : 'Scenario Demand'} />
              <Bar dataKey="capacity" fill="#f59e0b" name={language === 'uz' ? 'Magistral quvvati' : 'Effective Capacity'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Recommended Operational Mitigations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{t.sim_mitigation_title}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-300 block">
              1. {language === 'uz' ? 'Yer osti gaz omborlari (UGS)' : 'Underground Storage (UGS)'}
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'uz' 
                ? 'Gazli va Sho\'rtan yer osti omborlaridan kuniga qo\'shimcha 3.5-4.2 mln m³ gaz chiqarish quvvatini yoqish.'
                : 'Activate 3.5-4.2 mcm/d supplemental daily withdrawals from Gazli and Shurtan underground storage facilities.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-semibold text-amber-300 block">
              2. {language === 'uz' ? 'Laynpek bosimini oshirish' : 'Trunkline Linepack Packing'}
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'uz'
                ? 'Yangiyer va Toshkent yo\'nalishidagi kompressor stansiyalarida laynpek bosimini 6.8 bargacha ko\'tarish.'
                : 'Pre-pack trunk corridors toward Tashkent and Fergana to 6.8 bar to absorb peak evening residential draws.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-300 block">
              3. {language === 'uz' ? 'Sanoat yuklamasini muvozanatlash' : 'Demand-Side Management'}
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'uz'
                ? 'Tig\'iz soatlarda metallurgiya va kimyo sanoati yirik iste\'molchilarini tungi vaqt oralig\'iga o\'tkazish.'
                : 'Coordinate with heavy chemical and metallurgical plants for scheduled night-shift gas consumption offsets.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
