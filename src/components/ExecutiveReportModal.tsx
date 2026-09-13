import React, { useState } from 'react';
import { RegionData, AlertItem } from '../types';
import { Language, TRANSLATIONS, getLocalizedRegionName } from '../services/i18n';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Flame, 
  AlertTriangle, 
  Printer,
  ShieldCheck,
  Building2,
  Gauge
} from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  regions: RegionData[];
  alerts: AlertItem[];
  language: Language;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  regions,
  alerts,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const totalForecast = regions.reduce((sum, r) => sum + r.forecastDemandMcm, 0);
  const totalBase = regions.reduce((sum, r) => sum + r.baseConsumptionMcm, 0);
  const totalCapacity = regions.reduce((sum, r) => sum + r.pipelineCapacityMcm, 0);
  const overallUtilization = ((totalForecast / totalCapacity) * 100).toFixed(1);
  const criticalRegions = regions.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'elevated');
  const activeAlerts = alerts.filter(a => a.status === 'active');

  const reportDate = '13.09.2026';
  const reportTime = '10:45 UTC+5';

  const generateReportText = () => {
    return `=====================================================
GASINTEL: ${t.report_modal_title.toUpperCase()}
Sana: ${reportDate} | Vaqt: ${reportTime}
Status: ${language === 'uz' ? "Sintetik Rejalashtirish Modeli" : "Synthetic Operational Planning Model"}
=====================================================

1. ${t.report_national_summary.toUpperCase()}:
- ${language === 'uz' ? "Kutilayotgan 24 soatlik gaz talabi" : "Total 24h Projected Demand"}: ${totalForecast.toFixed(1)} ${t.mcm_day}
- ${language === 'uz' ? "Bazaviy iste'mol ko'rsatkichi" : "Baseline Consumption"}: ${totalBase.toFixed(1)} ${t.mcm_day} (+${(((totalForecast - totalBase)/totalBase)*100).toFixed(1)}%)
- ${language === 'uz' ? "Magistral o'tkazish quvvati" : "Total Pipeline Capacity"}: ${totalCapacity.toFixed(1)} ${t.mcm_day}
- ${language === 'uz' ? "Tizim bo'yicha laynpek yuklamasi" : "Overall System Utilization"}: ${overallUtilization}%
- ${language === 'uz' ? "Faol ogohlantirishlar soni" : "Active Alerts"}: ${activeAlerts.length} ta

2. ${t.report_critical_zones.toUpperCase()}:
${criticalRegions.map(r => `• ${getLocalizedRegionName(r, language)} (${r.code}):
  - ${language === 'uz' ? "Prognoz" : language === 'ru' ? "Прогноз" : "Forecast"}: ${r.forecastDemandMcm} ${t.mcm_day} | ${language === 'uz' ? "Quvvat" : language === 'ru' ? "Мощность" : "Capacity"}: ${r.pipelineCapacityMcm} ${t.mcm_day} | ${language === 'uz' ? "Yuklama" : language === 'ru' ? "Загрузка" : "Load"}: ${r.pipelineUtilizationPct}%
  - ${language === 'uz' ? "Harorat" : language === 'ru' ? "Температура" : "Temp"}: ${r.temperatureC}°C (${r.tempAnomalyC > 0 ? `+${r.tempAnomalyC}` : r.tempAnomalyC}°C)
  - ${language === 'uz' ? "Holat" : language === 'ru' ? "Статус" : "Status"}: ${r.riskLevel.toUpperCase()}`).join('\n')}

3. ${t.report_action_checklist.toUpperCase()}:
1. ${language === 'uz' ? "Toshkent shahri va Toshkent viloyati kompressor stansiyalarida laynpek bosimini nazorat qilish." : language === 'ru' ? "Контролировать давление в газопроводе на компрессорных станциях г. Ташкента и Ташкентской области." : "Monitor linepack pressure at Tashkent City and Tashkent Region compressor nodes."}
2. ${language === 'uz' ? "Farg'ona vodiysi yo'nalishidagi Kamchik magistralida oqim taqsimotini muvozanatlash." : language === 'ru' ? "Сбалансировать распределение потоков по магистрали через Камчик в Ферганскую долину." : "Balance flow distribution along Kamchik trunk spur into Fergana Valley."}
3. ${language === 'uz' ? "Gazli va Sho'rtan gaz omborlaridan ehtiyojga qarab qo'shimcha zaxira kiritish jadvalini tayyorlash." : language === 'ru' ? "Подготовить график отбора дополнительного объема из ПХГ Газли и Шуртан." : "Prepare supplementary withdrawal schedule from Gazli and Shurtan storage facilities as needed."}

=====================================================
GASINTEL Prototip • ${language === 'uz' ? "Qaror qabul qilishni qo'llab-quvvatlash tizimi" : language === 'ru' ? "Система поддержки принятия решений" : "Decision Support System"}
=====================================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCsv = () => {
    const headers = [
      language === 'uz' ? 'Hudud' : language === 'ru' ? 'Регион' : 'Region',
      'Kod',
      language === 'uz' ? 'Joriy talab (mln m3)' : language === 'ru' ? 'Текущий спрос (млн м3)' : 'Current Demand (mcm)',
      language === 'uz' ? 'Prognoz talab (mln m3)' : language === 'ru' ? 'Прогноз спроса (млн м3)' : 'Forecast Demand (mcm)',
      language === 'uz' ? 'Quvur quvvati (mln m3)' : language === 'ru' ? 'Мощность газопровода (млн м3)' : 'Pipeline Capacity (mcm)',
      language === 'uz' ? 'Yuklama (%)' : language === 'ru' ? 'Загрузка (%)' : 'Utilization (%)',
      language === 'uz' ? 'Harorat (C)' : language === 'ru' ? 'Температура (C)' : 'Temperature (C)',
      language === 'uz' ? 'Xavf darajasi' : language === 'ru' ? 'Уровень риска' : 'Risk Level'
    ];

    const rows = regions.map(r => [
      `"${getLocalizedRegionName(r, language)}"`,
      r.code,
      r.currentDemandMcm,
      r.forecastDemandMcm,
      r.pipelineCapacityMcm,
      r.pipelineUtilizationPct,
      r.temperatureC,
      r.riskLevel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GASINTEL_Report_${reportDate.replace(/\./g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{t.report_modal_title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {reportDate}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.report_modal_subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-mono text-[10px] uppercase block">
                {t.kpi_total_forecast}
              </span>
              <span className="text-lg font-bold font-mono text-cyan-300">
                {totalForecast.toFixed(1)} <span className="text-xs font-normal text-slate-400">{t.mcm_day}</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-mono text-[10px] uppercase block">
                {language === 'uz' ? "Tizim yuklamasi" : "System Load"}
              </span>
              <span className={`text-lg font-bold font-mono ${Number(overallUtilization) > 90 ? 'text-rose-400' : 'text-slate-100'}`}>
                {overallUtilization}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-mono text-[10px] uppercase block">
                {language === 'uz' ? "Yuklama yuqori hududlar" : "Stressed Zones"}
              </span>
              <span className="text-lg font-bold font-mono text-amber-300">
                {criticalRegions.length} <span className="text-xs font-normal text-slate-400">/ 12</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-mono text-[10px] uppercase block">
                {t.active_alerts}
              </span>
              <span className="text-lg font-bold font-mono text-rose-400">
                {activeAlerts.length} <span className="text-xs font-normal text-slate-400">{language === 'uz' ? 'faol' : 'active'}</span>
              </span>
            </div>
          </div>

          {/* Critical Regions Table */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-200 text-xs uppercase font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.report_critical_zones}</span>
            </h3>
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">{language === 'uz' ? 'Hudud nomi' : 'Region'}</th>
                    <th className="p-2.5">{language === 'uz' ? 'Prognoz talab' : 'Forecast Demand'}</th>
                    <th className="p-2.5">{language === 'uz' ? 'Quvvat' : 'Capacity'}</th>
                    <th className="p-2.5">{language === 'uz' ? 'Yuklama %' : 'Utilization %'}</th>
                    <th className="p-2.5">{language === 'uz' ? 'Harorat' : 'Temperature'}</th>
                    <th className="p-2.5">{language === 'uz' ? 'Holat' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {criticalRegions.map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-semibold text-slate-200">
                        {getLocalizedRegionName(r, language)}
                      </td>
                      <td className="p-2.5 text-cyan-300 font-bold">{r.forecastDemandMcm} {t.mcm_day}</td>
                      <td className="p-2.5 text-slate-400">{r.pipelineCapacityMcm} {t.mcm_day}</td>
                      <td className="p-2.5 font-bold text-rose-400">{r.pipelineUtilizationPct}%</td>
                      <td className="p-2.5 text-amber-300">{r.temperatureC}°C</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {r.riskLevel.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-200 text-xs uppercase font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.report_action_checklist}</span>
            </h3>
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">1</span>
                <p>{language === 'uz' ? "Toshkent shahri va Toshkent viloyati kompressor stansiyalarida laynpek bosimini 6.0 bardan pasaytirmaslik." : "Maintain minimum linepack pressure above 6.0 bar at Tashkent metro distribution gates."}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">2</span>
                <p>{language === 'uz' ? "Farg'ona vodiysi yo'nalishidagi Kamchik magistralida oqim zaxirasini 18:00 gacha to'ldirish." : "Pre-pack Kamchik pass corridor prior to the 18:00 evening residential heating peak."}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">3</span>
                <p>{language === 'uz' ? "Gazli va Sho'rtan UGS yer osti gaz omborlaridan kuniga qo'shimcha 3.5-4.0 mln m³ gaz chiqarishga shay turish." : "Stand by for 3.5-4.0 mcm/d supplemental extraction from Gazli & Shurtan underground storage facilities."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copied ? t.report_copied : t.btn_copy_summary}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.btn_download_csv}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            {t.btn_close}
          </button>
        </div>
      </div>
    </div>
  );
};
