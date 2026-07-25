import React, { useState } from 'react';
import { Memory, ContextTrigger } from '../types';
import { ShoppingCart, Sun, Shirt, Laptop, Pill, Zap, CheckCircle2, AlertCircle, ArrowRight, Clock, Plus, ListTodo, CheckSquare, Trash2, Tag, Calendar } from 'lucide-react';

interface ContextTriggersViewProps {
  triggers: ContextTrigger[];
  memories: Memory[];
  onQuickToggleComplete?: (memoryId: string) => void;
}

interface CustomTodoItem {
  id: string;
  title: string;
  context: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  linkedMemoryId?: string;
}

export const ContextTriggersView: React.FC<ContextTriggersViewProps> = ({
  triggers,
  memories,
  onQuickToggleComplete,
}) => {
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>('all');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Custom added To-Do tasks
  const [customTodos, setCustomTodos] = useState<CustomTodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('recall_custom_todos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'todo-1',
        title: 'Check size XS at Banana Republic (Size 0 Petite fits best)',
        context: 'Browsing Clothes',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'high',
        isCompleted: false,
      },
      {
        id: 'todo-2',
        title: 'Buy Oatly Unsweetened Oat Milk (Avoid Chobani Oat)',
        context: 'At Grocery Store',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'high',
        isCompleted: false,
      },
      {
        id: 'todo-3',
        title: 'Pack Supergoop Unseen Sunscreen SPF 40 before flight',
        context: 'Beach Trip',
        dueDate: '2026-08-01',
        priority: 'medium',
        isCompleted: false,
      },
    ];
  });

  // Modal / Form state for adding custom To-Do
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContext, setNewTodoContext] = useState('At Grocery Store');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Save custom todos
  const saveCustomTodos = (updated: CustomTodoItem[]) => {
    setCustomTodos(updated);
    try {
      localStorage.setItem('recall_custom_todos', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newItem: CustomTodoItem = {
      id: `custom-todo-${Date.now()}`,
      title: newTodoTitle.trim(),
      context: newTodoContext,
      dueDate: newTodoDueDate || undefined,
      priority: newTodoPriority,
      isCompleted: false,
    };

    saveCustomTodos([newItem, ...customTodos]);
    setNewTodoTitle('');
    setNewTodoDueDate('');
    setIsAddTodoOpen(false);
  };

  const toggleCustomTodo = (id: string) => {
    const updated = customTodos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    saveCustomTodos(updated);
  };

  const deleteCustomTodo = (id: string) => {
    saveCustomTodos(customTodos.filter((t) => t.id !== id));
  };

  const toggleMemoryTodo = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getTriggerIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart': return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'Sun': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'Shirt': return <Shirt className="w-4 h-4 text-blue-400" />;
      case 'Laptop': return <Laptop className="w-4 h-4 text-purple-400" />;
      case 'Pill': return <Pill className="w-4 h-4 text-rose-400" />;
      default: return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  const selectedTrigger = triggers.find((t) => t.id === selectedTriggerId);

  // Filter memory items
  const memoryTodos = memories
    .filter((m) => !m.isArchived)
    .filter((m) => {
      if (selectedTriggerId === 'all') return true;
      if (!selectedTrigger) return true;
      const trigName = selectedTrigger.name.toLowerCase();
      const trigContext = m.triggerContext.toLowerCase();
      const content = m.content.toLowerCase();
      const title = m.title.toLowerCase();

      return (
        trigContext.includes(trigName.replace('at ', '').replace('browsing ', '').replace('buying ', '')) ||
        title.includes(trigName) ||
        content.includes(trigName) ||
        (selectedTriggerId === 'trig-grocery' && (m.retentionRule === 'every_grocery' || trigContext.includes('grocery'))) ||
        (selectedTriggerId === 'trig-beach' && (m.retentionRule === 'every_vacation' || trigContext.includes('beach') || trigContext.includes('travel'))) ||
        (selectedTriggerId === 'trig-clothes' && (trigContext.includes('clothes') || trigContext.includes('shopping')))
      );
    });

  // Filter custom todos
  const filteredCustomTodos = customTodos.filter((item) => {
    if (selectedTriggerId === 'all') return true;
    if (!selectedTrigger) return true;
    return item.context.toLowerCase().includes(selectedTrigger.name.toLowerCase().replace('at ', '').replace('browsing ', ''));
  });

  const totalCount = filteredCustomTodos.length + memoryTodos.length;
  const completedCount =
    filteredCustomTodos.filter((t) => t.isCompleted).length +
    memoryTodos.filter((m) => completedItems[m.id]).length;

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Context Calendar & To-Do Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Calendar & <span className="text-amber-400">Context To-Do List</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              To-do items activated by location, event context, and past decision memories. Not just time-based reminders.
            </p>
          </div>

          <button
            onClick={() => setIsAddTodoOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-center"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add To-Do Task</span>
          </button>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-medium text-stone-300">
                Context Progress: <strong className="text-amber-400">{completedCount} of {totalCount} tasks completed</strong>
              </span>
              <span className="font-bold text-amber-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
              <div
                style={{ width: `${progressPercent}%` }}
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Trigger Filter Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedTriggerId('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedTriggerId === 'all'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-md'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>All Calendar & Context To-Dos</span>
          <span className="px-1.5 py-0.2 rounded-full bg-stone-950 text-[10px] text-stone-300 font-bold">
            {customTodos.length + memories.length}
          </span>
        </button>

        {triggers.map((trig) => {
          const isSelected = trig.id === selectedTriggerId;

          return (
            <button
              key={trig.id}
              onClick={() => setSelectedTriggerId(trig.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-md'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {getTriggerIcon(trig.iconName)}
              <span>{trig.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main To-Do List Content */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              {selectedTriggerId === 'all' ? 'All Active Context Tasks' : `Tasks for: ${selectedTrigger?.name}`}
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredCustomTodos.length + memoryTodos.length} items
          </span>
        </div>

        {/* Section 1: Custom To-Do Tasks */}
        {filteredCustomTodos.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Direct Context Tasks
            </h4>

            <div className="space-y-2">
              {filteredCustomTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    todo.isCompleted
                      ? 'bg-stone-950/40 border-stone-800/60 opacity-60'
                      : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleCustomTodo(todo.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors mt-0.5 flex-shrink-0 ${
                        todo.isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-stone-950'
                          : 'border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {todo.isCompleted && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <p className={`text-xs font-bold leading-snug ${todo.isCompleted ? 'line-through text-stone-500' : 'text-stone-100'}`}>
                        {todo.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 font-medium">
                          📍 {todo.context}
                        </span>

                        {todo.dueDate && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {todo.dueDate}
                          </span>
                        )}

                        <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                          todo.priority === 'high' ? 'bg-rose-500/15 text-rose-300' : 'bg-stone-800 text-stone-400'
                        }`}>
                          {todo.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCustomTodo(todo.id)}
                    className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-stone-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Memory-Activated Context To-Dos */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            MemoryOS Triggered Warnings & Lessons
          </h4>

          {memoryTodos.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-3">No memory notes assigned to this context filter.</p>
          ) : (
            <div className="space-y-2">
              {memoryTodos.map((mem) => {
                const isDone = completedItems[mem.id];

                return (
                  <div
                    key={mem.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isDone
                        ? 'bg-stone-950/40 border-stone-800/60 opacity-60'
                        : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleMemoryTodo(mem.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors mt-0.5 flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-stone-950'
                            : 'border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isDone ? 'line-through text-stone-500' : 'text-white'}`}>
                            {mem.title}
                          </span>
                          <span className="px-2 py-0.2 rounded bg-amber-500/10 text-amber-300 text-[10px] font-semibold">
                            {mem.retentionRule.replace('_', ' ')}
                          </span>
                        </div>
                        <p className={`text-xs ${isDone ? 'line-through text-stone-600' : 'text-stone-300'}`}>
                          {mem.content}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                        Score {mem.memoryScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Custom To-Do Modal */}
      {isAddTodoOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Add Context To-Do Task
              </h3>
              <button
                onClick={() => setIsAddTodoOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTodo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-300 mb-1">Task Description:</label>
                <input
                  type="text"
                  required
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="e.g. Try Size 0 Petite at Banana Republic, or Buy Organic Bananas"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Trigger Context Location:</label>
                <select
                  value={newTodoContext}
                  onChange={(e) => setNewTodoContext(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="At Grocery Store">🛒 At Grocery Store</option>
                  <option value="Browsing Clothes">👔 Browsing Clothes</option>
                  <option value="Beach Trip">🏖️ Beach Trip & Travel</option>
                  <option value="Electronics Shopping">💻 Electronics Shopping</option>
                  <option value="Pharmacy / Doctor">💊 Pharmacy / Doctor</option>
                  <option value="Daily Routine">⚡ Daily Routine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Target Date (Optional):</label>
                  <input
                    type="date"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Priority:</label>
                  <select
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="high">🔥 High</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="low">🌱 Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTodoOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md"
                >
                  Save To-Do Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
