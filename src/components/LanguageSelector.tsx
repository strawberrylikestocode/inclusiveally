import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode, LanguageOption } from '../services/language';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 bg-stone-950/80 hover:bg-stone-800 text-stone-200 font-semibold text-xs rounded-xl border border-stone-700/80 hover:border-amber-500/50 transition-all shadow-sm focus:outline-none ${
          compact ? 'p-1.5' : 'px-2.5 py-1.5'
        }`}
        title="Change App Language"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-base leading-none">{selectedOption.flag}</span>
        {!compact && <span className="hidden sm:inline text-xs font-bold">{selectedOption.nativeName}</span>}
        <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-stone-900 border border-stone-700 shadow-2xl z-50 py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-stone-800/80 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              App Language
            </span>
            <span className="text-[10px] text-stone-400 font-mono">7 Languages</span>
          </div>

          <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
            {SUPPORTED_LANGUAGES.map((lang: LanguageOption) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-500/10 transition-all ${
                    isSelected ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-semibold">{lang.nativeName}</span>
                      <span className="text-[10px] text-stone-400">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
