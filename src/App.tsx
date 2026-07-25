import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Memory, PreferenceGraph, ContextTrigger, ScheduledEvent } from './types';
import { INITIAL_MEMORIES, INITIAL_PREFERENCE_GRAPH, CONTEXT_TRIGGERS, INITIAL_SCHEDULED_EVENTS } from './data/seedData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DecisionAdvisor } from './components/DecisionAdvisor';
import { MemoryTimeline } from './components/MemoryTimeline';
import { PreferenceGraphView } from './components/PreferenceGraphView';
import { ContextTriggersView } from './components/ContextTriggersView';
import { TrustControlView } from './components/TrustControlView';
import { SchedulePlannerView } from './components/SchedulePlannerView';
import { ClothingComparisonView } from './components/ClothingComparisonView';
import { QuickAddModal } from './components/QuickAddModal';
import { VoiceRecorderModal } from './components/VoiceRecorderModal';
import { AccessibilitySuite } from './components/AccessibilitySuite';
import { detectLearnedBehaviors } from './services/api';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

import { LanguageCode } from './services/language';

export default function App() {
  const [activeTab, setActiveTab] = useState<'advisor' | 'timeline' | 'preference' | 'triggers' | 'schedule' | 'trust' | 'compare'>('advisor');
  const [isCapturePaused, setIsCapturePaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAccessibilitySuiteOpen, setIsAccessibilitySuiteOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLearning, setIsLearning] = useState(false);

  // App Language state
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('recall_language') as LanguageCode;
      if (saved) return saved;
    } catch (e) {}
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('recall_language', currentLanguage);
    } catch (e) {}
  }, [currentLanguage]);


  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>("Welcome to Recall MemoryOS — Personal Decision Engine");

  // Load memories from localStorage or seed
  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem('recall_memories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading stored memories:', e);
    }
    return INITIAL_MEMORIES;
  });

  // Load preference graph from localStorage or seed
  const [preferenceGraph, setPreferenceGraph] = useState<PreferenceGraph>(() => {
    try {
      const saved = localStorage.getItem('recall_preference_graph');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading stored preference graph:', e);
    }
    return INITIAL_PREFERENCE_GRAPH;
  });

  // Load scheduled events
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>(() => {
    try {
      const saved = localStorage.getItem('recall_scheduled_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading scheduled events:', e);
    }
    return INITIAL_SCHEDULED_EVENTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('recall_memories', JSON.stringify(memories));
    } catch (e) {
      console.warn('Error saving memories:', e);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('recall_preference_graph', JSON.stringify(preferenceGraph));
    } catch (e) {
      console.warn('Error saving preference graph:', e);
    }
  }, [preferenceGraph]);

  useEffect(() => {
    try {
      localStorage.setItem('recall_scheduled_events', JSON.stringify(scheduledEvents));
    } catch (e) {
      console.warn('Error saving scheduled events:', e);
    }
  }, [scheduledEvents]);

  // Hide toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAddMemory = (newMem: Memory) => {
    setMemories((prev) => [newMem, ...prev]);
    setToastMessage(`Saved "${newMem.title}" with Memory Score ${newMem.memoryScore}/100!`);

    // Auto update preference graph extracts if present
    if (newMem.preferenceExtracts && newMem.preferenceExtracts.length > 0) {
      setPreferenceGraph((prev) => {
        const newTraits = newMem.preferenceExtracts!.map((pe, idx) => ({
          id: `trait-auto-${Date.now()}-${idx}`,
          category: pe.category,
          trait: pe.trait,
          confidenceScore: 88,
          occurrences: 1,
          sourceMemoryCount: 1,
        }));
        return {
          ...prev,
          learnedTraits: [...newTraits, ...prev.learnedTraits],
        };
      });
    }
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setToastMessage("Memory deleted from Recall.");
  };

  const handleArchiveMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isArchived: true } : m))
    );
    setToastMessage("Memory archived.");
  };

  const handleClearAllMemories = () => {
    setMemories([]);
    setScheduledEvents([]);
    localStorage.removeItem('recall_memories');
    localStorage.removeItem('recall_scheduled_events');
    setToastMessage("All MemoryOS data cleared.");
  };

  const handleAddScheduledEvent = (newEvent: ScheduledEvent) => {
    setScheduledEvents((prev) => [newEvent, ...prev]);
    setToastMessage(`Scheduled "${newEvent.title}" with auto-attached memory context!`);
  };

  const handleToggleCompleteEvent = (id: string) => {
    setScheduledEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isCompleted: !e.isCompleted } : e))
    );
  };

  const handleDeleteScheduledEvent = (id: string) => {
    setScheduledEvents((prev) => prev.filter((e) => e.id !== id));
    setToastMessage("Scheduled event removed.");
  };

  const handleTriggerBehaviorLearning = async () => {
    setIsLearning(true);
    try {
      const res = await detectLearnedBehaviors(memories, preferenceGraph);
      if (res.newTraits && res.newTraits.length > 0) {
        setPreferenceGraph((prev) => ({
          ...prev,
          learnedTraits: [
            ...res.newTraits.map((t, idx) => ({
              id: `trait-learned-${Date.now()}-${idx}`,
              category: t.category,
              trait: t.trait,
              confidenceScore: t.confidence,
              occurrences: 3,
              sourceMemoryCount: memories.length,
            })),
            ...prev.learnedTraits,
          ],
        }));
        setToastMessage(`Detected ${res.newTraits.length} new preference traits!`);
      } else {
        setToastMessage("Analyzed memories: Preference graph is up to date.");
      }
    } catch (e) {
      console.error(e);
      setToastMessage("Behavior learning completed.");
    } finally {
      setIsLearning(false);
    }
  };


  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 flex flex-row overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCapturePaused={isCapturePaused}
        setIsCapturePaused={setIsCapturePaused}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenVoiceRecorder={() => setIsVoiceModalOpen(true)}
        onOpenAccessibilitySuite={() => setIsAccessibilitySuiteOpen(true)}
        memoriesCount={memories.filter((m) => !m.isArchived).length}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenVoiceRecorder={() => setIsVoiceModalOpen(true)}
          onOpenAccessibilitySuite={() => setIsAccessibilitySuiteOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
        />

        {/* View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
          {activeTab === 'advisor' && (
            <motion.div
              key="advisor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DecisionAdvisor
                memories={memories}
                preferenceGraph={preferenceGraph}
                currentLanguage={currentLanguage}
              />
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MemoryTimeline
                memories={memories}
                onDeleteMemory={handleDeleteMemory}
                onArchiveMemory={handleArchiveMemory}
                searchQuery={searchQuery}
              />
            </motion.div>
          )}

          {activeTab === 'preference' && (
            <motion.div
              key="preference"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PreferenceGraphView
                graph={preferenceGraph}
                onUpdateGraph={setPreferenceGraph}
                onTriggerBehaviorLearning={handleTriggerBehaviorLearning}
                isLearning={isLearning}
              />
            </motion.div>
          )}

          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ClothingComparisonView
                graph={preferenceGraph}
                memories={memories}
                onUpdateGraph={setPreferenceGraph}
              />
            </motion.div>
          )}

          {activeTab === 'triggers' && (
            <motion.div
              key="triggers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ContextTriggersView
                triggers={CONTEXT_TRIGGERS}
                memories={memories}
              />
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SchedulePlannerView
                scheduledEvents={scheduledEvents}
                onAddScheduledEvent={handleAddScheduledEvent}
                onToggleCompleteEvent={handleToggleCompleteEvent}
                onDeleteEvent={handleDeleteScheduledEvent}
                memories={memories}
                graph={preferenceGraph}
                onOpenVoiceRecorder={() => setIsVoiceModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'trust' && (
            <motion.div
              key="trust"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TrustControlView
                isCapturePaused={isCapturePaused}
                setIsCapturePaused={setIsCapturePaused}
                memories={memories}
                onClearAllMemories={handleClearAllMemories}
                graph={preferenceGraph}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-500/40 text-stone-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-stone-400 hover:text-white p-0.5 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Record Memory Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddMemory={handleAddMemory}
        onOpenVoiceRecorder={() => setIsVoiceModalOpen(true)}
      />

      {/* Voice Recorder & Multimodal Scheduling Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddMemory={handleAddMemory}
        onAddScheduledEvent={handleAddScheduledEvent}
        memories={memories}
        graph={preferenceGraph}
      />

      {/* Inclusive Accessibility Suite (Read Aloud, Transcribe, Magnifiers, Voice Controls) */}
      <AccessibilitySuite
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isAccessibilitySuiteOpen}
        onClose={() => setIsAccessibilitySuiteOpen(false)}
      />

        {/* Footer */}
        <footer className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-500 mt-auto">
          <p>Recall MemoryOS • "Will Future You care about this?"</p>
        </footer>
      </div>
    </div>
  );
}
