'use client';

import React, { useState, useMemo } from 'react';
import { ActivityLogItem, UserProfile } from '@/types/wedding';
import { X, Clock, PlusCircle, Edit3, Trash2, CreditCard, Settings, ShieldCheck, User, Search, Filter } from 'lucide-react';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLogItem[];
  currentUserProfile: UserProfile | null;
  onOpenProfileModal?: () => void;
  showGold?: boolean;
  showShagun?: boolean;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  currentUserProfile,
  onOpenProfileModal,
  showGold = false,
  showShagun = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'EDIT' | 'ADD' | 'PAYMENT' | 'DELETE' | 'SETTING_CHANGE'>('ALL');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Confidential items check
      const text = `${log.entityName || ''} ${log.description || ''} ${log.diff?.field || ''} ${log.diff?.newValue || ''}`.toLowerCase();
      const isGold = text.includes('gold') || text.includes('jewelry') || text.includes('jewellery');
      if (isGold && !showGold) return false;

      const isShagun = text.includes('shagun');
      if (isShagun && !showShagun) return false;

      // Action type filter
      if (selectedFilter !== 'ALL' && log.actionType !== selectedFilter) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = log.userName.toLowerCase().includes(q);
      const matchDevice = log.deviceInfo.toLowerCase().includes(q);
      const matchEntity = log.entityName.toLowerCase().includes(q);
      const matchDesc = log.description.toLowerCase().includes(q);
      const matchField = log.diff?.field?.toLowerCase().includes(q);

      return matchName || matchDevice || matchEntity || matchDesc || matchField;
    });
  }, [logs, selectedFilter, searchQuery, showGold, showShagun]);

  if (!isOpen) return null;

  const getActionBadge = (action: ActivityLogItem['actionType']) => {
    switch (action) {
      case 'ADD':
        return {
          icon: <PlusCircle size={12} />,
          text: 'Added',
          className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
        };
      case 'EDIT':
        return {
          icon: <Edit3 size={12} />,
          text: 'Updated',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800'
        };
      case 'DELETE':
        return {
          icon: <Trash2 size={12} />,
          text: 'Deleted',
          className: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800'
        };
      case 'PAYMENT':
        return {
          icon: <CreditCard size={12} />,
          text: 'Payment',
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
        };
      default:
        return {
          icon: <Settings size={12} />,
          text: 'Setting',
          className: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800'
        };
    }
  };

  const formatLogTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.round(diffMs / 60000);

      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHrs = Math.round(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#11141D] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between flex-shrink-0 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔔</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Activity & Notification Log
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tamper-proof history of who changed what
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active User Session Card */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg p-1 bg-white dark:bg-slate-800 rounded-xl shadow-2xs border border-slate-200 dark:border-white/10">
              {currentUserProfile?.avatar || '👤'}
            </span>
            <div>
              <div className="font-bold text-slate-900 dark:text-white leading-tight">
                {currentUserProfile?.name || 'Guest User'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentUserProfile?.deviceInfo || 'Browser'}
              </div>
            </div>
          </div>

          {onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-slate-400 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
            >
              Switch Profile
            </button>
          )}
        </div>

        {/* Audit Log Security Note */}
        <div className="px-4 py-2 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/30 flex items-center gap-2 text-[10.5px] text-amber-800 dark:text-amber-300">
          <ShieldCheck size={14} className="flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Entries cannot be deleted from the browser. They accumulate permanently.</span>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:px-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/30 space-y-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, user, notes, field..."
              className="w-full pl-9 pr-7 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Action Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
            {(
              [
                { id: 'ALL', label: 'All' },
                { id: 'EDIT', label: '✏️ Updated' },
                { id: 'ADD', label: '➕ Added' },
                { id: 'PAYMENT', label: '💳 Payment' },
                { id: 'DELETE', label: '🗑️ Deleted' },
                { id: 'SETTING_CHANGE', label: '⚙️ Settings' },
              ] as const
            ).map((filter) => {
              const active = selectedFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer border ${
                    active
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xs font-bold'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {(searchQuery || selectedFilter !== 'ALL') && (
            <div className="flex items-center justify-between text-[10.5px] text-slate-400">
              <span>
                Showing {filteredLogs.length} of {logs.length} notifications
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('ALL');
                }}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100 dark:divide-white/5">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold">No activity logs recorded yet</p>
              <p className="text-[11px]">Any change made in the planner will appear here automatically.</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Search size={26} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold">No matching notifications found</p>
              <p className="text-[11px]">Try adjusting your search query or filter tags.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getActionBadge(log.actionType);

              return (
                <div key={log.id} className="pt-3 first:pt-0 space-y-1.5">
                  {/* Top Bar: User + Badge + Timestamp */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base flex-shrink-0">{log.userAvatar}</span>
                      <strong className="text-slate-900 dark:text-white truncate font-bold text-[12px]">
                        {log.userName}
                      </strong>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate">
                        ({log.deviceInfo})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${badge.className}`}>
                        {badge.icon}
                        <span>{badge.text}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatLogTime(log.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Main Description */}
                  <div className="text-xs text-slate-700 dark:text-slate-300 pl-6 leading-relaxed">
                    {log.description}
                  </div>

                  {/* Diff Details Pill if provided */}
                  {log.diff && log.diff.field && (
                    <div className="pl-6 pt-0.5">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                        <span className="font-bold">{log.diff.field}:</span>
                        {log.diff.oldValue !== undefined && log.diff.oldValue !== null && String(log.diff.oldValue) !== 'undefined' && (
                          <span className="line-through text-rose-500 dark:text-rose-400">{String(log.diff.oldValue)}</span>
                        )}
                        <span>➔</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {log.diff.newValue !== undefined && log.diff.newValue !== null && String(log.diff.newValue) !== 'undefined' 
                            ? String(log.diff.newValue) 
                            : 'Updated'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/50 text-center flex-shrink-0">
          <span className="text-[10px] text-slate-400">
            Total {logs.length} logged wedding audit events {filteredLogs.length !== logs.length && `(${filteredLogs.length} matching)`}
          </span>
        </div>

      </div>
    </>
  );
};

