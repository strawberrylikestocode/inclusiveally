import React, { useState } from 'react';
import { ScheduledEvent, Memory, PreferenceGraph } from '../types';
import { Calendar, Clock, MapPin, Sparkles, Plus, CheckCircle2, AlertCircle, Trash2, Tag, Shirt, ShoppingCart, Compass, Laptop, Pill, HeartPulse, Mic, Filter, ArrowUpDown } from 'lucide-react';

interface SchedulePlannerViewProps {
  scheduledEvents: ScheduledEvent[];
  onAddScheduledEvent: (event: ScheduledEvent) => void;
  onToggleCompleteEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  memories: Memory[];
  graph: PreferenceGraph;
  onOpenVoiceRecorder?: () => void;
}

export const SchedulePlannerView: React.FC<SchedulePlannerViewProps> = ({
  scheduledEvents,
  onAddScheduledEvent,
  onToggleCompleteEvent,
  onDeleteEvent,
  memories,
  graph,
  onOpenVoiceRecorder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'category'>('date');

  // New Event Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [category, setCategory] = useState<'grocery' | 'clothing' | 'travel' | 'health' | 'tech' | 'general'>('grocery');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'grocery': return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'clothing': return <Shirt className="w-4 h-4 text-amber-400" />;
      case 'travel': return <Compass className="w-4 h-4 text-blue-400" />;
      case 'tech': return <Laptop className="w-4 h-4 text-purple-400" />;
      case 'health': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      default: return <Calendar className="w-4 h-4 text-amber-400" />;
    }
  };

  const getDateBadge = (eventDate: string, isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
          ✓ COMPLETED
        </span>
      );
    }

    if (eventDate === todayStr) {
      return (
        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold animate-pulse">
          ⚡ DUE TODAY
        </span>
      );
    }

    const todayDate = new Date(todayStr);
    const evtDateObj = new Date(eventDate);
    const diffDays = Math.ceil((evtDateObj.getTime() - todayDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      return (
        <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
          📅 TOMORROW
        </span>
      );
    } else if (diffDays > 1) {
      return (
        <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700 text-[10px] font-medium">
          IN {diffDays} DAYS
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
          PAST DATE
        </span>
      );
    }
  };

  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Scan memories to auto-attach relevant past context
    const matchingMems = memories.filter((m) => {
      const text = (m.title + ' ' + m.content + ' ' + m.triggerContext).toLowerCase();
      const q = (title + ' ' + category + ' ' + location).toLowerCase();
      return text.split(' ').some((word) => word.length > 3 && q.includes(word));
    });

    const autoAttached = matchingMems.slice(0, 2).map((m) => ({
      id: m.id,
      title: m.title,
      memoryScore: m.memoryScore,
      tip: m.decisionDetails?.reasoning || m.content.slice(0, 100) + '...',
    }));

    let advice = `Scheduled for ${date} at ${time}. `;
    if (category === 'clothing') {
      advice += `Recall recommends target sizes: ${graph.bodyProfile.topSize} top, ${graph.bodyProfile.bottomSize} bottoms (${graph.bodyProfile.fitPreferences[0] || 'Short inseam'}).`;
    } else if (category === 'travel') {
      advice += `Recall auto-checking packing checklist: Remember ${graph.travelPreferences.packingMusts.slice(0, 2).join(' & ')}.`;
    } else if (category === 'grocery') {
      advice += `Recall reminder: Check oat milk preference (${graph.foodPreferences.dislikes[0] ? 'Avoid ' + graph.foodPreferences.dislikes[0] : 'Fresh produce'}).`;
    } else {
      advice += `Recall memory context loaded for personalized decision making.`;
    }

    const newEvent: ScheduledEvent = {
      id: `sched-${Date.now()}`,
      title,
      date,
      time,
      category,
      location: location || undefined,
      notes: notes || undefined,
      isCompleted: false,
      autoAttachedMemories: autoAttached,
      personalizedAdvice: advice,
    };

    onAddScheduledEvent(newEvent);
    setIsModalOpen(false);
    // Reset Form
    setTitle('');
    setLocation('');
    setNotes('');
  };

  // Filter & Sort Events
  const filteredEvents = scheduledEvents
    .filter((e) => {
      if (activeCategoryFilter !== 'all' && e.category !== activeCategoryFilter) return false;

      if (dateFilter === 'today') return e.date === todayStr && !e.isCompleted;
      if (dateFilter === 'upcoming') return e.date >= todayStr && !e.isCompleted;
      if (dateFilter === 'completed') return e.isCompleted;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return a.date.localeCompare(b.date);
      }
      return a.category.localeCompare(b.category);
    });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalized Schedule & Decision Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Personalized <span className="text-amber-400">Schedule & Dates</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Plan your upcoming trips, shopping runs, or health checkups. Recall automatically attaches your sizing rules, packing lessons, and past regrets to every date.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onOpenVoiceRecorder && (
              <button
                onClick={onOpenVoiceRecorder}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 shadow-md transition-all flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Voice Assistant</span>
              </button>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule New Event</span>
            </button>
          </div>
        </div>

        {/* Date Timeline Filters & Sorting */}
        <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              Date:
            </span>
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'today', label: '⚡ Today' },
              { id: 'upcoming', label: '📅 Upcoming' },
              { id: 'completed', label: '✓ Completed' },
            ].map((df) => (
              <button
                key={df.id}
                onClick={() => setDateFilter(df.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                  dateFilter === df.id
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-950 border border-stone-800 text-xs font-medium text-stone-200 rounded-xl px-2.5 py-1 focus:outline-none"
            >
              <option value="date">Soonest Date</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'grocery', label: '🛒 Grocery Runs' },
            { id: 'travel', label: '🏖 Travel & Trips' },
            { id: 'clothing', label: '👕 Clothing Shopping' },
            { id: 'tech', label: '💻 Tech Purchases' },
            { id: 'health', label: '🩺 Health & Care' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap border ${
                activeCategoryFilter === cat.id
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 text-center text-stone-500 space-y-3">
            <Calendar className="w-8 h-8 text-stone-600 mx-auto" />
            <p className="text-sm font-medium text-stone-300">No scheduled events match this filter.</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Schedule your next shopping trip, vacation, or review and let Recall prepare your personal memory context.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs rounded-xl transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule an Event</span>
            </button>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isDone = evt.isCompleted;

            return (
              <div
                key={evt.id}
                className={`bg-stone-900 border rounded-2xl p-5 shadow-lg transition-all space-y-4 ${
                  isDone
                    ? 'border-stone-800/60 opacity-60 bg-stone-950/40'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Event Header */}
                <div className="flex items-start justify-between gap-4 border-b border-stone-800/80 pb-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleCompleteEvent(evt.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors mt-0.5 flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-stone-950'
                          : 'border-stone-700 hover:border-amber-400 bg-stone-950'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-base font-bold ${isDone ? 'line-through text-stone-500' : 'text-white'}`}>
                          {evt.title}
                        </span>
                        {getDateBadge(evt.date, isDone)}
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-950 border border-stone-800 text-[10px] font-semibold text-stone-300 uppercase flex items-center gap-1.5">
                          {getCategoryIcon(evt.category)}
                          <span>{evt.category}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap">
                        <div className="flex items-center gap-1 font-semibold text-stone-200">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{evt.date}</span>
                        </div>
                        {evt.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{evt.time}</span>
                          </div>
                        )}
                        {evt.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span>{evt.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteEvent(evt.id)}
                    className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
                    title="Delete scheduled event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {evt.notes && (
                  <p className="text-xs text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <strong className="text-stone-400">Notes:</strong> {evt.notes}
                  </p>
                )}

                {/* Recall AI Advice Box */}
                {evt.personalizedAdvice && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200">
                      <span className="font-bold text-amber-300 block mb-0.5">Recall Decision Optimization:</span>
                      <p>{evt.personalizedAdvice}</p>
                    </div>
                  </div>
                )}

                {/* Auto-Attached Memories Context */}
                {evt.autoAttachedMemories && evt.autoAttachedMemories.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      Auto-Surfaced Memory Lessons ({evt.autoAttachedMemories.length})
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {evt.autoAttachedMemories.map((att) => (
                        <div key={att.id} className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-200 truncate">{att.title}</span>
                            <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.5 bg-amber-500/10 rounded">
                              Score {att.memoryScore}
                            </span>
                          </div>
                          <p className="text-stone-400 text-[11px] line-clamp-2">{att.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Event Modal with Quick Date Presets */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Schedule Personalized Decision Event
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1 font-semibold">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Grocery Run at Costco, Miami Beach Vacation, Uniqlo Shopping"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Date Selector with Quick Presets */}
              <div className="space-y-1.5">
                <label className="text-stone-300 block font-semibold">Date Selection</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setQuickDate(0)}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold rounded-lg border border-stone-700"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(1)}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold rounded-lg border border-stone-700"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(3)}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold rounded-lg border border-stone-700"
                  >
                    In 3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(7)}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold rounded-lg border border-stone-700"
                  >
                    Next Week
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="09:00 AM">🌅 09:00 AM (Morning)</option>
                      <option value="11:30 AM">☀️ 11:30 AM (Midday)</option>
                      <option value="02:30 PM">🌤️ 02:30 PM (Afternoon)</option>
                      <option value="06:30 PM">🌆 06:30 PM (Evening)</option>
                      <option value="09:00 PM">🌙 09:00 PM (Night)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="grocery">Grocery Run</option>
                    <option value="clothing">Clothing Shopping</option>
                    <option value="travel">Travel & Vacation</option>
                    <option value="tech">Tech Purchase</option>
                    <option value="health">Health & Doctor</option>
                    <option value="general">General Decision</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Location (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Costco Brooklyn, SoHo"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-semibold">Notes / Goals</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Looking for workwear blazers or buying oat milk..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Schedule & Auto-Attach Memory Context</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
