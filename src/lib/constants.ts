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

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Venue & Accommodation': '#D97706', // Amber
  'Catering & Dining': '#DC2626',    // Crimson Red
  'Decor & Production': '#E11D48',   // Rose
  'Photography & Cinema': '#7C3AED',// Royal Purple
  'Attire, Jewelry & MUA': '#DB2777',// Fuchsia/Pink
  'Music & Entertainment': '#2563EB',// Royal Blue
  'Logistics & Shuttles': '#059669', // Emerald
  'Gifts, Shagun & Favors': '#CA8A04',// Golden Yellow
  'Ritual & Puja Items': '#EA580C', // Saffron / Marigold
  'Invitations & Miscellaneous': '#64748B', // Slate
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

