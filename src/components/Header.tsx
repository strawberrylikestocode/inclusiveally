import React from 'react';
import { Search, Plus, Mic, Sparkles, Menu, X, Pause, Play } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { LanguageCode, UI_TRANSLATIONS } from '../services/language';

interface HeaderProps {
  activeTab: 'advisor' | 'timeline' | 'preference' | 'triggers' | 'schedule' | 'trust' | 'compare';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenQuickAdd: () => void;
  onOpenVoiceRecorder?: () => void;
  onOpenAccessibilitySuite?: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (o: boolean) => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
}

const TAB_TITLES: Record<string, { titleKey: string; defaultTitle: string; subtitle: string; colorClass: string; badgeText: string }> = {
  advisor: { titleKey: 'advisor', defaultTitle: 'AI Decision Advisor', subtitle: 'Personalized life & preference engine', colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30', badgeText: 'Advisor' },
  compare: { titleKey: 'fit3d', defaultTitle: '3D Fit & Clothing Comparison', subtitle: 'Inclusive body & size simulator', colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30', badgeText: '3D Fit' },
  timeline: { titleKey: 'timeline', defaultTitle: 'Memory Timeline', subtitle: 'Searchable experience & memory log', colorClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', badgeText: 'Timeline' },
  preference: { titleKey: 'preferences', defaultTitle: 'Personal Preferences', subtitle: 'Learned traits, sizes & body profile', colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', badgeText: 'Preferences' },
  triggers: { titleKey: 'calendar', defaultTitle: 'Calendar & Context Reminders', subtitle: 'Calendar tasks & location-activated reminders', colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30', badgeText: 'Calendar' },
  schedule: { titleKey: 'schedule', defaultTitle: 'Decision Schedule', subtitle: 'Upcoming events & decisions', colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30', badgeText: 'Schedule' },
  trust: { titleKey: 'privacy', defaultTitle: 'Trust & Privacy Center', subtitle: 'Encryption, export & memory control', colorClass: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30', badgeText: 'Privacy' },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  onOpenQuickAdd,
  onOpenVoiceRecorder,
  onOpenAccessibilitySuite,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentLanguage,
  onSelectLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
  const currentTab = TAB_TITLES[activeTab] || {
    titleKey: 'advisor',
    defaultTitle: 'InclusiveAlly',
    subtitle: 'Personal Decision Engine',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    badgeText: 'Ally'
  };

  const displayTitle = t[currentTab.titleKey] || currentTab.defaultTitle;

  return (
    <header className="h-14 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100 flex items-center justify-between px-3 sm:px-6 z-20 shrink-0">
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg md:hidden transition-all"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
              {displayTitle}
            </h1>
            {currentTab.colorClass && (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${currentTab.colorClass}`}>
                {currentTab.badgeText}
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-400 leading-none mt-0.5">
            {currentTab.subtitle}
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4 relative">
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-stone-950/70 hover:bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-xl pl-8 pr-7 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-white bg-stone-800 rounded px-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Top Header Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Switcher */}
        <LanguageSelector currentLanguage={currentLanguage} onSelectLanguage={onSelectLanguage} />

        {onOpenAccessibilitySuite && (
          <button
            onClick={onOpenAccessibilitySuite}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-stone-950/80 hover:bg-stone-800 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5"
            title={t.accessibility}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px]">{t.accessibility}</span>
          </button>
        )}

        {onOpenVoiceRecorder && (
          <button
            onClick={onOpenVoiceRecorder}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-stone-950/80 hover:bg-stone-800 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5"
            title={t.voiceNote}
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline text-[11px]">{t.voiceNote}</span>
          </button>
        )}

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden md:inline">{t.recordMemory}</span>
        </button>
      </div>
    </header>
  );
};
