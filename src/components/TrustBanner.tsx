import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import { Language, TRANSLATIONS } from '../services/i18n';

interface TrustBannerProps {
  onNavigateToMethodology: () => void;
  language: Language;
}

export const TrustBanner: React.FC<TrustBannerProps> = ({ onNavigateToMethodology, language }) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const t = TRANSLATIONS[language];

  if (dismissed) {
    return null;
  }

  return (
    <aside aria-label="Prototype Data Disclaimer" className="bg-slate-900/95 border-b border-amber-500/20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-300 uppercase tracking-wide shrink-0 text-[11px]">
              {t.prototype_notice}
            </span>
            <span className="text-slate-400 truncate text-[11px] hidden md:inline">
              {t.prototype_disclaimer}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 transition-colors cursor-pointer text-[11px]"
            >
              <span>{expanded ? t.hide_details : t.data_provenance}</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              onClick={onNavigateToMethodology}
              className="hidden sm:inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-medium transition-colors cursor-pointer text-[11px]"
            >
              <span>{t.methodology_link}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Yopish / Закрыть / Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400 grid sm:grid-cols-3 gap-2.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/90">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200 block text-xs">{t.banner_point1_title}</span>
              <p className="leading-relaxed text-[11px]">{t.banner_point1_desc}</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200 block text-xs">{t.banner_point2_title}</span>
              <p className="leading-relaxed text-[11px]">{t.banner_point2_desc}</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200 block text-xs">{t.banner_point3_title}</span>
              <p className="leading-relaxed text-[11px]">{t.banner_point3_desc}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
