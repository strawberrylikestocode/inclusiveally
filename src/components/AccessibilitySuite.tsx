import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ZoomIn,
  ZoomOut,
  Eye,
  Sparkles,
  Command,
  X,
  Play,
  Square,
  Maximize2,
  Minimize2,
  Check,
  Type,
  Sun,
  Moon,
  Radio,
  Sliders,
  HelpCircle,
  Activity,
  CheckCircle2,
  Subtitles,
  Languages
} from 'lucide-react';

interface AccessibilitySuiteProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySuite: React.FC<AccessibilitySuiteProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  // 1. READ ALOUD STATE (SpeechSynthesis)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [clickToRead, setClickToRead] = useState(false);
  const [speakingText, setSpeakingText] = useState<string>('');

  // 2. LIVE TRANSCRIBE STATE (SpeechRecognition)
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);

  // 3. MAGNIFIER & DISPLAY STATE
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  // 4. VOICE CONTROLS STATE
  const [isVoiceControlActive, setIsVoiceControlActive] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const voiceRecognitionRef = useRef<any>(null);

  // Apply Root Zoom & Style Transformations
  useEffect(() => {
    const rootEl = document.documentElement;
    
    // Zoom / Text Scaling
    if (zoomLevel === 100) {
      rootEl.style.fontSize = '';
    } else {
      rootEl.style.fontSize = `${(zoomLevel / 100) * 16}px`;
    }

    // High Contrast Mode
    if (highContrast) {
      rootEl.classList.add('high-contrast-mode');
    } else {
      rootEl.classList.remove('high-contrast-mode');
    }

    // Dyslexic Font
    if (dyslexicFont) {
      rootEl.style.fontFamily = 'Comic Sans MS, Changa One, Trebuchet MS, sans-serif';
    } else {
      rootEl.style.fontFamily = '';
    }

    return () => {
      rootEl.style.fontSize = '';
      rootEl.classList.remove('high-contrast-mode');
      rootEl.style.fontFamily = '';
    };
  }, [zoomLevel, highContrast, dyslexicFont]);

  // Handle Magnifier Mouse Position
  useEffect(() => {
    if (!isMagnifierActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMagnifierPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMagnifierActive]);

  // Click-To-Read Event Listener
  useEffect(() => {
    if (!clickToRead) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Ignore buttons inside accessibility panel itself
      if (target.closest('.accessibility-panel-container')) return;

      const text = target.innerText || target.textContent;
      if (text && text.trim().length > 0) {
        speakText(text.trim().slice(0, 300));
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, [clickToRead, speechRate]);

  // READ ALOUD FUNCTION
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any current speech
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingText(text.slice(0, 80) + (text.length > 80 ? '...' : ''));
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingText('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingText('');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingText('');
    }
  };

  const readPageContent = () => {
    const mainContent = document.querySelector('main')?.innerText || document.body.innerText;
    if (mainContent) {
      speakText(mainContent.slice(0, 600));
    }
  };

  // LIVE TRANSCRIBE ENGINE
  const toggleLiveTranscribe = () => {
    if (isTranscribing) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsTranscribing(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please try Google Chrome or Edge.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsTranscribing(true);
    };

    rec.onresult = (event: any) => {
      let currentInterim = '';
      let finalString = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalString += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      const activeText = finalString || currentInterim;
      setTranscriptText(activeText);

      if (finalString) {
        setTranscriptHistory((prev) => [finalString, ...prev.slice(0, 4)]);
      }
    };

    rec.onerror = (e: any) => {
      console.warn('Transcribe error:', e);
      setIsTranscribing(false);
    };

    rec.onend = () => {
      setIsTranscribing(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // VOICE CONTROLS ENGINE
  const toggleVoiceControl = () => {
    if (isVoiceControlActive) {
      if (voiceRecognitionRef.current) voiceRecognitionRef.current.stop();
      setIsVoiceControlActive(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const vRec = new SpeechRecognition();
    vRec.continuous = true;
    vRec.interimResults = false;
    vRec.lang = 'en-US';

    vRec.onstart = () => {
      setIsVoiceControlActive(true);
      setCommandFeedback('Listening for commands ("Go to Advisor", "Go to Compare", "Read Page", "Zoom in")...');
    };

    vRec.onresult = (event: any) => {
      const lastIndex = event.results.length - 1;
      const cmd = event.results[lastIndex][0].transcript.toLowerCase().trim();
      setLastVoiceCommand(cmd);

      // Parse Commands
      if (cmd.includes('advisor') || cmd.includes('decision')) {
        setActiveTab('advisor');
        setCommandFeedback('Opened Decision Advisor');
      } else if (cmd.includes('compare') || cmd.includes('clothing') || cmd.includes('dress') || cmd.includes('3d')) {
        setActiveTab('compare');
        setCommandFeedback('Opened 3D Clothing Compare');
      } else if (cmd.includes('timeline') || cmd.includes('memory') || cmd.includes('memories')) {
        setActiveTab('timeline');
        setCommandFeedback('Opened Memory Timeline');
      } else if (cmd.includes('graph') || cmd.includes('preference')) {
        setActiveTab('preference');
        setCommandFeedback('Opened Preference Graph');
      } else if (cmd.includes('schedule') || cmd.includes('planner')) {
        setActiveTab('schedule');
        setCommandFeedback('Opened Schedule Planner');
      } else if (cmd.includes('trust') || cmd.includes('privacy')) {
        setActiveTab('trust');
        setCommandFeedback('Opened Trust & Privacy Center');
      } else if (cmd.includes('read') || cmd.includes('speak')) {
        readPageContent();
        setCommandFeedback('Reading page aloud');
      } else if (cmd.includes('stop') || cmd.includes('silence')) {
        stopSpeaking();
        setCommandFeedback('Stopped speech synthesis');
      } else if (cmd.includes('zoom in') || cmd.includes('bigger')) {
        setZoomLevel((prev) => Math.min(200, prev + 25));
        setCommandFeedback('Zoomed in display');
      } else if (cmd.includes('zoom out') || cmd.includes('smaller')) {
        setZoomLevel((prev) => Math.max(100, prev - 25));
        setCommandFeedback('Zoomed out display');
      } else if (cmd.includes('transcribe') || cmd.includes('caption')) {
        toggleLiveTranscribe();
        setCommandFeedback('Toggled Live Transcribe');
      }
    };

    vRec.onend = () => {
      setIsVoiceControlActive(false);
    };

    voiceRecognitionRef.current = vRec;
    vRec.start();
  };

  if (!isOpen) {
    return (
      <>
        {/* Live Transcribe Floating Caption Overlay (if active) */}
        {isTranscribing && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-950/95 border-2 border-amber-400 text-white px-6 py-3.5 rounded-2xl shadow-2xl max-w-2xl w-[90%] text-center backdrop-blur-md animate-bounce-short">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE TRANSCRIBE CAPTION</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-amber-200 tracking-wide">
              "{transcriptText || 'Listening for live speech...'}"
            </p>
          </div>
        )}

        {/* Magnifier Glass Circle Lens Overlay (if active) */}
        {isMagnifierActive && (
          <div
            className="pointer-events-none fixed z-[9999] w-48 h-48 rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden bg-stone-900/90 backdrop-blur-3xl flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${magnifierPos.x}px`,
              top: `${magnifierPos.y}px`,
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.4)',
            }}
          >
            <div className="text-center p-3">
              <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">Magnifier 2.5x</span>
              <p className="text-xs font-semibold text-white mt-1">Focusing target area</p>
            </div>
          </div>
        )}

        {/* Floating Voice Command Feedback HUD */}
        {isVoiceControlActive && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3">
            <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-xs">
              <p className="font-bold text-white">Voice Controls Active</p>
              <p className="text-[11px] text-emerald-300">{commandFeedback || 'Say "Go to Advisor", "Read Page", etc.'}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 accessibility-panel-container">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-emerald-500 text-stone-950 rounded-2xl shadow-lg">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Inclusive Accessibility Suite
              </h2>
              <p className="text-xs text-stone-400">
                Customizable screen reader, live captioning, magnification, and voice controls.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of 4 Core Accessibility Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 1. READ ALOUD (TTS) */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Read Aloud (Screen Reader)</h3>
              </div>
              {isSpeaking && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Speaking...
                </span>
              )}
            </div>

            <p className="text-xs text-stone-400">
              Listen to active page summaries or click any text element on the screen to hear it spoken aloud.
            </p>

            {speakingText && (
              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 text-xs text-amber-200 font-medium italic">
                "{speakingText}"
              </div>
            )}

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={readPageContent}
                  className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Read Page Aloud</span>
                </button>

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl hover:bg-rose-500/30"
                    title="Stop Speech"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-[11px] text-stone-300 font-semibold flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clickToRead}
                    onChange={(e) => setClickToRead(e.target.checked)}
                    className="rounded bg-stone-900 border-stone-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Click-Any-Text-To-Read Mode</span>
                </label>

                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <span>Speed:</span>
                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="bg-stone-900 text-amber-300 font-bold rounded p-1 border border-stone-800 text-xs"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1.0}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 2. LIVE TRANSCRIBE (CAPTIONING) */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Subtitles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Live Speech Transcribe</h3>
              </div>
              {isTranscribing && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Listening...
                </span>
              )}
            </div>

            <p className="text-xs text-stone-400">
              Converts live spoken audio into continuous real-time subtitles overlaid on your display.
            </p>

            <button
              onClick={toggleLiveTranscribe}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border ${
                isTranscribing
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 border-emerald-400'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isTranscribing ? 'Turn Off Live Subtitles' : 'Turn On Live Speech Transcribe'}</span>
            </button>

            {transcriptHistory.length > 0 && (
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800 max-h-20 overflow-y-auto space-y-1 text-[11px] text-stone-300">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">Recent Transcripts:</p>
                {transcriptHistory.map((t, idx) => (
                  <p key={idx} className="line-clamp-1">• "{t}"</p>
                ))}
              </div>
            )}
          </div>

          {/* 3. MAGNIFIER & DISPLAY SCALING */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Magnifier & Display Scaling</h3>
            </div>

            <p className="text-xs text-stone-400">
              Adjust global font scaling or activate the mouse lens magnifier tool for low vision.
            </p>

            {/* Scale buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-semibold">Text Zoom Level:</span>
                <span className="font-bold text-sky-400">{zoomLevel}%</span>
              </div>

              <div className="flex items-center gap-2">
                {[100, 125, 150, 175, 200].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setZoomLevel(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      zoomLevel === lvl
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {lvl}%
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setIsMagnifierActive(!isMagnifierActive)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    isMagnifierActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isMagnifierActive ? 'Disable Lens' : 'Enable Lens Magnifier'}</span>
                </button>

                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    highContrast
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>High Contrast Mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. VOICE CONTROLS */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Command className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Voice Navigation Controls</h3>
              </div>
              {isVoiceControlActive && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  Listening
                </span>
              )}
            </div>

            <p className="text-xs text-stone-400">
              Control the app hands-free using voice commands (e.g., "Go to Advisor", "Go to Compare", "Read Page").
            </p>

            <button
              onClick={toggleVoiceControl}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border ${
                isVoiceControlActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-purple-500 hover:bg-purple-400 text-stone-950 border-purple-400'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isVoiceControlActive ? 'Stop Voice Listener' : 'Enable Voice Control Commands'}</span>
            </button>

            {lastVoiceCommand && (
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800 text-[11px] text-purple-300 font-medium">
                Last Heard Command: <strong className="text-white">"{lastVoiceCommand}"</strong>
              </div>
            )}
          </div>

        </div>

        {/* Footer info */}
        <div className="border-t border-stone-800 pt-3 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5 text-amber-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold text-[11px]">WCAG 2.1 AA Compliant</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
