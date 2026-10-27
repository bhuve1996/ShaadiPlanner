'use client';

import { ActivityLogItem, UserProfile } from '@/types/wedding';
import { supabase, isSupabaseConfigured } from './supabase';
import { getCurrentUserProfile, getDeviceInfo } from './user-session';

const WEDDING_ID = 'bhuvesh-harsha-wedding';
const LOCAL_LOGS_KEY = 'shaadi_planner_activity_logs_v1';
const SYSTEM_LOGS_SYNC_ID = 'system-sync-activity-logs';

// Seed initial system activities so the log has context from start
export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-seed-1',
    weddingId: WEDDING_ID,
    userName: 'ShaadiPlanner System',
    userAvatar: '✨',
    deviceInfo: 'System Default',
    actionType: 'SETTING_CHANGE',
    entityType: 'settings',
    entityName: 'Target Wedding Budget',
    description: 'Target Budget synchronized to ₹55,54,600 (₹50,41,000 ledger + ₹5,13,600 family shagun buffer).',
    createdAt: '2026-10-27T13:50:00.000Z'
  },
  {
    id: 'log-seed-2',
    weddingId: WEDDING_ID,
    userName: 'Bhuvesh & Harsha',
    userAvatar: '💍',
    deviceInfo: 'Planner Ledger',
    actionType: 'ADD',
    entityType: 'expense',
    entityName: 'Wedding Invitation Cards & Envelopes',
    description: 'Added wedding cards & envelopes expense of ₹24,000 split equally 50:50 (₹12,000 Harsha + ₹12,000 Bhuvi).',
    createdAt: '2026-10-27T13:49:00.000Z'
  },
  {
    id: 'log-seed-3',
    weddingId: WEDDING_ID,
    userName: 'Bhuvesh & Harsha',
    userAvatar: '👑',
    deviceInfo: 'Planner Ledger',
    actionType: 'EDIT',
    entityType: 'expense',
    entityName: 'Palace Resort & 2-Day Stay',
    description: 'Updated stay to 2 days base rooms & meals (₹5,00,000) with zero-cost placeholder for 13 extra rooms and food.',
    createdAt: '2026-10-27T12:31:00.000Z'
  }
];

export async function fetchActivityLogs(): Promise<ActivityLogItem[]> {
  let logs: ActivityLogItem[] = [];

  // 1. Try remote Supabase cloud sync first
  if (isSupabaseConfigured() && supabase) {
    try {
      // Primary: Check dedicated system row in vendor_directory
      const { data, error } = await supabase
        .from('vendor_directory')
        .select('service_description')
        .eq('id', SYSTEM_LOGS_SYNC_ID)
        .maybeSingle();

      if (!error && data?.service_description) {
        try {
          const parsed = JSON.parse(data.service_description);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Also update local cache for smooth offline viewing
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(parsed));
              } catch {
                // Ignore storage quota
              }
            }
            return parsed;
          }
        } catch (jsonErr) {
          console.warn('Error parsing cloud activity logs JSON:', jsonErr);
        }
      }
    } catch (e) {
      console.warn('Could not load activity logs from Supabase cloud:', e);
    }
  }

  // 2. LocalStorage Fallback (Never deleted by viewers, piles up)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_LOGS_KEY);
      if (raw) {
        logs = JSON.parse(raw);
      } else {
        logs = INITIAL_ACTIVITY_LOGS;
        localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(logs));
      }
    } catch {
      logs = INITIAL_ACTIVITY_LOGS;
    }
  }

  return logs;
}

export async function recordActivityLog(params: {
  actionType: ActivityLogItem['actionType'];
  entityType: ActivityLogItem['entityType'];
  entityName: string;
  description: string;
  diff?: ActivityLogItem['diff'];
  userProfile?: UserProfile | null;
}): Promise<ActivityLogItem> {
  const profile = params.userProfile || getCurrentUserProfile();
  const userName = profile?.name || 'Family Guest';
  const userAvatar = profile?.avatar || '👤';
  const deviceInfo = profile?.deviceInfo || getDeviceInfo();

  const newLog: ActivityLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    weddingId: WEDDING_ID,
    userName,
    userAvatar,
    deviceInfo,
    actionType: params.actionType,
    entityType: params.entityType,
    entityName: params.entityName,
    description: params.description,
    diff: params.diff,
    createdAt: new Date().toISOString()
  };

  // Get current logs
  let currentLogs: ActivityLogItem[] = [];
  try {
    currentLogs = await fetchActivityLogs();
  } catch {
    currentLogs = INITIAL_ACTIVITY_LOGS;
  }
  const updatedLogs = [newLog, ...currentLogs.filter(l => l.id !== newLog.id)];

  // 1. Save to local storage (piles up permanently, no delete button for viewers)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      console.error('Local log save error:', e);
    }
  }

  // 2. Save directly to Supabase cloud
  if (isSupabaseConfigured() && supabase) {
    try {
      // Upsert the full audit log chain into Supabase cloud table (capped at latest 150 items)
      const cappedLogs = updatedLogs.slice(0, 150);
      await supabase.from('vendor_directory').upsert({
        id: SYSTEM_LOGS_SYNC_ID,
        wedding_id: WEDDING_ID,
        category: 'System Activity',
        vendor_business_name: 'Activity Audit Logs Cloud Sync',
        contact_person: 'System Logger',
        phone: '0000000000',
        alternate_phone: '',
        location_city: 'Cloud',
        internal_responsible_person: 'Bhuvesh',
        service_description: JSON.stringify(cappedLogs),
        status: 'Confirmed',
        total_agreed_amount: 0
      });
    } catch (err) {
      console.error('Error syncing activity log to cloud:', err);
    }
  }

  return newLog;
}

