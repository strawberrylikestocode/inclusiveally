import React, { useState } from 'react';
import { Compass, Sparkles, Sun, Moon, Flame, ShieldCheck, RefreshCw, Star, Heart, Activity, CheckCircle2, Info } from 'lucide-react';
import { LanguageCode, UI_TRANSLATIONS } from '../services/language';

interface ZodiacDailyPredictorProps {
  currentLanguage?: LanguageCode;
}

export interface ZodiacSignInfo {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  element: string;
  koreanSajuElement: string;
  indianDashaPlanet: string;
  dailyPrediction: string;
  sajuInsight: string;
  dashaInsight: string;
  luckyColor: string;
  luckyNumber: number;
  oneActionableAdvice: string;
}

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    id: 'aries',
    name: 'Aries (양자리)',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    koreanSajuElement: 'Yang Fire (병화 丙火) - Sunlight & Growth',
    indianDashaPlanet: 'Mars (Mangal) & Sun (Surya) Dasha',
    dailyPrediction: 'High energetic momentum today. You have the drive to initiate new projects or clear backlogged tasks.',
    sajuInsight: 'Saju Harmony: Yang Fire meets today’s Earth branch. High creative vitality, but avoid impulsive financial decisions.',
    dashaInsight: 'Vedic Dasha: Mars influence amplifies leadership. Channel energy into structured physical routines or focused project work.',
    luckyColor: 'Crimson Red',
    luckyNumber: 9,
    oneActionableAdvice: 'Pause for 5 deep breaths before replying to challenging emails today; channel your Mars energy into constructive action rather than reactive speed.'
  },
  {
    id: 'taurus',
    name: 'Taurus (황소자리)',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    koreanSajuElement: 'Yin Earth (기토 己土) - Fertile Soil & Stability',
    indianDashaPlanet: 'Venus (Shukra) & Moon (Chandra) Dasha',
    dailyPrediction: 'A steady, harmonious day ideal for organizing personal finances, aesthetic upgrades, and peaceful interactions.',
    sajuInsight: 'Saju Harmony: Stable Earth element grounds today’s fluctuating influences. Excellent for long-term planning.',
    dashaInsight: 'Vedic Dasha: Venus dasha brings charm and diplomacy. Relationships flourish through patient, active listening.',
    luckyColor: 'Emerald Green',
    luckyNumber: 6,
    oneActionableAdvice: 'Dedicate 15 minutes today to organize your physical workspace or personal budget to unlock mental clarity for the rest of the week.'
  },
  {
    id: 'gemini',
    name: 'Gemini (쌍둥이자리)',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    koreanSajuElement: 'Yang Metal (경금 庚金) - Sharp Intellect & Precision',
    indianDashaPlanet: 'Mercury (Budha) Dasha',
    dailyPrediction: 'Your communication skills are peak today. Ideal for negotiating, networking, and learning complex concepts.',
    sajuInsight: 'Saju Harmony: Metal and Wood interaction stimulates witty problem solving. Keep notes as brilliant ideas will surface quickly.',
    dashaInsight: 'Vedic Dasha: Mercury Dasha boosts analytical acuity. Double-check small details in legal or financial agreements.',
    luckyColor: 'Bright Yellow',
    luckyNumber: 5,
    oneActionableAdvice: 'Focus on finishing one primary task completely before switching gears, preventing multi-tasking overload.'
  },
  {
    id: 'cancer',
    name: 'Cancer (게자리)',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    koreanSajuElement: 'Yin Water (계수 癸水) - Gentle Rain & Intuition',
    indianDashaPlanet: 'Moon (Chandra) & Jupiter (Guru) Dasha',
    dailyPrediction: 'Heightened emotional intelligence and strong intuitive signals regarding family, health, and close allies.',
    sajuInsight: 'Saju Harmony: Yin Water nurtures today’s Wood branch. Emotional depth provides deep wisdom for personal decisions.',
    dashaInsight: 'Vedic Dasha: Chandra-Guru dasha brings protective, maternal guidance. Prioritize self-care and nourishing meals.',
    luckyColor: 'Pearl Silver',
    luckyNumber: 2,
    oneActionableAdvice: 'Set a firm boundary around your evening downtime to recharge your energy without absorbing others’ emotional stress.'
  },
  {
    id: 'leo',
    name: 'Leo (사자자리)',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    koreanSajuElement: 'Yang Fire (병화 丙火) - Radiant Sun & Leadership',
    indianDashaPlanet: 'Sun (Surya) Dasha',
    dailyPrediction: 'Radiant charisma and clear executive decision-making. People look to you for direction and inspiration.',
    sajuInsight: 'Saju Harmony: Strong Fire presence enhances visibility and social confidence. Perfect for presentations or pitch meetings.',
    dashaInsight: 'Vedic Dasha: Surya Dasha brings authority and recognition. Lead with generosity and modesty.',
    luckyColor: 'Gold / Amber',
    luckyNumber: 1,
    oneActionableAdvice: 'Genuinely compliment a teammate or family member today; your warmth will amplify mutual trust and elevate everyone’s spirits.'
  },
  {
    id: 'virgo',
    name: 'Virgo (처녀자리)',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    koreanSajuElement: 'Yin Wood (을목 乙木) - Adaptive Vine & Care',
    indianDashaPlanet: 'Mercury (Budha) & Saturn (Shani) Dasha',
    dailyPrediction: 'Precision and practical organization reign supreme. You will spot details that others overlook.',
    sajuInsight: 'Saju Harmony: Yin Wood flexibility helps navigate unexpected schedule changes smoothly without losing efficiency.',
    dashaInsight: 'Vedic Dasha: Shani-Budha combination favors disciplined, structured work and methodical health habits.',
    luckyColor: 'Navy Blue',
    luckyNumber: 4,
    oneActionableAdvice: 'Release perfectionist expectations on a minor task and declare it "good enough" so you can protect your peace of mind.'
  },
  {
    id: 'libra',
    name: 'Libra (천칭자리)',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    koreanSajuElement: 'Yin Metal (신금 辛金) - Refined Gem & Harmony',
    indianDashaPlanet: 'Venus (Shukra) Dasha',
    dailyPrediction: 'A balanced day centered around partnership, fairness, aesthetic choices, and conflict resolution.',
    sajuInsight: 'Saju Harmony: Yin Metal brings polished grace to tough conversations. Compromise brings unexpected benefits.',
    dashaInsight: 'Vedic Dasha: Shukra Dasha enhances artistic judgment and harmonious teamwork.',
    luckyColor: 'Rose Pink',
    luckyNumber: 7,
    oneActionableAdvice: 'Make one pending decision today that you have been weighing back and forth; trust your innate sense of balance.'
  },
  {
    id: 'scorpio',
    name: 'Scorpio (전갈자리)',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    koreanSajuElement: 'Yang Water (임수 壬水) - Deep Ocean & Transformation',
    indianDashaPlanet: 'Ketu & Mars (Mangal) Dasha',
    dailyPrediction: 'Deep perceptual focus and transformative breakthroughs. Uncover hidden opportunities beneath the surface.',
    sajuInsight: 'Saju Harmony: Powerful Yang Water element grants strong resilience and strategic insight. Keep long-term goals private.',
    dashaInsight: 'Vedic Dasha: Ketu-Mangal period sharpens research and investigation. Trust your gut instincts over superficial gossip.',
    luckyColor: 'Deep Burgundy',
    luckyNumber: 8,
    oneActionableAdvice: 'Direct your intense focus toward solving one complex root problem rather than spreading your attention thin.'
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius (사수자리)',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    koreanSajuElement: 'Yang Wood (갑목 甲木) - Mighty Oak & Expansion',
    indianDashaPlanet: 'Jupiter (Guru) Dasha',
    dailyPrediction: 'Optimistic horizon expanding! Great day for travel planning, philosophy, high-level strategy, and mentorship.',
    sajuInsight: 'Saju Harmony: Yang Wood energy strives upward. Seek big-picture clarity before diving into tedious paperwork.',
    dashaInsight: 'Vedic Dasha: Guru Dasha bestows wisdom and ethical guidance. Opportunities come through teaching or sharing knowledge.',
    luckyColor: 'Royal Purple',
    luckyNumber: 3,
    oneActionableAdvice: 'Take 20 minutes to read or research a topic completely outside your usual field to spark fresh inspiration.'
  },
  {
    id: 'capricorn',
    name: 'Capricorn (염소자리)',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    koreanSajuElement: 'Yang Earth (무토 戊土) - Majestic Mountain & Endurance',
    indianDashaPlanet: 'Saturn (Shani) Dasha',
    dailyPrediction: 'Rock-solid determination and executive mastery. Long-term goals receive a significant boost forward.',
    sajuInsight: 'Saju Harmony: Yang Earth mountain element gives unwavering composure during high-pressure moments.',
    dashaInsight: 'Vedic Dasha: Shani Dasha rewards patience and systemic discipline. Slow and steady wins the prize today.',
    luckyColor: 'Slate Gray',
    luckyNumber: 10,
    oneActionableAdvice: 'Acknowledge one milestone you have already achieved this month before pushing ahead to the next mountain peak.'
  },
  {
    id: 'aquarius',
    name: 'Aquarius (물병자리)',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    koreanSajuElement: 'Yang Water (임수 壬水) - Flowing River & Innovation',
    indianDashaPlanet: 'Rahu & Saturn (Shani) Dasha',
    dailyPrediction: 'Innovative, forward-thinking solutions. You will find unconventional remedies for recurring hurdles.',
    sajuInsight: 'Saju Harmony: Water flowing freely inspires inventive technology and humanitarian ideas.',
    dashaInsight: 'Vedic Dasha: Rahu influence breaks outdated paradigms. Embrace new tools, apps, or social networks.',
    luckyColor: 'Electric Cyan',
    luckyNumber: 11,
    oneActionableAdvice: 'Share a unique idea with a friend or colleague today — your unconventional perspective holds the exact key they need.'
  },
  {
    id: 'pisces',
    name: 'Pisces (물고기자리)',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    koreanSajuElement: 'Yin Water (계수 癸水) - Dewdrop & Empathy',
    indianDashaPlanet: 'Jupiter (Guru) & Moon (Chandra) Dasha',
    dailyPrediction: 'Imagative creativity, compassion, and deep artistic flow. Excellent for music, design, and emotional bonding.',
    sajuInsight: 'Saju Harmony: Yin Water merges gently with surroundings. High empathy allows seamless connection with loved ones.',
    dashaInsight: 'Vedic Dasha: Guru-Chandra combination brings spiritual protection and peace of mind.',
    luckyColor: 'Seafoam Teal',
    luckyNumber: 12,
    oneActionableAdvice: 'Engage in a 10-minute mindfulness or music session to ground your imagination into peaceful focus.'
  },
];

