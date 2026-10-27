'use client';

import { ActivityLogItem, UserProfile } from '@/types/wedding';
import { supabase, isSupabaseConfigured } from './supabase';
import { getCurrentUserProfile, getDeviceInfo } from './user-session';

const WEDDING_ID = 'bhuvesh-harsha-wedding';
const LOCAL_LOGS_KEY = 'shaadi_planner_activity_logs_v1';

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

  // 1. Try remote Supabase first
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('wedding_id', WEDDING_ID)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        logs = data.map((d: any) => ({
          id: d.id,
          weddingId: d.wedding_id || WEDDING_ID,
          userName: d.user_name,
          userAvatar: d.user_avatar || '👤',
          deviceInfo: d.device_info || 'Browser',
          actionType: d.action_type,
          entityType: d.entity_type,
          entityName: d.entity_name,
          description: d.description,
          diff: d.diff || undefined,
          createdAt: d.created_at
        }));
        return logs;
      }
    } catch {
      // Fall through to local fallback
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

  // 1. Save to local storage (piles up permanently, no delete button for viewers)
  if (typeof window !== 'undefined') {
    try {
      const current = await fetchActivityLogs();
      const updated = [newLog, ...current];
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Local log save error:', e);
    }
  }

  // 2. Save to Supabase (if activity_logs table exists)
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('activity_logs').insert({
        id: newLog.id,
        wedding_id: WEDDING_ID,
        user_name: newLog.userName,
        user_avatar: newLog.userAvatar,
        device_info: newLog.deviceInfo,
        action_type: newLog.actionType,
        entity_type: newLog.entityType,
        entity_name: newLog.entityName,
        description: newLog.description,
        diff: newLog.diff,
        created_at: newLog.createdAt
      });
    } catch {
      // Ignored if table not created on server
    }
  }

  return newLog;
}

