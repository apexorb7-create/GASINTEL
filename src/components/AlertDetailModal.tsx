import React from 'react';
import { AlertItem, RegionData } from '../types';
import { Language, TRANSLATIONS, getLocalizedRegionName } from '../services/i18n';
import { 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: AlertItem | null;
  region?: RegionData;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onViewRegion: (regionId: string) => void;
  onSimulateScenario: () => void;
  language: Language;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  region,
  onClose,
  onAcknowledge,
  onViewRegion,
  onSimulateScenario,
  language,
}) => {
  if (!alert) return null;
  const t = TRANSLATIONS[language];

  const getSeverityStyle = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: AlertTriangle,
          label: language === 'uz' ? 'Kritik daraja' : 'Critical Severity',
        };
      case 'high':
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertCircle,
          label: language === 'uz' ? 'Yuqori daraja' : 'High Severity',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          icon: Info,
          label: language === 'uz' ? 'O\'rta daraja' : 'Medium Severity',
        };
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: Info,
          label: language === 'uz' ? 'Axborot' : 'Information',
        };
    }
  };

  const style = getSeverityStyle(alert.severity);
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="alert-dialog-title"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border ${style.bg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded border font-semibold ${style.badge}`}>
                  {style.label}
                </span>
                <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
              </div>
              <h2 id="alert-dialog-title" className="text-lg font-bold text-slate-100 mt-1">
                {alert.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-sm text-slate-300">
          {/* Affected Region Card */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-400 block font-mono">{language === 'uz' ? 'Tegishli gaz taqsimlash zonasi' : language === 'ru' ? 'Зона газораспределения' : 'Affected Distribution Zone'}</span>
              <span className="text-base font-semibold text-slate-100">
                {region ? getLocalizedRegionName(region, language) : alert.regionName}
              </span>
              {region && (
                <span className="text-xs text-slate-400 block mt-0.5">
                  {language === 'uz' ? 'Markaz' : language === 'ru' ? 'Центр' : 'Capital'}: {region.capital} • {region.temperatureC}°C ({region.tempAnomalyC > 0 ? `+${region.tempAnomalyC}` : region.tempAnomalyC}°C anomaly)
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">{language === 'uz' ? 'Kutilayotgan defitsit' : 'Projected Deficit'}</span>
              <span className="text-base font-mono font-bold text-rose-400">
                {alert.projectedDeficitMcm > 0 ? `+${alert.projectedDeficitMcm} ${t.mcm_day}` : (language === 'uz' ? 'Quvvat zo\'riqishi' : 'Capacity Strain')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 font-mono">
              {language === 'uz' ? 'Vaziyat tavsifi' : 'Situation Summary'}
            </h3>
            <p className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed text-xs">
              {alert.description}
            </p>
          </div>

          {/* Trigger Factor */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 font-mono">
              {language === 'uz' ? 'Asosiy kelib chiqish sababi' : 'Root Trigger Condition'}
            </h3>
            <div className="flex items-start gap-2 bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs">
              <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{alert.triggerReason}</span>
            </div>
          </div>

          {/* Recommended Operational Mitigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 font-mono">
              {language === 'uz' ? 'Tavsiya etiladigan dispetcherlik choralari' : 'Recommended Decision Support Protocol'}
            </h3>
            <div className="bg-cyan-950/30 border border-cyan-800/50 p-3.5 rounded-lg text-cyan-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-cyan-300 block text-xs">{language === 'uz' ? 'Dispetcherlik ko\'rsatmasi' : 'Operator Advisory'}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Non-operational advisory note */}
          <p className="text-[11px] text-slate-500 italic bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
            {language === 'uz' 
              ? 'Eslatma: Ushbu tavsiya rejalashtirish uchun statistik model asosida shakllantirilgan. Tizim quvur kranlarini avtomatik yopmaydi yoki xavfsizlik klapanlarini boshqarmaydi.'
              : 'Note: This advisory is generated from statistical demand forecasting models for distribution planning. It does not actuate valves or override automated pipeline safety shut-off systems.'}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAcknowledge(alert.id);
                onClose();
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                alert.status === 'acknowledged'
                  ? 'bg-slate-800 text-slate-400 border border-slate-700'
                  : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{alert.status === 'acknowledged' ? (language === 'uz' ? 'Tasdiqlangan' : 'Acknowledged') : t.btn_acknowledge}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSimulateScenario();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
            >
              <span>{t.btn_simulate}</span>
            </button>
            <button
              onClick={() => {
                onViewRegion(alert.regionId);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors font-semibold cursor-pointer"
            >
              <span>{t.btn_inspect}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
