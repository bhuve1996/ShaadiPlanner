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

// Modern Luxury Champagne Gold & Jewel Accent Palette
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Venue & Accommodation': '#F59E0B', // Amber Gold
  'Catering & Dining': '#EF4444',    // Ruby Red
  'Decor & Production': '#EAB308',   // Pure Gold
  'Photography & Cinema': '#A855F7',// Amethyst Violet
  'Attire, Jewelry & MUA': '#F43F5E',// Rose Diamond
  'Music & Entertainment': '#3B82F6',// Sapphire Blue
  'Logistics & Shuttles': '#10B981', // Emerald
  'Gifts, Shagun & Favors': '#D97706',// Warm Bronze
  'Ritual & Puja Items': '#F97316', // Sunset Fire
  'Invitations & Miscellaneous': '#94A3B8', // Platinum Slate
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
