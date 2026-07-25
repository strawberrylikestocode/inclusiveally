import React, { useState } from 'react';
import { X, Sparkles, Brain, Clock, ShieldCheck, Tag, ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle, Mic } from 'lucide-react';
import { Memory, MemoryCategory, RetentionRule } from '../types';
import { analyzeMemoryWithAI } from '../services/api';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: Memory) => void;
  onOpenVoiceRecorder?: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAddMemory, onOpenVoiceRecorder }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('decision');
  const [triggerContext, setTriggerContext] = useState('');
  const [retentionRule, setRetentionRule] = useState<RetentionRule>('forever');
  const [tags, setTags] = useState('');
  
  // Decision details
  const [choice, setChoice] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [rating, setRating] = useState<number>(9);
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiScorePreview, setAiScorePreview] = useState<number | null>(null);
  const [scoreReasoning, setScoreReasoning] = useState<string>('');

  if (!isOpen) return null;

  const handleAIAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMemoryWithAI({
        title: title || content.slice(0, 40),
        content,
        category,
        triggerContext,
      });

      if (result.category) setCategory(result.category);
      if (result.retentionRule) setRetentionRule(result.retentionRule);
      if (result.triggerContext) setTriggerContext(result.triggerContext);
      if (result.memoryScore) setAiScorePreview(result.memoryScore);
      if (result.scoreReasoning) setScoreReasoning(result.scoreReasoning);
      if (result.tags && result.tags.length > 0) setTags(result.tags.join(', '));
      if (result.decisionDetails) {
        if (result.decisionDetails.choice) setChoice(result.decisionDetails.choice);
        if (result.decisionDetails.reasoning) setReasoning(result.decisionDetails.reasoning);
        if (result.decisionDetails.rating) setRating(result.decisionDetails.rating);
        if (result.decisionDetails.wouldRecommend !== undefined) setWouldRecommend(result.decisionDetails.wouldRecommend);
      }
    } catch (e) {
      console.error('Analysis failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      title: title.trim() || content.trim().slice(0, 40) + '...',
      content: content.trim(),
      category,
      memoryScore: aiScorePreview || 80,
      retentionRule,
      triggerContext: triggerContext.trim() || (category === 'purchase' ? 'Shopping' : category === 'place' ? 'Travel / Dining' : 'General'),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      decisionDetails: choice || reasoning ? {
        choice: choice.trim() || title,
        reasoning: reasoning.trim() || content,
        rating,
        wouldRecommend
      } : undefined
    };

    onAddMemory(newMemory);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('decision');
    setTriggerContext('');
    setRetentionRule('forever');
    setTags('');
    setChoice('');
    setReasoning('');
    setAiScorePreview(null);
    setScoreReasoning('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Record Experience / Decision Memory</h3>
              <p className="text-xs text-stone-400">AI evaluates whether Future You will care about this</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-stone-200">
          {/* Quick Presets Guidance */}
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 text-xs text-amber-300/90 flex items-center justify-between gap-2.5">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 font-semibold">Tip:</strong> Write naturally or speak to record memories and schedules!
              </div>
            </div>
            {onOpenVoiceRecorder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoiceRecorder();
                }}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs rounded-lg border border-amber-500/40 flex items-center gap-1.5 whitespace-nowrap transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Use Voice Assistant</span>
              </button>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Memory Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Uniqlo Airism Tee XS Fit Notes or ThinkPad vs Dell Decision"
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-300">
                What happened? (Experience / Reasoning)
              </label>
              <button
                type="button"
                onClick={handleAIAnalyze}
                disabled={isAnalyzing || !content.trim()}
                className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300 disabled:opacity-40 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAnalyzing ? 'Analyzing...' : 'AI Auto-Evaluate'}
              </button>
            </div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. Bought Banana Republic Petite 0 pants. Length is exact fit. Loved the cotton texture. Rated 9/10."
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none resize-none"
              required
            />
          </div>

          {/* AI Score Preview Card if calculated */}
          {aiScorePreview !== null && (
            <div className="bg-stone-950 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-4">
              <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Memory Score</span>
                <span className="text-xl font-bold text-amber-300">{aiScorePreview}<span className="text-xs text-stone-500 font-normal">/100</span></span>
              </div>
              <div className="flex-1 text-xs text-stone-300">
                <p className="font-semibold text-stone-200">AI Evaluation Reason:</p>
                <p className="text-stone-400">{scoreReasoning || 'High score: contains actionable personal preference and future mistake prevention.'}</p>
              </div>
            </div>
          )}

          {/* Four Memory Types Radio Bar */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">
              Human Memory Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'purchase', label: '🛍 Purchase', desc: 'Sizing, specs, returns' },
                { id: 'people', label: '👥 People', desc: 'Names, pets, promises' },
                { id: 'place', label: '📍 Place', desc: 'Food spots, travel, Wi-Fi' },
                { id: 'decision', label: '🤔 Decision', desc: 'Why you chose X over Y' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id as MemoryCategory)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    category === item.id
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] opacity-70">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Memory Duration & Trigger Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Retention Duration */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                How Long to Remember?
              </label>
              <select
                value={retentionRule}
                onChange={(e) => setRetentionRule(e.target.value as RetentionRule)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="forever">🟢 Forever (Core Memory)</option>
                <option value="every_grocery">🟢 Every Grocery Trip</option>
                <option value="every_vacation">🟢 Every Vacation / Beach Trip</option>
                <option value="every_doctor">🟢 Every Doctor's Visit</option>
                <option value="every_winter">🟢 Every Winter</option>
                <option value="this_month">🟢 This Month Only</option>
                <option value="this_week">🟢 This Week Only</option>
                <option value="until_completed">🟢 Until Completed</option>
                <option value="once">🟢 Once Next Time</option>
              </select>
            </div>

            {/* Context Trigger Label */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                Trigger Event Context
              </label>
              <input
                type="text"
                value={triggerContext}
                onChange={(e) => setTriggerContext(e.target.value)}
                placeholder="e.g. Grocery Store, Beach Trip, Pharmacy"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Decision Specific Fields */}
          {category === 'decision' && (
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-3.5 space-y-3">
              <span className="text-xs font-semibold text-amber-300 block">
                🤔 Decision Engine Breakdown (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">What did you choose?</label>
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => setChoice(e.target.value)}
                    placeholder="e.g. ThinkPad X1 Carbon"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Rating (1 to 10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save to MemoryOS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
