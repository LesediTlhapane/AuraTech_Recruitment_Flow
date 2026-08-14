import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  Search, 
  Sparkles, 
  X, 
  SlidersHorizontal,
  BrainCircuit,
  ShieldCheck,
  FileText,
  Calendar,
  Zap,
  Mail
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemoveNotification: (id: string) => void;
  onClearAll: () => void;
  onSimulateNotification: (presetCategory?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification,
  onClearAll,
  onSimulateNotification,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterReadStatus, setFilterReadStatus] = useState<'All' | 'Unread' | 'Read'>('All');

  const unreadCount = notifications.filter(n => !n.read).length;

  const categories = ['All', 'Ingestion', 'Screening', 'Parsing', 'Compliance', 'Matching', 'Calendar', 'Communication'];

  const filteredNotifications = notifications.filter((item) => {
    // Search query filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    // Read status filter
    const matchesRead = 
      filterReadStatus === 'All' || 
      (filterReadStatus === 'Unread' && !item.read) || 
      (filterReadStatus === 'Read' && item.read);

    return matchesSearch && matchesCategory && matchesRead;
  });

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl backdrop-blur-md">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                Live AI Event Stream
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Activity & System Notifications
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Track candidate ingestion, automated AI screening metrics, POPIA compliance checks, and interview scheduling events in real time.
            </p>
          </div>

          {/* Header Actions & Quick Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl flex items-center space-x-3">
              <span className="text-xs text-slate-300 font-medium">Unread Items:</span>
              <span className="text-base font-black text-cyan-400 bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-400/30">
                {unreadCount}
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-600/20 flex items-center space-x-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="bg-slate-800/80 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1.5 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Simulation Trigger Toolbar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Test Live Notification Triggers:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSimulateNotification('Ingestion')}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-cyan-500/50 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Ingest CV</span>
            </button>

            <button
              onClick={() => onSimulateNotification('Screening')}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-indigo-500/50 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 active:scale-95"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ AI Screen</span>
            </button>

            <button
              onClick={() => onSimulateNotification('Compliance')}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-emerald-500/50 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ POPIA Audit</span>
            </button>

            <button
              onClick={() => onSimulateNotification('Calendar')}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-purple-500/50 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Read Status Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs self-end md:self-auto">
          {(['All', 'Unread', 'Read'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterReadStatus(status)}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterReadStatus === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No notifications found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {notifications.length === 0 
                  ? 'Your notification feed is completely clear. Trigger a test event using the toolbar above!'
                  : 'No items match your active search or category filter criteria.'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              {notifications.length === 0 ? (
                <button
                  onClick={() => onSimulateNotification()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Test Notification</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setFilterReadStatus('All');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`group relative bg-white/90 backdrop-blur-xl border rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md flex items-start justify-between gap-4 ${
                !notif.read 
                  ? 'border-indigo-300/80 bg-gradient-to-r from-indigo-50/40 via-white to-white' 
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Left Content Area */}
              <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                {/* Icon Box */}
                <div className={`p-3 rounded-2xl text-xl flex-shrink-0 border ${
                  !notif.read 
                    ? 'bg-indigo-100/80 border-indigo-200 text-indigo-800 shadow-xs' 
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {notif.icon}
                </div>

                {/* Body Details */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h4 className={`text-sm font-bold ${!notif.read ? 'text-slate-900 font-extrabold' : 'text-slate-800'}`}>
                      {notif.title}
                    </h4>

                    {/* Category Badge */}
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                      {notif.badge}
                    </span>

                    {/* Unread Status Pill */}
                    {!notif.read && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {notif.detail}
                  </p>

                  <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-400 font-medium">
                    <span>{notif.timestamp}</span>
                    <span>•</span>
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="hover:text-indigo-600 hover:underline transition"
                    >
                      {notif.read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                    {onNavigateTab && notif.category === 'Screening' && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => onNavigateTab('workbench')}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          View Screening ↗
                        </button>
                      </>
                    )}
                    {onNavigateTab && notif.category === 'Compliance' && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => onNavigateTab('popia')}
                          className="text-emerald-600 font-semibold hover:underline"
                        >
                          View POPIA Audit ↗
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center space-x-2 flex-shrink-0 pt-0.5">
                {/* Dismiss / Remove Button (X) */}
                <button
                  onClick={() => onRemoveNotification(notif.id)}
                  title="Remove notification"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
