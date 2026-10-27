'use client';

import React from 'react';
import { ActivityLogItem, UserProfile } from '@/types/wedding';
import { X, Clock, PlusCircle, Edit3, Trash2, CreditCard, Settings, ShieldCheck, User } from 'lucide-react';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLogItem[];
  currentUserProfile: UserProfile | null;
  onOpenProfileModal?: () => void;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  currentUserProfile,
  onOpenProfileModal,
}) => {
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

        {/* Scrollable Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100 dark:divide-white/5">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold">No activity logs recorded yet</p>
              <p className="text-[11px]">Any change made in the planner will appear here automatically.</p>
            </div>
          ) : (
            logs.map((log) => {
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
                        {log.diff.oldValue !== undefined && (
                          <span className="line-through text-rose-500 dark:text-rose-400">{String(log.diff.oldValue)}</span>
                        )}
                        <span>➔</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{String(log.diff.newValue)}</span>
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
            Total {logs.length} logged wedding audit events
          </span>
        </div>

      </div>
    </>
  );
};

