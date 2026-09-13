import React, { useState } from 'react';
import { NavigationTab, RegionData } from '../types';
import { Language, ThemeMode, TRANSLATIONS, getLocalizedRegionName } from '../services/i18n';
import { 
  Flame, 
  Activity, 
  TrendingUp, 
  Map, 
  Sliders, 
  BookOpen, 
  AlertTriangle,
  RotateCw,
  FileText,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Sparkles,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  alertCount: number;
  totalForecastDemandMcm: number;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onToggleLanguage?: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  regions?: RegionData[];
  selectedRegionId?: string;
  onSelectRegion?: (id: string) => void;
  onRefreshTelemetry?: () => void;
  isRefreshing?: boolean;
  onOpenReportModal?: () => void;
  onOpenReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  alertCount,
  totalForecastDemandMcm,
  language,
  onLanguageChange,
  onToggleLanguage,
  theme,
  onThemeChange,
  regions = [],
  selectedRegionId = 'all',
  onSelectRegion,
  onRefreshTelemetry,
  isRefreshing = false,
  onOpenReportModal,
  onOpenReport,
}) => {
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleLang = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    } else if (onToggleLanguage) {
      onToggleLanguage();
    }
  };

  const handleReportOpen = () => {
    if (onOpenReportModal) {
      onOpenReportModal();
    } else if (onOpenReport) {
      onOpenReport();
    }
  };

  const tabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t.tab_overview, icon: Activity },
    { id: 'forecast', label: t.tab_forecast, icon: TrendingUp },
    { id: 'regions', label: t.tab_regions, icon: Flame },
    { id: 'map', label: t.tab_map, icon: Map },
    { id: 'scenario', label: t.tab_scenario, icon: Sliders },
    { id: 'methodology', label: t.tab_methodology, icon: BookOpen },
  ];

  const regionList = Array.isArray(regions) ? regions : [];
  const selectedRegion = regionList.find(r => r.id === selectedRegionId);
  const selectedRegionLabel = selectedRegion
    ? getLocalizedRegionName(selectedRegion, language)
    : t.all_regions;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md backdrop-blur-md transition-colors">
      {/* Primary Command & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Brand & Identity */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shrink-0">
              <Flame className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-slate-100 text-base font-mono">GASINTEL</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-800/40 font-semibold">
                  PRO
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t.nodes_online}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Alert pill on mobile */}
          {alertCount > 0 && (
            <button
              onClick={() => onTabChange('overview')}
              className="lg:hidden flex items-center gap-1 px-2 py-1 rounded-md bg-rose-950/70 border border-rose-800/70 text-rose-300 text-xs font-mono"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{alertCount}</span>
            </button>
          )}
        </div>

        {/* Right: Unified Professional Toolbar (Theme + Language + Region + Actions) */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Quick Region Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition-all font-medium cursor-pointer"
              title={t.quick_region_select}
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="max-w-[120px] sm:max-w-[140px] truncate">{selectedRegionLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {regionDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setRegionDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-64 max-h-72 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-40 text-xs divide-y divide-slate-800/50">
                  <button
                    onClick={() => {
                      onSelectRegion?.('all');
                      setRegionDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800/80 text-cyan-300 flex items-center justify-between cursor-pointer font-medium"
                  >
                    <span>{t.all_regions}</span>
                    {selectedRegionId === 'all' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {regionList.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onSelectRegion?.(r.id);
                        setRegionDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800/80 text-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="truncate">{getLocalizedRegionName(r, language)}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                        {r.forecastDemandMcm} {t.mcm_day}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 3-Language Switcher (UZ / RU / EN) */}
          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5" title={t.language_toggle}>
            <button
              onClick={() => handleLang('uz')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                language === 'uz'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="O'zbek tili"
            >
              🇺🇿 UZ
            </button>
            <button
              onClick={() => handleLang('ru')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                language === 'ru'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Русский язык"
            >
              🇷🇺 RU
            </button>
            <button
              onClick={() => handleLang('en')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              🇬🇧 EN
            </button>
          </div>

          {/* 3-Theme Switcher (Light / Dark / Midnight) */}
          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5" title={t.theme_label}>
            <button
              onClick={() => onThemeChange('light')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.theme_light}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.theme_dark}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dark</span>
            </button>
            <button
              onClick={() => onThemeChange('midnight')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'midnight'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.theme_midnight}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Midnight</span>
            </button>
          </div>

          {/* Refresh Telemetry Button */}
          {onRefreshTelemetry && (
            <button
              onClick={onRefreshTelemetry}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium cursor-pointer"
              title={t.refresh_data}
            >
              <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin text-cyan-300' : ''}`} />
              <span className="hidden sm:inline">{t.refresh_data}</span>
            </button>
          )}

          {/* Executive Report Modal Trigger */}
          <button
            onClick={handleReportOpen}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-colors font-medium cursor-pointer"
            title={t.export_report}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{t.export_report}</span>
          </button>

          {/* Alert Counter (Desktop) */}
          {alertCount > 0 && (
            <button
              onClick={() => onTabChange('overview')}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/70 border border-rose-800/70 text-rose-300 hover:bg-rose-900/50 transition-colors font-mono cursor-pointer"
              title={t.active_alerts}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{alertCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-1.5 no-scrollbar" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-button-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
