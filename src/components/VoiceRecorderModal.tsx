import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play, Sparkles, Check, X, AlertCircle, Calendar, Brain, Clock, MapPin, Tag, Volume2, RefreshCw } from 'lucide-react';
import { Memory, PreferenceGraph, ScheduledEvent, VoiceProcessedResult } from '../types';
import { processVoiceNoteWithAI } from '../services/api';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: Memory) => void;
  onAddScheduledEvent: (event: ScheduledEvent) => void;
  memories: Memory[];
  graph: PreferenceGraph;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
  onAddScheduledEvent,
  memories,
  graph,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<VoiceProcessedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        rec.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          if (err.error !== 'no-speech') {
            setErrorMessage(`Mic notice: ${err.error}. You can also type or use presets below.`);
          }
        };

        rec.onend = () => {
          setIsRecording(false);
          clearInterval(timerRef.current);
        };

        recognitionRef.current = rec;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const startRecording = () => {
    setErrorMessage(null);
    setProcessedResult(null);
    setTranscript('');
    setRecordingSeconds(0);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (e) {
        console.warn('Speech recognition failed to start:', e);
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else {
      // Fallback for browsers without speech recognition
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      setErrorMessage('Speech recognition not supported natively on this browser. You can select sample audio presets or edit transcript manually.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const handleAnalyzeVoice = async (textToUse?: string) => {
    const text = textToUse || transcript;
    if (!text.trim()) {
      setErrorMessage('Please speak or type a voice note first.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const res = await processVoiceNoteWithAI(text, memories, graph);
      setProcessedResult(res);
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to analyze voice note.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSave = () => {
    if (!processedResult) return;

    // Save Memory if generated
    if ((processedResult.intent === 'memory' || processedResult.intent === 'both') && processedResult.memoryData) {
      const mData = processedResult.memoryData;
      const newMem: Memory = {
        id: `mem-voice-${Date.now()}`,
        title: mData.title || 'Voice Note Memory',
        content: mData.content || processedResult.transcript,
        category: mData.category || 'decision',
        memoryScore: mData.memoryScore || 80,
        retentionRule: mData.retentionRule || 'forever',
        triggerContext: mData.triggerContext || 'Voice Note',
        tags: mData.tags || ['Voice Recording', 'Personal Experience'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferenceExtracts: mData.preferenceExtracts,
        decisionDetails: mData.decisionDetails,
      };
      onAddMemory(newMem);
    }

    // Save Schedule if generated
    if ((processedResult.intent === 'schedule' || processedResult.intent === 'both') && processedResult.scheduleData) {
      const sData = processedResult.scheduleData;
      const newEvt: ScheduledEvent = {
        id: `sched-voice-${Date.now()}`,
        title: sData.title || 'Voice Scheduled Event',
        date: sData.date || new Date().toISOString().split('T')[0],
        time: sData.time || '10:00 AM',
        category: sData.category || 'general',
        location: sData.location,
        notes: sData.notes || processedResult.transcript,
        isCompleted: false,
        autoAttachedMemories: memories.slice(0, 1).map((m) => ({
          id: m.id,
          title: m.title,
          memoryScore: m.memoryScore,
          tip: m.decisionDetails?.reasoning || m.content.slice(0, 80),
        })),
        personalizedAdvice: sData.personalizedAdvice || 'Scheduled from voice recording with MemoryOS context.',
      };
      onAddScheduledEvent(newEvt);
    }

    onClose();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  const SAMPLE_VOICE_PRESETS = [
    "Note to self: The Uniqlo Airism XS fit great without tailoring, but Zara jeans in size 26 were way too long and had to be returned.",
    "Remind me next Tuesday at 9:30 AM to go to Costco and buy organic bananas and Planet Oat unsweetened oat milk.",
    "Ramen at Ippudo SoHo was an 8 out of 10. The spicy tonkotsu broth was fantastic but slightly salty, ask for extra egg next time."
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Voice Memory & Scheduling Assistant
              </h3>
              <p className="text-xs text-stone-400">Speak naturally — Recall structures past memories & schedules events</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recording Animation & Controls */}
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            {isRecording && (
              <span className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping" />
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-500/40'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950'
              }`}
            >
              {isRecording ? <Square className="w-7 h-7 fill-current" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="space-y-1">
            <span className={`text-xs font-bold ${isRecording ? 'text-rose-400 animate-pulse' : 'text-stone-300'}`}>
              {isRecording ? `Recording... (${formatTimer(recordingSeconds)})` : 'Click Microphone to Speak'}
            </span>
            <p className="text-[11px] text-stone-500">
              {isRecording ? 'Click stop when done speaking.' : 'Try saying: "Remind me next Tuesday to go to Costco for oat milk" or "Zara jeans fit poorly"'}
            </p>
          </div>

          {/* Simulated Waveform Visualizer */}
          {isRecording && (
            <div className="flex items-center gap-1 h-8">
              {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 60, 85].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.min(100, h + (i % 3) * 10)}%` }}
                  className="w-1 bg-amber-400 rounded-full animate-pulse transition-all duration-150"
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Transcript / Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
            <span>Spoken Transcript:</span>
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="text-[10px] text-stone-500 hover:text-stone-300"
              >
                Clear text
              </button>
            )}
          </label>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken voice note will appear here in real-time... (Or click a sample preset below)"
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Sample Voice Note Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-amber-400" />
            Try Sample Voice Presets:
          </span>
          <div className="space-y-1.5">
            {SAMPLE_VOICE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(preset);
                  handleAnalyzeVoice(preset);
                }}
                className="w-full text-left p-2 rounded-lg bg-stone-950 hover:bg-stone-800/80 border border-stone-800 text-[11px] text-stone-300 transition-colors line-clamp-1 flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">{preset}</span>
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button: Analyze Voice */}
        {!processedResult && (
          <button
            onClick={() => handleAnalyzeVoice()}
            disabled={isProcessing || !transcript.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Multimodal AI Extracting Memories & Schedule...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Process Voice Note with Gemini AI</span>
              </>
            )}
          </button>
        )}

        {/* AI Processed Preview Card */}
        {processedResult && (
          <div className="bg-stone-950 border border-amber-500/40 p-4 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-sm">Extracted Multimodal Insights</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-500/30">
                Intent: {processedResult.intent}
              </span>
            </div>

            <p className="text-stone-300 italic bg-stone-900 p-2.5 rounded-xl border border-stone-800">
              "{processedResult.aiSummary}"
            </p>

            {/* If Memory Data Extracted */}
            {processedResult.memoryData && (processedResult.intent === 'memory' || processedResult.intent === 'both') && (
              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Brain className="w-4 h-4" />
                  <span>Generated Memory Entry</span>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold">{processedResult.memoryData.title}</p>
                  <p className="text-stone-300">{processedResult.memoryData.content}</p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                    <span>Score: <strong className="text-amber-400">{processedResult.memoryData.memoryScore}/100</strong></span>
                    <span>Trigger: <strong className="text-stone-200">{processedResult.memoryData.triggerContext}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* If Schedule Data Extracted */}
            {processedResult.scheduleData && (processedResult.intent === 'schedule' || processedResult.intent === 'both') && (
              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Calendar className="w-4 h-4" />
                  <span>Generated Decision Event</span>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold">{processedResult.scheduleData.title}</p>
                  <div className="flex items-center gap-3 text-stone-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {processedResult.scheduleData.date} {processedResult.scheduleData.time}
                    </span>
                    {processedResult.scheduleData.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {processedResult.scheduleData.location}
                      </span>
                    )}
                  </div>
                  {processedResult.scheduleData.personalizedAdvice && (
                    <p className="text-[11px] text-amber-200/90 pt-1 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      💡 {processedResult.scheduleData.personalizedAdvice}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Confirm & Save Button */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm & Save to MemoryOS</span>
              </button>

              <button
                onClick={() => setProcessedResult(null)}
                className="px-3 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs rounded-xl"
              >
                Re-record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
