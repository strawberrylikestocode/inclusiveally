import React, { useState } from 'react';
import { Sparkles, Brain, Shirt, Utensils, Compass, ShoppingCart, Send, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw, Layers } from 'lucide-react';
import { Memory, PreferenceGraph, DecisionQueryResponse } from '../types';
import { askPersonalDecisionEngine } from '../services/api';

import { LanguageCode } from '../services/language';
import { ZodiacDailyPredictor } from './ZodiacDailyPredictor';

interface DecisionAdvisorProps {
  memories: Memory[];
  preferenceGraph: PreferenceGraph;
  currentLanguage?: LanguageCode;
}

export const DecisionAdvisor: React.FC<DecisionAdvisorProps> = ({ memories, preferenceGraph, currentLanguage = 'en' }) => {
  const [showExplanation, setShowExplanation] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTrigger, setActiveTrigger] = useState<string>('General');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DecisionQueryResponse | null>({
    answer: "I've analyzed your body measurements (5'2\", Petite 0), past clothing fit logs, brand experiences, dining history, and travel habits. Ask me anything—I answer based on YOUR life, not generic search results!",
    recommendations: [
      "Ask: 'I need business casual pants' → Evaluates your 0 Petite waist & Zara length warning",
      "Ask: 'Where should I eat sushi?' → Checks quiet atmospheres & Tonkotsu ramen spots",
      "Ask: 'Planning a beach trip' → Generates custom packing list including items you previously forgot"
    ],
    memoriesUsed: memories.slice(0, 3).map(m => ({
      id: m.id,
      title: m.title,
      score: m.memoryScore,
      relevanceReason: 'Matched preference graph and body fit notes'
    })),
    preferenceHighlights: [
      `Body fit: 5'2", Petite 0 (Banana Republic = exact match)`,
      `Food: Loves Tonkotsu broth & quiet booths (>20 min wait avoided)`,
      `Travel: Packing mandatory: 10,000mAh Anker charger + SPF 50 sunscreen`
    ]
  });

  const PRESET_QUESTIONS = [
    { label: '👖 Business Casual Pants', query: 'I need business casual pants that fit my body proportions well.', trigger: 'Browsing Clothes' },
    { label: '🍣 Sushi / Ramen for Me', query: 'Where should I go for dinner tonight?', trigger: 'Dining Out' },
    { label: '🏖 Beach Trip Packing List', query: 'I am planning a beach trip. What should I pack based on past trips?', trigger: 'Beach Trip / Travel' },
    { label: '🛒 Grocery Store Reminders', query: 'What should I buy or remember at the grocery store today?', trigger: 'Grocery Store' },
    { label: '💻 Should I buy a new laptop?', query: 'I am thinking about buying a new laptop. What should I consider based on my past purchases?', trigger: 'Buying Electronics' },
  ];

  const handleAsk = async (textToAsk?: string, triggerLabel?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    if (triggerLabel) setActiveTrigger(triggerLabel);

    setIsLoading(true);
    try {
      const res = await askPersonalDecisionEngine(q, memories, preferenceGraph, triggerLabel || activeTrigger, currentLanguage);
      setResponse(res);
    } catch (e) {
      console.error('Error asking advisor:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top App Overview & Explanation Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3.5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>About InclusiveAlly Assistant</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Your Everyday & Accessible Decision Companion
              </h2>
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-stone-400 hover:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-950/60 border border-stone-800 hover:border-amber-500/40 transition-all shrink-0"
            >
              {showExplanation ? 'Hide Overview' : 'Show Overview'}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            <strong>InclusiveAlly</strong> is built for <strong>everyone</strong> — helping regular people make smarter daily decisions, manage <strong>project scheduling</strong>, and <strong>remember important details & past experiences</strong>, while offering specialized support for <strong>people with disabilities</strong> (including adaptive clothing, sensory preferences, mobility needs, and custom body proportions).
          </p>

          {showExplanation && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-amber-500/20 text-xs">
              <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Brain className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1. Memory & Decision Advisor</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-snug">
                  Smart AI guidance that helps you remember key preferences, past choices, dining options, and shopping details.
                </p>
              </div>

              <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Shirt className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>2. 3D Fit Visualizer</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-snug">
                  Paste product links & sizes to preview clothing fit on your custom 3D mannequin before buying.
                </p>
              </div>

              <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>3. Adaptive & Fit Profile</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-snug">
                  Save body measurements, adaptive clothing features, sensory sensitivities, and mobility needs.
                </p>
              </div>

              <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>4. Calendar & Scheduling</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-snug">
                  Manage project scheduling, task deadlines, and location-triggered reminders effortlessly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zodiac & Saju & Indian Dasha Daily Forecast */}
      <ZodiacDailyPredictor currentLanguage={currentLanguage} />

      {/* Minimalist Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              <span>InclusiveAlly Decision Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Personalized Advisor
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              Considers your body measurements (5'2", Petite 0), clothing fit history, food preferences, and travel items.
            </p>
          </div>

          {/* Quick Body Profile Badge */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs space-y-1 min-w-[220px]">
            <div className="flex items-center justify-between font-semibold text-stone-300 border-b border-stone-800 pb-1 text-[11px]">
              <span className="flex items-center gap-1 text-amber-400">
                <Shirt className="w-3.5 h-3.5" />
                Active Fit Graph
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Active</span>
            </div>
            <p className="text-stone-400 text-[11px]"><strong className="text-stone-300">Body:</strong> {preferenceGraph?.bodyProfile?.height || "5'2\""}, {preferenceGraph?.bodyProfile?.weight || "118 lbs"} ({preferenceGraph?.bodyProfile?.bodyType || "Petite"})</p>
            <p className="text-stone-400 text-[11px]"><strong className="text-stone-300">Sizes:</strong> Top {preferenceGraph?.bodyProfile?.topSize || "XS"} | Bottom {preferenceGraph?.bodyProfile?.bottomSize || "0 Petite"}</p>
          </div>
        </div>

        {/* Preset Question Pills */}
        <div className="mt-4 pt-3 border-t border-stone-800/80">
          <span className="text-[11px] font-medium text-stone-400 block mb-2">
            Quick Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(pq.query);
                  handleAsk(pq.query, pq.trigger);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-stone-300 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <span>{pq.label}</span>
                <ArrowRight className="w-3 h-3 text-amber-400 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="font-semibold text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Ask Recall Decision Engine
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500">Context Trigger:</span>
            <select
              value={activeTrigger}
              onChange={(e) => setActiveTrigger(e.target.value)}
              className="bg-stone-950 border border-stone-800 text-amber-300 text-xs rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="General">🌐 General</option>
              <option value="Browsing Clothes">👔 Browsing Clothes</option>
              <option value="Dining Out">🍣 Dining Out</option>
              <option value="Beach Trip / Travel">🏖 Beach Trip / Travel</option>
              <option value="Grocery Store">🛒 Grocery Store</option>
              <option value="Buying Electronics">💻 Buying Electronics</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g., 'What sushi spot should I go to?', 'Recommend business casual pants', 'Should I buy this $1200 laptop?'"
            className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-xl pl-4 pr-24 py-3 text-sm text-white placeholder-stone-500 focus:outline-none"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
            ) : (
              <>
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Decision Output Card */}
      {response && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Answer Headline */}
          <div className="space-y-3 border-b border-stone-800 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                Personalized Recommendation
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-medium border border-amber-500/20">
                Tailored for You
              </span>
            </div>
            <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-normal">
              {response.answer}
            </p>
          </div>

          {/* Actionable Recommendations List */}
          {response.recommendations && response.recommendations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Personal Recommendations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {response.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 text-xs text-stone-200 flex items-start gap-2.5 shadow-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings & Past Regrets to Avoid */}
          {response.warningsOrRegrets && response.warningsOrRegrets.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-rose-300 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Past Regrets & Warning Alerts
              </h3>
              <ul className="space-y-1.5 text-xs text-rose-200/90 list-disc list-inside">
                {response.warningsOrRegrets.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Memories & Graph Context Used */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-800/80">
            {/* Memories Referenced */}
            <div className="bg-stone-950/80 rounded-xl p-4 border border-stone-800/80">
              <h4 className="text-xs font-semibold text-stone-300 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Stored Memories Referenced ({response.memoriesUsed.length})
              </h4>
              <div className="space-y-2">
                {response.memoriesUsed.map((mem, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-stone-200 font-medium">
                      <span className="truncate">{mem.title}</span>
                      <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.5 bg-amber-500/10 rounded">
                        Score {mem.score}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">{mem.relevanceReason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preference Highlights */}
            <div className="bg-stone-950/80 rounded-xl p-4 border border-stone-800/80">
              <h4 className="text-xs font-semibold text-stone-300 mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                Preference Graph Factors
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                {response.preferenceHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-stone-900 p-2 rounded-lg border border-stone-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
