import React, { useState, useMemo, useEffect } from 'react';
import { NavigationTab, AlertItem, RegionData } from './types';
import { UZBEKISTAN_REGIONS, INITIAL_ALERTS } from './data/regionsData';
import { generateHourlyForecast } from './services/forecastingEngine';
import { Language, ThemeMode } from './services/i18n';
import { Header } from './components/Header';
import { TrustBanner } from './components/TrustBanner';
import { OverviewView } from './components/OverviewView';
import { ForecastView } from './components/ForecastView';
import { RegionalIntelligenceView } from './components/RegionalIntelligenceView';
import { InteractiveMapView } from './components/InteractiveMapView';
import { ScenarioSimulatorView } from './components/ScenarioSimulatorView';
import { MethodologyView } from './components/MethodologyView';
import { AlertDetailModal } from './components/AlertDetailModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('uz-tk-city');
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [activeModalAlert, setActiveModalAlert] = useState<AlertItem | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('gasintel_lang') as Language) || 'uz';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('gasintel_theme') as ThemeMode) || 'dark';
  });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gasintel_theme', theme);
  }, [theme]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('gasintel_lang', newLang);
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // National aggregated baseline forecast points and metrics for the overview
  const { points: nationalHourlyPoints, metrics: nationalMetrics } = useMemo(() => {
    return generateHourlyForecast('all');
  }, []);

  const totalForecastDemandMcm = useMemo(() => {
    return UZBEKISTAN_REGIONS.reduce((sum, r) => sum + r.forecastDemandMcm, 0);
  }, []);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter(a => a.status === 'active').length;
  }, [alerts]);

  // Handle alert acknowledgement
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'acknowledged' } : a));
  };

  const handleAcknowledgeAllAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, status: 'acknowledged' })));
  };

  // Navigations
  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
  };

  const handleNavigateToForecastForRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    setActiveTab('forecast');
  };

  const handleViewRegionFromAlert = (regionId: string) => {
    setSelectedRegionId(regionId);
    setActiveTab('regions');
  };

  const handleSimulateScenario = () => {
    setActiveTab('scenario');
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'uz' ? 'ru' : language === 'ru' ? 'en' : 'uz';
    handleLanguageChange(nextLang);
  };

  const currentAlertRegion = useMemo(() => {
    if (!activeModalAlert) return undefined;
    return (UZBEKISTAN_REGIONS || []).find(r => r.id === activeModalAlert.regionId);
  }, [activeModalAlert]);

  return (
    <div data-theme={theme} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-200">
      {/* Technical Header with 3 Themes, 3 Languages & Unified Command Toolbar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCount={activeAlertsCount}
        totalForecastDemandMcm={totalForecastDemandMcm}
        language={language}
        onLanguageChange={handleLanguageChange}
        onToggleLanguage={toggleLanguage}
        theme={theme}
        onThemeChange={setTheme}
        regions={UZBEKISTAN_REGIONS}
        selectedRegionId={selectedRegionId}
        onSelectRegion={handleSelectRegion}
        onRefreshTelemetry={handleRefreshTelemetry}
        isRefreshing={isRefreshing}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* Dismissable Safety & Data Transparency Banner */}
      <TrustBanner 
        onNavigateToMethodology={() => setActiveTab('methodology')} 
        language={language}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            regions={UZBEKISTAN_REGIONS}
            alerts={alerts}
            hourlyPoints={nationalHourlyPoints}
            metrics={nationalMetrics}
            onNavigate={setActiveTab}
            onSelectRegion={(id) => {
              setSelectedRegionId(id);
              setActiveTab('regions');
            }}
            onSelectAlert={setActiveModalAlert}
            onAcknowledgeAllAlerts={handleAcknowledgeAllAlerts}
            language={language}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView
            regions={UZBEKISTAN_REGIONS}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            language={language}
          />
        )}

        {activeTab === 'regions' && (
          <RegionalIntelligenceView
            regions={UZBEKISTAN_REGIONS}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            onNavigate={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMapView
            regions={UZBEKISTAN_REGIONS}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            onNavigate={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'scenario' && (
          <ScenarioSimulatorView
            regions={UZBEKISTAN_REGIONS}
            onSelectRegion={(id) => {
              setSelectedRegionId(id);
              setActiveTab('regions');
            }}
            language={language}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-500 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">GASINTEL</span>
            <span>•</span>
            <span>{language === 'uz' ? 'O\'zbekiston Tabiiy Gaz Taqsimoti Qaror Qabul Qilish Tizimi' : 'Uzbekistan Gas Distribution Decision Support Prototype'}</span>
            <span>•</span>
            <span className="text-amber-400">{language === 'uz' ? 'Sintetik Ma\'lumotlar' : 'Synthetic Demonstration Data'}</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            {language === 'uz' ? 'Tavsiyaviy axborot tizimi • To\'g\'ridan-to\'g\'ri klapanlarni boshqarmaydi • v1.2-MVP' : 'Strictly advisory prototype • No live actuation commands • v1.2-MVP'}
          </div>
        </div>
      </footer>

      {/* Interactive Alert Detail Modal */}
      {activeModalAlert && (
        <AlertDetailModal
          alert={activeModalAlert}
          region={currentAlertRegion}
          onClose={() => setActiveModalAlert(null)}
          onAcknowledge={handleAcknowledgeAlert}
          onViewRegion={handleViewRegionFromAlert}
          onSimulateScenario={handleSimulateScenario}
          language={language}
        />
      )}

      {/* Executive Report Modal */}
      {showReportModal && (
        <ExecutiveReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          regions={UZBEKISTAN_REGIONS}
          alerts={alerts}
          totalDemandMcm={totalForecastDemandMcm}
          language={language}
        />
      )}
    </div>
  );
}
