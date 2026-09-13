import React from 'react';
import { 
  BookOpen, 
  Database, 
  Cpu, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../services/i18n';

interface MethodologyViewProps {
  language: Language;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-slate-300">
      {/* Page Title & Provenance Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>
            {language === 'uz' ? 'Texnik Hujjat va Ma\'lumotlar Manbasi' : language === 'ru' ? 'Техническая документация и происхождение данных' : 'Technical Whitepaper & Provenance Specification'}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">
          GASINTEL: {language === 'uz' ? 'Prognozlash Arxitekturasi, Matematik Model va Metodologiya' : language === 'ru' ? 'Архитектура прогнозирования, математическая модель и методология' : 'Data Provenance, Forecasting Architecture & Methodology'}
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          {language === 'uz'
            ? 'Ushbu hujjat GASINTEL intellektual qaror qabul qilish tizimining ma\'lumotlar manbasi, matematik formulalari va operativ chegaralarini to\'liq shaffoflik bilan bayon qiladi.'
            : language === 'ru'
            ? 'Этот документ содержит прозрачное описание источников данных, математического моделирования и алгоритмических границ системы поддержки принятия решений GASINTEL.'
            : 'This document provides full transparency into the data sources, mathematical modeling, algorithmic formulation, and operational boundaries of the GASINTEL decision-support prototype.'}
        </p>

        <div className="mt-4 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-300 uppercase tracking-wide block">
              {language === 'uz' ? 'Etik Ochiqlik va Sintetik Ma\'lumotlar Eslatmasi' : language === 'ru' ? 'Этическое раскрытие и статус синтетических данных' : 'Ethical Disclosure & Data Transparency'}
            </span>
            <p className="leading-relaxed">
              <strong>{language === 'uz' ? 'Tizimdagi barcha operativ ko\'rsatkichlar matematik sintetik modellashtirilgan.' : language === 'ru' ? 'Все оперативные показатели в прототипе сгенерированы синтетически.' : 'All operational data in this prototype is synthetically generated.'}</strong> {language === 'uz'
                ? 'Milliy energetika xavfsizligi nuqtai nazaridan Uztransgaz va Hududgazta\'minot ning real yopiq SCADA telemetriyasi ulanmagan. Ma\'lumotlar O\'zbekistonning rasmiy yillik tabiiy gaz balansi (~45-50 mlrd m³/yil) hamda O\'zgidromet iqlimiy ko\'rsatkichlariga mos ravishda kalibrlangan.'
                : language === 'ru'
                ? 'В целях энергетической безопасности закрытая телеметрия SCADA АО «Узтрансгаз» и «Худудгазтаъминот» не подключена напрямую. Синтетическая модель откалибрована на основе открытых данных энергобаланса Узбекистана (~45–50 млрд м³/год) и климатических норм Узгидромета.'
                : 'Due to the strategic security classification of national energy infrastructure, real-time institutional telemetry from Uztransgaz or Khududgaztaminot is not connected. The synthetic dataset is calibrated against public national energy balance reports (~45–50 billion m³/year total consumption) and real meteorological patterns of Uzbekistan.'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Synthetic Data Architecture */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">
            {language === 'uz' ? '1. Sintetik Ma\'lumotlar Arxitekturasi va O\'zgaruvchilar' : language === 'ru' ? '1. Архитектура синтетических данных и переменные' : '1. Synthetic Dataset Architecture & Parameters'}
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'uz'
            ? 'Sintetik generator 12 ta ma\'muriy hudud uchun deterministik Mulberry32 psevdo-tasodifiy generatori yordamida har soatlik va kunlik vaqt qatorlarini hosil qiladi. Bu har qanday sessiyada natijalarning aynan bir xil va takrorlanuvchan bo\'lishini ta\'minlaydi.'
            : language === 'ru'
            ? 'Генератор синтетических данных формирует почасовые и суточные временные ряды для 12 регионов Узбекистана на базе псевдослучайного алгоритма Mulberry32 с фиксированным сидом, обеспечивая повторяемость результатов.'
            : 'The synthetic data generator produces a 12-month historical time series and forward forecasts for 12 administrative divisions of Uzbekistan using a seeded pseudo-random number generator (PRNG: Mulberry32) to guarantee reproducible, deterministic behavior across sessions.'}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-lg">
            <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">{language === 'uz' ? 'O\'zgaruvchi' : language === 'ru' ? 'Переменная' : 'Variable'}</th>
                <th className="p-3">{language === 'uz' ? 'Turi' : language === 'ru' ? 'Тип данных' : 'Data Type'}</th>
                <th className="p-3">{language === 'uz' ? 'Birligi' : language === 'ru' ? 'Единица' : 'Physical Dimension'}</th>
                <th className="p-3">{language === 'uz' ? 'Modellashtirish mantiqi' : language === 'ru' ? 'Логика генерации' : 'Generation Logic & Calibration'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3 font-semibold text-cyan-300">timestamp</td>
                <td className="p-3">ISO-8601 String</td>
                <td className="p-3">UTC+5 (Toshkent / Tashkent)</td>
                <td className="p-3 text-slate-300">{language === 'uz' ? 'Soatlik (24s) va kunlik (7 kun / 365 kun) qadamlar' : language === 'ru' ? 'Почасовые (24ч) и суточные (7д) интервалы' : 'Hourly (24h) and daily (7d / 365d) intervals'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-cyan-300">gas_consumption</td>
                <td className="p-3">Float (2 decimals)</td>
                <td className="p-3">mln m³/kun &amp; mln m³/soat</td>
                <td className="p-3 text-slate-300">{language === 'uz' ? 'HDD koeffitsiyenti, aholi faolligi va sanoat indeksi asosida' : language === 'ru' ? 'Базовый спрос с учетом градусо-дней отопления (HDD) и суточных пиков' : 'Base consumption modulated by Heating Degree Days (HDD), diurnal cycles, and economic activity'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-cyan-300">temperature</td>
                <td className="p-3">Float (1 decimal)</td>
                <td className="p-3">°C</td>
                <td className="p-3 text-slate-300">{language === 'uz' ? 'Kontinental iqlimiy mavsumiylik (-6°C dan +38°C gacha)' : language === 'ru' ? 'Резкоконтинентальная сезонность (-6°C зимой до +38°C летом)' : 'Sinusoidal continental seasonality (-6°C winter to +38°C summer) with synoptic weather waves'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-cyan-300">heating_degree_day</td>
                <td className="p-3">Float (1 decimal)</td>
                <td className="p-3">HDD (°C·kun)</td>
                <td className="p-3 text-slate-300">HDD = max(0, 18 - T). {language === 'uz' ? 'Aholi isitish talabini ifodalaydi' : language === 'ru' ? 'Определяет отопительную нагрузку населения' : 'Drives domestic space heating'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Mathematical Modeling */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">
            {language === 'uz' ? '2. Prognozlash Algoritmi va Matematik Formulalar' : language === 'ru' ? '2. Алгоритмы прогнозирования и математические формулы' : '2. Algorithmic Formulation & Forecasting Methodology'}
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'uz'
            ? 'Prognoz talabi quyidagi ko\'p omilli regressiya va sinxronizatsiyalangan additiv komponentlar modeli yordamida hisoblanadi:'
            : language === 'ru'
            ? 'Прогнозируемый спрос рассчитывается по многофакторной аддитивной модели с учетом климатических и циклических коэффициентов:'
            : 'Forecasted gas demand is computed via a multi-factor additive regression model decomposed into distinct physiological and operational components:'}
        </p>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
          <code>
            {`D(t) = D_base · [ 1 + α_temp · HDD(t) + β_diurnal(h) + γ_weekend(d) + δ_scenario ] + ε(t)`}
          </code>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block font-mono">D_base</span>
            <p className="text-slate-400">{language === 'uz' ? 'Hududning normallashtirilgan bazaviy kunlik o\'rtacha gaz iste\'moli (mln m³/kun)' : language === 'ru' ? 'Базовый среднесуточный объем потребления региона (млн м³/сут)' : 'Normalized baseline daily regional demand without weather extremes'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block font-mono">α_temp (0.024 / °C)</span>
            <p className="text-slate-400">{language === 'uz' ? 'Harorat elastiklik koeffitsiyenti: harorat 1°C pasayganda iste\'mol ~2.4% ga oshadi' : language === 'ru' ? 'Коэффициент температурной эластичности (~2.4% прироста на каждый -1°C)' : 'Temperature elasticity factor: every 1°C drop below 18°C elevates domestic heating by ~2.4%'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block font-mono">β_diurnal(h)</span>
            <p className="text-slate-400">{language === 'uz' ? 'Soatlik taqsimot ko\'rsatkichi: 06:00-09:00 va 18:00-21:00 dagi 2 ta cho\'qqi yuklamasi' : language === 'ru' ? 'Суточный профиль: два пика потребления (утренний 06-09 и вечерний 18-21)' : 'Diurnal hourly curve capturing twin morning (06:00-09:00) and evening (18:00-21:00) domestic peaks'}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block font-mono">ε(t) ~ N(0, σ²)</span>
            <p className="text-slate-400">{language === 'uz' ? '95% ishonch oralig\'ini (lower/upper bound) hisoblash uchun Gaus tasodifiy xatolik qoldig\'i' : language === 'ru' ? 'Случайная компонента для расчета 95% доверительного интервала' : 'Stochastic residual term used to construct the 95% confidence prediction bands (±8-12%)'}</p>
          </div>
        </div>
      </section>

      {/* 3. Production Roadmap */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">
            {language === 'uz' ? '3. Ishlab Chiqarish Tizimiga Integratsiya Rejasi (Production Readiness)' : language === 'ru' ? '3. Дорожная карта интеграции в промышленную эксплуатацию' : '3. Integration Pathway to Production Deployment'}
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{language === 'uz' ? '1-bosqich: SCADA Ulanishi' : language === 'ru' ? 'Этап 1: SCADA интеграция' : 'Phase 1: SCADA Ingestion'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {language === 'uz' 
                ? 'OPC-UA va MQTT protokollari orqali gaz hisoblagichlar va kompressor datchiklaridan oqimli telemetriya yig\'ish.'
                : language === 'ru'
                ? 'Подключение потоковой телеметрии газораспределительных станций через OPC-UA и MQTT шины.'
                : 'Direct telemetry ingestion via OPC-UA/MQTT brokers from regional metering stations and compressor hubs.'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{language === 'uz' ? '2-bosqich: ML Pipeline' : language === 'ru' ? 'Этап 2: ML-пайплайн' : 'Phase 2: ML Pipeline'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {language === 'uz'
                ? 'Gradient Boosting (XGBoost / LightGBM) va Temporal Fusion Transformers (TFT) modellarini o\'qitish.'
                : language === 'ru'
                ? 'Развертывание моделей Temporal Fusion Transformer (TFT) и XGBoost с переобучением каждые 24 часа.'
                : 'Continuous model retraining using XGBoost and Temporal Fusion Transformers on rolling 3-year historical load curves.'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{language === 'uz' ? '3-bosqich: Avtomatlashtirilgan Nazorat' : language === 'ru' ? 'Этап 3: Диспетчерский контроль' : 'Phase 3: Advisory Dispatch'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {language === 'uz'
                ? 'Dispetcherlarga quvur tarmog\'idagi bosim va oqimni oldindan optimallashtirish bo\'yicha avtomatlashtirilgan tavsiyalar berish.'
                : language === 'ru'
                ? 'Автоматизированная выдача диспетчерских рекомендаций для балансировки давления в магистральных сетях.'
                : 'Real-time optimization engine recommending optimal linepack packing and compressor throttling schedules.'}
            </p>
          </div>
        </div>
      </section>

      {/* Decision Support Disclaimer Footer */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          {language === 'uz'
            ? 'Eslatma: Ushbu platforma qaror qabul qilishda dispetcherlar va rejalashtiruvchi mutaxassislarga intellektual yordam beruvchi prototip hisoblanadi. U gaz infratuzilmasidagi klapanlar yoki uskunalar ishini bevosita nazorat qilmaydi.'
            : language === 'ru'
            ? 'Примечание: Данная платформа является прототипом системы поддержки принятия решений и не осуществляет прямого автоматического управления запорной арматурой или оборудованием газотранспортной системы.'
            : 'Disclaimer: GASINTEL is a decision-support and forecasting prototype intended for simulation, planning, and situational awareness. It does not exert direct Supervisory Control over physical pipeline valves or operational compressors.'}
        </span>
      </div>
    </div>
  );
};
