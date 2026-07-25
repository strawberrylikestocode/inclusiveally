import React, { useState } from 'react';
import { Memory, MemoryCategory, RetentionRule } from '../types';
import { ShoppingBag, Users, MapPin, Brain, Clock, Tag, Trash2, Archive, Link2, Sparkles, Filter, ChevronDown, Check } from 'lucide-react';

interface MemoryTimelineProps {
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
  onArchiveMemory: (id: string) => void;
  searchQuery: string;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  memories,
  onDeleteMemory,
  onArchiveMemory,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRetention, setSelectedRetention] = useState<string>('all');
  const [minMemoryScore, setMinMemoryScore] = useState<number>(0);

  const getCategoryIcon = (category: MemoryCategory) => {
    switch (category) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'people':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'place':
        return <MapPin className="w-4 h-4 text-purple-400" />;
      case 'decision':
        return <Brain className="w-4 h-4 text-amber-400" />;
    }
  };

  const getCategoryBadgeClass = (category: MemoryCategory) => {
    switch (category) {
      case 'purchase':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'people':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'place':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'decision':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    }
  };

  const formatRetentionLabel = (rule: RetentionRule) => {
    switch (rule) {
      case 'forever': return '🟢 Forever';
      case 'every_grocery': return '🟢 Every Grocery Trip';
      case 'every_vacation': return '🟢 Every Vacation';
      case 'every_doctor': return '🟢 Every Doctor Visit';
      case 'every_winter': return '🟢 Every Winter';
      case 'this_month': return '🟢 This Month';
      case 'this_week': return '🟢 This Week';
      case 'until_completed': return '🟢 Until Completed';
      case 'once': return '🟢 Once Next Time';
    }
  };

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    if (m.isArchived) return false;
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (selectedRetention !== 'all' && m.retentionRule !== selectedRetention) return false;
    if (m.memoryScore < minMemoryScore) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchContent = m.content.toLowerCase().includes(q);
      const matchTags = m.tags.some(t => t.toLowerCase().includes(q));
      const matchTrigger = m.triggerContext.toLowerCase().includes(q);
      return matchTitle || matchContent || matchTags || matchTrigger;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Connected Human Memory Timeline</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                {filteredMemories.length} Memories
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              Not folders. Connected experiences structured around human memory and decision reasoning.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'purchase', label: '🛍 Purchase' },
              { id: 'people', label: '👥 People' },
              { id: 'place', label: '📍 Place' },
              { id: 'decision', label: '🤔 Decision' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 font-semibold'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-stone-300 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-stone-400" /> Retention Filter:
            </span>
            <select
              value={selectedRetention}
              onChange={(e) => setSelectedRetention(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none"
            >
              <option value="all">All Durations</option>
              <option value="forever">Forever Only</option>
              <option value="every_grocery">Every Grocery Trip</option>
              <option value="every_vacation">Every Vacation</option>
              <option value="this_month">This Month</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Min Memory Score:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMemoryScore}
              onChange={(e) => setMinMemoryScore(Number(e.target.value))}
              className="w-24 accent-amber-500 bg-stone-950"
            />
            <span className="font-semibold text-amber-400 min-w-[28px]">{minMemoryScore}+</span>
          </div>
        </div>
      </div>

      {/* Memory Cards Stream */}
      {filteredMemories.length === 0 ? (
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-12 text-center text-stone-400 space-y-3">
          <Brain className="w-10 h-10 text-stone-600 mx-auto" />
          <p className="text-sm font-semibold text-stone-300">No memories matched your filters</p>
          <p className="text-xs text-stone-500">Try clearing your search query or adjusting the retention score threshold.</p>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:left-4 sm:before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-800">
          {filteredMemories.map((mem) => {
            const isHighScore = mem.memoryScore >= 85;

            return (
              <div
                key={mem.id}
                className={`relative pl-10 sm:pl-14 transition-all group ${
                  isHighScore ? 'scale-[1.005]' : ''
                }`}
              >
                {/* Timeline Node Dot */}
                <div
                  className={`absolute left-2 sm:left-4 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-stone-950 z-10 ${
                    isHighScore
                      ? 'border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'border-stone-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isHighScore ? 'bg-amber-400' : 'bg-stone-500'}`} />
                </div>

                {/* Card Container */}
                <div className={`bg-stone-900 border rounded-2xl p-5 shadow-md space-y-3 transition-all hover:border-stone-700 ${
                  isHighScore ? 'border-amber-500/30 bg-gradient-to-r from-stone-900 to-amber-950/20' : 'border-stone-800'
                }`}>
                  {/* Top Line: Category Badge, Title, Score & Duration */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-800/80 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(mem.category)}`}>
                          {getCategoryIcon(mem.category)}
                          <span className="capitalize">{mem.category}</span>
                        </span>

                        {mem.threadTitle && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[11px] border border-stone-700">
                            <Link2 className="w-3 h-3 text-amber-400" />
                            {mem.threadTitle}
                          </span>
                        )}

                        <span className="text-[11px] text-stone-400 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-stone-500" />
                          {mem.triggerContext}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight">
                        {mem.title}
                      </h3>
                    </div>

                    {/* Right Badges: Memory Score & Retention Rule */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-950 text-stone-300 text-xs font-medium border border-stone-800">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {formatRetentionLabel(mem.retentionRule)}
                      </span>

                      <div className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                        isHighScore
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}>
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Score {mem.memoryScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Body */}
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                    {mem.content}
                  </p>

                  {/* Decision Details Box if present */}
                  {mem.decisionDetails && (
                    <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-3.5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-300 flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5" />
                          Choice Outcome: {mem.decisionDetails.choice}
                        </span>
                        {mem.decisionDetails.rating && (
                          <span className="text-stone-400 text-[11px]">
                            Rating: <strong className="text-amber-400">{mem.decisionDetails.rating}/10</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-stone-400">
                        <strong className="text-stone-300">Reasoning:</strong> {mem.decisionDetails.reasoning}
                      </p>
                      {mem.decisionDetails.regrets && (
                        <p className="text-rose-300">
                          <strong>Regrets Note:</strong> {mem.decisionDetails.regrets}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tags & Action Controls */}
                  <div className="pt-2 flex items-center justify-between gap-4 text-xs text-stone-500">
                    <div className="flex flex-wrap gap-1.5">
                      {mem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800/60 text-[11px] text-stone-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onArchiveMemory(mem.id)}
                        title="Archive Memory"
                        className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMemory(mem.id)}
                        title="Delete Memory Instantly (User Ownership)"
                        className="p-1.5 rounded-lg hover:bg-rose-950/50 text-stone-400 hover:text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
