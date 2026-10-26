import { ExpenseCategory } from '@/types/wedding';

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  'Venue & Accommodation': 'Building2',
  'Catering & Dining': 'UtensilsCrossed',
  'Decor & Production': 'Sparkles',
  'Photography & Cinema': 'Camera',
  'Attire, Jewelry & MUA': 'Crown',
  'Music & Entertainment': 'Music',
  'Logistics & Shuttles': 'Car',
  'Gifts, Shagun & Favors': 'Gift',
  'Ritual & Puja Items': 'Flame',
  'Invitations & Miscellaneous': 'Mail',
};

// Auspicious wedding palette: Sindoor Red, Marigold Gold, Royal Emerald, Haldi Yellow, Peacock Blue, Gulabi Pink
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Venue & Accommodation': '#C2410C', // Royal Terracotta / Palace Amber
  'Catering & Dining': '#B91C1C',    // Sacred Sindoor Red
  'Decor & Production': '#D97706',   // Rich Marigold Gold
  'Photography & Cinema': '#7E22CE',// Royal Rani Purple
  'Attire, Jewelry & MUA': '#E11D48',// Gulabi Rani Pink
  'Music & Entertainment': '#1D4ED8',// Royal Peacock Blue
  'Logistics & Shuttles': '#047857', // Auspicious Mehendi Emerald
  'Gifts, Shagun & Favors': '#B45309',// Shagun Warm Gold
  'Ritual & Puja Items': '#EA580C', // Sacred Havan Flame
  'Invitations & Miscellaneous': '#854D0E', // Golden Antique Scroll
};

export function formatINR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

export function formatLakh(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  return formatINR(val);
}