export const ZodiacDailyPredictor: React.FC<ZodiacDailyPredictorProps> = ({ currentLanguage = 'en' }) => {
  const [selectedSignId, setSelectedSignId] = useState<string>('aries');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [customAiAdvice, setCustomAiAdvice] = useState<string | null>(null);

  const selectedSign = ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  const handleRefreshAiInsight = async () => {
    setIsGeneratingAi(true);
    try {
      // Simulate or call AI prediction
      const prompt = `Provide a daily prediction for Zodiac sign ${selectedSign.name} incorporating Korean Saju element (${selectedSign.koreanSajuElement}) and Indian Vedic Dasha (${selectedSign.indianDashaPlanet}). Give 1 specific actionable advice to improve today.`;
      
      const response = await fetch('/api/personal-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          memories: [],
          preferenceGraph: {},
          simulatedTrigger: 'Daily Horoscope & Saju Dasha',
          language: currentLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          setCustomAiAdvice(data.answer);
        }
      }
    } catch (e) {
      console.error('Error generating AI horoscope:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Zodiac & Saju & Indian Dasha Daily Forecast</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Daily Celestial Alignment & 1 Key Advice</span>
          </h3>
          <p className="text-xs text-stone-400">
            Combining Western Zodiac, Korean Saju (사주팔자 5 Elements), and Indian Vimshottari Dashas.
          </p>
        </div>

        <button
          onClick={handleRefreshAiInsight}
          disabled={isGeneratingAi}
          className="self-start sm:self-auto px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isGeneratingAi ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAi ? 'Reading Stars...' : 'Refresh AI Reading'}</span>
        </button>
      </div>

      {/* Zodiac Sign Selector Pills */}
      <div>
        <label className="block text-[11px] font-bold text-amber-300/80 uppercase tracking-wider mb-2">
          Select Your Zodiac Sign:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = sign.id === selectedSignId;
            return (
              <button
                key={sign.id}
                onClick={() => {
                  setSelectedSignId(sign.id);
                  setCustomAiAdvice(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-stone-950/80 text-stone-300 border-stone-800 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <span className="text-sm">{sign.symbol}</span>
                <span>{sign.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Zodiac Forecast Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Sign Card */}
        <div className="lg:col-span-1 bg-stone-950/90 border border-stone-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-5xl opacity-10 select-none text-amber-400 font-serif">
            {selectedSign.symbol}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedSign.symbol}</span>
              <h4 className="text-lg font-extrabold text-white">{selectedSign.name}</h4>
            </div>
            <p className="text-xs text-amber-400 font-medium">{selectedSign.dates}</p>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-stone-800/80">
            <div className="flex justify-between items-center text-stone-300">
              <span className="text-stone-500">Western Element:</span>
              <span className="font-bold text-amber-300">{selectedSign.element}</span>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span className="text-stone-500">Lucky Color:</span>
              <span className="font-bold text-emerald-300">{selectedSign.luckyColor}</span>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span className="text-stone-500">Lucky Number:</span>
              <span className="font-bold text-purple-300">{selectedSign.luckyNumber}</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs space-y-1">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Daily Focus
            </span>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              {selectedSign.dailyPrediction}
            </p>
          </div>
        </div>

        {/* Saju & Dasha Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Korean Saju Card */}
            <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <Flame className="w-4 h-4 text-red-400" />
                <span>Korean Saju (사주팔자 5 Elements)</span>
              </div>
              <p className="text-[11px] font-semibold text-stone-200">
                {selectedSign.koreanSajuElement}
              </p>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                {selectedSign.sajuInsight}
              </p>
            </div>

            {/* Indian Dasha Card */}
            <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Sun className="w-4 h-4 text-cyan-400" />
                <span>Indian Vimshottari Dasha</span>
              </div>
              <p className="text-[11px] font-semibold text-stone-200">
                {selectedSign.indianDashaPlanet}
              </p>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                {selectedSign.dashaInsight}
              </p>
            </div>
          </div>

          {/* Golden Highlight: ONE Actionable Advice to Improve Your Day */}
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-stone-950 border border-amber-500/40 p-4 rounded-xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <h4 className="text-sm font-extrabold text-amber-300 uppercase tracking-wide">
                  1 Key Advice to Improve Your Day
                </h4>
              </div>
              <span className="text-[10px] bg-amber-500/30 text-amber-200 font-bold px-2 py-0.5 rounded border border-amber-500/40">
                Actionable Daily Step
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-100 font-medium leading-relaxed pl-7">
              "{customAiAdvice ? customAiAdvice : selectedSign.oneActionableAdvice}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
