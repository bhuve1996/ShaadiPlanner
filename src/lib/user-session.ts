'use client';

import { UserProfile } from '@/types/wedding';

const STORAGE_KEY_PROFILE = 'shaadi_planner_user_profile';
const STORAGE_KEY_LOGS = 'shaadi_planner_activity_logs';

export function getDeviceInfo(): string {
  if (typeof window === 'undefined') return 'Server';
  const ua = navigator.userAgent;
  let os = 'Device';
  if (ua.includes('iPhone')) os = 'iPhone';
  else if (ua.includes('iPad')) os = 'iPad';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'Mac';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Linux')) os = 'Linux';

  let browser = 'Browser';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  return `${os} ${browser}`;
}

export function getCurrentUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}

export const SUGGESTED_AVATARS = [
  { emoji: '🤵', label: 'Groom' },
  { emoji: '👰', label: 'Bride' },
  { emoji: '👑', label: 'Elders' },
  { emoji: '🌸', label: 'Family' },
  { emoji: '💍', label: 'Couple' },
  { emoji: '✨', label: 'Planner' },
  { emoji: '📸', label: 'Media' },
  { emoji: '🎉', label: 'Celebration' },
];

export const SUGGESTED_NAMES = [
  'Bhuvesh',
  'Harshu',
  'Papa Ji',
  'Mummy Ji',
  'Chacha Ji',
  'Bharti Di (Sister)',
  'Jiju',
  'Family Member',
];

