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
          ? 'bg-slate-950/85 border-b border-cyan-500/30 text-slate-100 shadow-[0_4px_30px_rgba(6,182,212,0.12)]'
          : currentTheme === 'horizon'
          ? 'bg-slate-900/85 border-b border-indigo-500/30 text-slate-100 shadow-[0_4px_30px_rgba(99,102,241,0.12)]'
          : 'bg-white/80 border-b border-slate-200/80 text-slate-900 shadow-[0_4px_20px_rgba(15,23,42,0.03)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onShowLandingPage}
            title="Click to view Cover Page"
          >
            <AuraLogo size="md" showText={true} variant={isDark ? 'dark' : 'light'} />
            {onShowLandingPage && (
              <span className={`hidden xl:inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border transition ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700 group-hover:bg-cyan-950 group-hover:text-cyan-300 group-hover:border-cyan-500/50'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 border-slate-200'
              }`}>
                Cover Page ↗
              </span>
            )}
          </div>

          {/* Compliance & Mode Badges */}
          <div className="hidden md:flex items-center space-x-4 text-xs">
            {/* POPIA Status */}
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border ${
              isDark
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">POPIA Compliant</span>
            </div>

            {/* Quick Stats */}
            <div className={`px-3.5 py-1 rounded-full border flex items-center space-x-3 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                : 'bg-slate-100/80 border-slate-200/80 text-slate-600'
            }`}>
              <span><strong className={isDark ? "text-cyan-400 font-bold" : "text-cyan-700 font-bold"}>{activeVacancyCount}</strong> Vacancies</span>
              <span className={isDark ? "text-slate-700" : "text-slate-300"}>|</span>
              <span><strong className={isDark ? "text-indigo-400 font-bold" : "text-indigo-700 font-bold"}>{totalApplicantCount}</strong> Applicants</span>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell Button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="View AI Notifications Stream"
                className={`relative p-2 rounded-xl border transition active:scale-95 ${
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

            {/* Bias Reduction Anonymized Toggle */}
            <button
              onClick={() => setIsAnonymizedView(!isAnonymizedView)}
              title={isAnonymizedView ? "Anonymized Mode Active (Names & photos hidden to prevent bias)" : "Standard View Active"}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
                isAnonymizedView
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                  : isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {isAnonymizedView ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{isAnonymizedView ? 'Bias-Free Mode' : 'Anonymize View'}</span>
            </button>

            {/* Add Job Vacancy */}
            <button
              onClick={onOpenAddVacancy}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition flex items-center space-x-1 ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">+ Job Profile</span>
            </button>

            {/* Ingest Candidate Application */}
            <button
              onClick={onOpenAddCandidate}
              className="aura-btn-glow text-white text-xs px-3.5 py-1.5 rounded-xl font-semibold shadow-sm transition flex items-center space-x-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Ingest Application</span>
            </button>

            {/* Top Right Corner AI Theme Toggle Switcher (Far Right) */}
            <ThemeToggle currentTheme={currentTheme} onThemeChange={onThemeChange} />
          </div>
        </div>
      </div>
    </header>
  );
};

