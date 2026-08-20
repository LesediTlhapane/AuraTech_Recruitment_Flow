import React from 'react';
import { ShieldCheck, Plus, FileText, Eye, EyeOff, Bell } from 'lucide-react';
import { AuraLogo } from './AuraLogo';
import { ThemeToggle, AppTheme } from './ThemeToggle';

interface HeaderProps {
  onOpenAddCandidate: () => void;
  onOpenAddVacancy: () => void;
  isAnonymizedView: boolean;
  setIsAnonymizedView: (val: boolean) => void;
  activeVacancyCount: number;
  totalApplicantCount: number;
  onShowLandingPage?: () => void;
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
  currentTheme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddCandidate,
  onOpenAddVacancy,
  isAnonymizedView,
  setIsAnonymizedView,
  activeVacancyCount,
  totalApplicantCount,
  onShowLandingPage,
  unreadNotificationCount = 0,
  onOpenNotifications,
  currentTheme = 'light',
  onThemeChange = () => {},
}) => {
  const isDark = currentTheme === 'cyber' || currentTheme === 'horizon';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl transition-colors duration-500 ${
        currentTheme === 'cyber'
          ? 'bg-slate-950/90 border-b border-cyan-500/30 text-slate-100 shadow-[0_4px_30px_rgba(6,182,212,0.12)]'
          : currentTheme === 'horizon'
          ? 'bg-slate-900/90 border-b border-indigo-500/30 text-slate-100 shadow-[0_4px_30px_rgba(99,102,241,0.12)]'
          : 'bg-white/90 border-b border-slate-200/80 text-slate-900 shadow-[0_4px_20px_rgba(15,23,42,0.03)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Left: Logo & Cover Page Link */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <div
              className="flex items-center cursor-pointer group shrink-0"
              onClick={onShowLandingPage}
              title="Click to view Cover Page"
            >
              <AuraLogo size="md" showText={true} variant={isDark ? 'dark' : 'light'} />
            </div>
            {onShowLandingPage && (
              <button
                type="button"
                onClick={onShowLandingPage}
                className={`hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition shrink-0 ${
                  isDark
                    ? 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40'
                    : 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border-slate-200/80'
                }`}
              >
                <span>Cover Page</span>
                <span className="text-[10px]">↗</span>
              </button>
            )}
          </div>

          {/* Right: Clean Header Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Bias Reduction Anonymized Toggle */}
            <button
              onClick={() => setIsAnonymizedView(!isAnonymizedView)}
              title={isAnonymizedView ? "Anonymized Mode Active (Names & photos hidden to prevent bias)" : "Standard View Active"}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 shrink-0 ${
                isAnonymizedView
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 shadow-xs'
                  : isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {isAnonymizedView ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{isAnonymizedView ? 'Bias-Free Mode' : 'Bias-Free'}</span>
            </button>

            {/* Ingest Candidate Application (Primary CTA) */}
            <button
              onClick={onOpenAddCandidate}
              className="aura-btn-glow text-white text-xs px-3.5 py-1.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Ingest Application</span>
            </button>

            {/* Notification Bell Button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="View AI Notifications Stream"
                className={`relative p-2 rounded-xl border transition active:scale-95 shrink-0 ${
                  isDark
                    ? 'text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border-slate-800'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Top Right Corner AI Theme Toggle Switcher (Far Right) */}
            <div className="shrink-0">
              <ThemeToggle currentTheme={currentTheme} onThemeChange={onThemeChange} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

