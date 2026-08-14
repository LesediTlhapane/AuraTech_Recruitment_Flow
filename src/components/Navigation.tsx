import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  BrainCircuit, 
  Mail, 
  Calendar, 
  BarChart3, 
  Workflow, 
  ShieldCheck,
  Bell
} from 'lucide-react';
import { AppTheme } from './ThemeToggle';

export type TabType = 
  | 'dashboard'
  | 'vacancies'
  | 'candidates'
  | 'workbench'
  | 'communications'
  | 'interviews'
  | 'analytics'
  | 'n8n'
  | 'popia'
  | 'notifications';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unscreenedCount?: number;
  unreadNotificationCount?: number;
  currentTheme?: AppTheme;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  unscreenedCount = 0,
  unreadNotificationCount = 0,
  currentTheme = 'cyber'
}) => {
  const isDark = currentTheme === 'cyber' || currentTheme === 'horizon';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vacancies', label: 'Vacancies', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { 
      id: 'workbench', 
      label: 'AI Screening', 
      icon: BrainCircuit,
      badge: unscreenedCount > 0 ? unscreenedCount : undefined 
    },
    { id: 'communications', label: 'Emails', icon: Mail },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'n8n', label: 'Automation Flow', icon: Workflow, isHighlight: true },
    { id: 'popia', label: 'POPIA Audit', icon: ShieldCheck },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      badgeColor: 'bg-rose-500'
    },
  ];

  return (
    <nav className={`backdrop-blur-xl border-b overflow-x-auto scrollbar-none sticky top-16 z-30 transition-colors duration-500 ${
      currentTheme === 'cyber'
        ? 'bg-slate-950/80 border-cyan-500/20 text-slate-300'
        : currentTheme === 'horizon'
        ? 'bg-slate-900/80 border-indigo-500/20 text-slate-300'
        : 'bg-white/70 border-slate-200/60 text-slate-600 shadow-[0_2px_15px_rgba(15,23,42,0.02)]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                      : 'bg-slate-900 text-white shadow-sm shadow-slate-900/10 scale-[1.02]'
                    : item.isHighlight
                    ? isDark
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/80'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : item.isHighlight ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-slate-400' : 'text-slate-500')}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`${item.badgeColor || 'bg-cyan-600'} text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 shadow-xs`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

