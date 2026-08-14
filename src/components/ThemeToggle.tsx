import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Moon, Sun, Cpu, Check, Layers } from 'lucide-react';

export type AppTheme = 'light' | 'cyber' | 'horizon';

interface ThemeToggleProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: {
    id: AppTheme;
    name: string;
    subtitle: string;
    icon: React.ReactNode;
    previewBg: string;
    accentColor: string;
    badge: string;
  }[] = [
    {
      id: 'cyber',
      name: 'AI Quantum Cyber',
      subtitle: 'Obsidian & Neon Cyan AI Matrix',
      icon: <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />,
      previewBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border-cyan-500/40',
      accentColor: 'text-cyan-400',
      badge: 'PRO AI',
    },
    {
      id: 'horizon',
      name: 'AI Horizon Midnight',
      subtitle: 'Deep Navy & Cyber Violet',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      previewBg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 border-indigo-500/40',
      accentColor: 'text-purple-400',
      badge: 'DEEP AI',
    },
    {
      id: 'light',
      name: 'Executive Light',
      subtitle: 'Classic Slate & Emerald',
      icon: <Sun className="w-4 h-4 text-emerald-600" />,
      previewBg: 'bg-gradient-to-br from-white via-slate-50 to-emerald-50 border-slate-300',
      accentColor: 'text-emerald-600',
      badge: 'CLASSIC',
    },
  ];

  const activeThemeObj = themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Main Theme Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Application AI Theme"
        className={`group relative px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 flex items-center space-x-2 active:scale-95 shadow-sm ${
          currentTheme === 'cyber'
            ? 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : currentTheme === 'horizon'
            ? 'bg-slate-900/90 text-purple-300 border-indigo-500/40 hover:border-purple-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center space-x-1.5">
          <span className="p-1 rounded-lg bg-slate-800/60 dark:bg-slate-900/80 flex items-center justify-center">
            {activeThemeObj.icon}
          </span>
          <span className="hidden lg:inline-block font-bold tracking-tight">
            {activeThemeObj.name}
          </span>
          <span className="lg:hidden font-bold">Theme</span>
        </div>

        {/* 3D Motion Badge */}
        <span
          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider transition-transform group-hover:scale-105 ${
            currentTheme === 'cyber'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : currentTheme === 'horizon'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          {activeThemeObj.badge}
        </span>
      </button>

      {/* Theme Options Glassmorphic Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Select AI Theme
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">3 Color Modes</span>
          </div>

          <div className="mt-1 space-y-1">
            {themes.map((t) => {
              const isSelected = t.id === currentTheme;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-slate-800/90 border border-slate-700/80 shadow-inner'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${t.previewBg} border flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {t.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                        <span>{t.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {t.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-cyan-300" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center px-2">
            ✨ Dynamic 3D lighting & AI neural atmosphere active
          </div>
        </div>
      )}
    </div>
  );
};
