import React from 'react';
import {
  Sparkles,
  Shirt,
  History,
  UserCheck,
  ListTodo,
  Calendar,
  Lock,
  Plus,
  Mic,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export const RainbowAccessibilityDogIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Vibrant Arching Rainbow Lines */}
    <path
      d="M 2 26 A 14 14 0 0 1 30 26"
      stroke="#ef4444"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 4.2 26 A 11.8 11.8 0 0 1 27.8 26"
      stroke="#f97316"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 6.4 26 A 9.6 9.6 0 0 1 25.6 26"
      stroke="#eab308"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 8.6 26 A 7.4 7.4 0 0 1 23.4 26"
      stroke="#10b981"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 10.8 26 A 5.2 5.2 0 0 1 21.2 26"
      stroke="#3b82f6"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 13 26 A 3 3 0 0 1 19 26"
      stroke="#8b5cf6"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Accessibility / Service Dog Silhouette in White (Enlarged) */}
    <g transform="translate(-2.5, -3.2) scale(1.25)">
      {/* Dog Body (Sitting posture) */}
      <path
        d="M 12 26 C 12 22 13.2 19 15.5 17.5 C 15.8 16.2 15 14.5 15.2 13.5 C 15.4 12.8 16.2 12 17.2 12 C 18.5 12 20.5 12.2 21.2 13.2 C 21.8 14 21.2 15 20.2 15.6 C 20 16.5 20.2 17.5 20 19 C 21.5 20 22 23 22 26 Z"
        fill="#ffffff"
      />
      {/* Ear */}
      <path
        d="M 16.2 12.5 C 15.2 13 14.8 15 15.5 16 C 16.2 16.8 17.2 15.5 16.8 14 Z"
        fill="#e2e8f0"
      />
      {/* Tail */}
      <path
        d="M 21.8 25 C 23.5 24 24.5 21.5 24 19.5"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Service Harness */}
      <rect
        x="15.2"
        y="18.2"
        width="4.8"
        height="4"
        rx="1"
        fill="#2563eb"
      />
      <path
        d="M 17.6 19 L 17.6 21.4 M 16.4 20.2 L 18.8 20.2"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M 16 16.2 L 19.5 16.2"
        stroke="#f59e0b"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="18.5" cy="13.8" r="0.6" fill="#09090b" />
      <ellipse cx="20.8" cy="14" rx="0.7" ry="0.5" fill="#09090b" />
    </g>
  </svg>
);

export interface SidebarProps {
  activeTab: 'advisor' | 'timeline' | 'preference' | 'triggers' | 'schedule' | 'trust' | 'compare';
  setActiveTab: (tab: 'advisor' | 'timeline' | 'preference' | 'triggers' | 'schedule' | 'trust' | 'compare') => void;
  isCapturePaused: boolean;
  setIsCapturePaused: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenQuickAdd: () => void;
  onOpenVoiceRecorder: () => void;
  onOpenAccessibilitySuite: () => void;
  memoriesCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCapturePaused,
  setIsCapturePaused,
  onOpenQuickAdd,
  onOpenVoiceRecorder,
  onOpenAccessibilitySuite,
  memoriesCount,
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const navItems = [
    {
      id: 'advisor' as const,
      label: 'AI Advisor',
      icon: Sparkles,
      badge: null,
      color: 'text-amber-400',
    },
    {
      id: 'compare' as const,
      label: '3D Fit & Compare',
      icon: Shirt,
      badge: null,
      color: 'text-amber-400',
    },
    {
      id: 'timeline' as const,
      label: 'Memory Timeline',
      icon: History,
      badge: memoriesCount > 0 ? memoriesCount : null,
      color: 'text-stone-300',
    },
    {
      id: 'preference' as const,
      label: 'Preference Graph',
      icon: UserCheck,
      badge: null,
      color: 'text-blue-400',
    },
    {
      id: 'triggers' as const,
      label: 'Calendar',
      icon: Calendar,
      badge: null,
      color: 'text-amber-400',
    },
    {
      id: 'schedule' as const,
      label: 'Decision Schedule',
      icon: Calendar,
      badge: null,
      color: 'text-amber-400',
    },
    {
      id: 'trust' as const,
      label: 'Trust & Privacy',
      icon: Lock,
      badge: null,
      color: 'text-emerald-400',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Header Logo */}
      <div>
        <div className="h-14 px-3 flex items-center justify-between border-b border-stone-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9.5 h-9.5 rounded-xl bg-stone-950 border border-stone-800 p-0.5 flex items-center justify-center shrink-0 shadow-md">
              <RainbowAccessibilityDogIcon className="w-7.5 h-7.5" />
            </div>
            {(!isCollapsed || isMobileMenuOpen) && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm text-white tracking-tight leading-tight truncate">
                  InclusiveAlly
                </span>
                <span className="text-[10px] text-stone-400 truncate">
                  Personal Decision Engine
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all hidden md:block shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="p-2 border-b border-stone-800/50">
          <button
            onClick={() => {
              onOpenQuickAdd();
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-center gap-2 py-2 px-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 ${
              isCollapsed && !isMobileMenuOpen ? 'p-2' : ''
            }`}
            title="Record Memory"
          >
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0" />
            {(!isCollapsed || isMobileMenuOpen) && <span className="truncate">Record Memory</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
                title={isCollapsed && !isMobileMenuOpen ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : item.color}`} />
                {(!isCollapsed || isMobileMenuOpen) && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {(!isCollapsed || isMobileMenuOpen) && item.badge !== null && (
                  <span className="px-1.5 py-0.2 rounded-full bg-stone-800 text-[10px] text-stone-400 font-normal">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-2 border-t border-stone-800/80 space-y-1.5">
        {/* Voice Note Quick Trigger */}
        <button
          onClick={() => {
            onOpenVoiceRecorder();
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 bg-stone-800/60 hover:bg-stone-800 text-amber-300 text-xs font-medium rounded-xl border border-amber-500/20 transition-all ${
            isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''
          }`}
          title="Voice Note Assistant"
        >
          <Mic className="w-4 h-4 text-amber-400 shrink-0" />
          {(!isCollapsed || isMobileMenuOpen) && <span className="truncate text-[11px]">Voice Note</span>}
        </button>

        {/* Accessibility Suite Trigger */}
        <button
          onClick={() => {
            onOpenAccessibilitySuite();
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 bg-stone-800/60 hover:bg-stone-800 text-emerald-300 text-xs font-medium rounded-xl border border-emerald-500/20 transition-all ${
            isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''
          }`}
          title="Accessibility Suite"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          {(!isCollapsed || isMobileMenuOpen) && <span className="truncate text-[11px]">Accessibility</span>}
        </button>

        {/* Capture Toggle */}
        <button
          onClick={() => setIsCapturePaused(!isCapturePaused)}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
            isCapturePaused
              ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
              : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
          } ${isCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}
          title={isCapturePaused ? "Memory capture paused" : "Memory capture active"}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${isCapturePaused ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`} />
          {(!isCollapsed || isMobileMenuOpen) && (
            <span className="truncate text-[11px]">
              {isCapturePaused ? 'Capture Paused' : 'Capture Active'}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`bg-stone-900 border-r border-stone-800 hidden md:flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none h-screen sticky top-0 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] bg-stone-900 border-r border-stone-800 h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
