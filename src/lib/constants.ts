import { ExpenseCategory } from '@/types/wedding';

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  'Gold & Fine Jewelry': 'Crown',
  'Catering, Food & Sweets': 'UtensilsCrossed',
  'Venue & Accommodation': 'Building2',
  'Attire & Wardrobe': 'Sparkles',
  'Makeup & Bridal Care': 'Flower2',
  'Gifts, Shagun & Favors': 'Gift',
  'Decor & Production': 'Sparkles',
  'Photography & Cinema': 'Camera',
  'Music & Entertainment': 'Music',
  'Logistics & Shuttles': 'Car',
  'Ritual & Puja Items': 'Flame',
  'Invitations & Miscellaneous': 'Mail',
};

// Elegant, balanced wedding palette (not overly loud or muddy)
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Gold & Fine Jewelry': '#EAB308',       // Warm Indian Gold
  'Catering, Food & Sweets': '#F97316',   // Saffron / Warm Tangerine
  'Venue & Accommodation': '#3B82F6',     // Royal Slate Blue
  'Attire & Wardrobe': '#EC4899',         // Bridal Rose
  'Makeup & Bridal Care': '#A855F7',      // Radiant Orchid
  'Gifts, Shagun & Favors': '#10B981',    // Auspicious Emerald Green
  'Decor & Production': '#06B6D4',        // Cyan Teal
  'Photography & Cinema': '#6366F1',      // Classic Indigo
  'Music & Entertainment': '#8B5CF6',     // Violet Beats
  'Logistics & Shuttles': '#64748B',      // Slate Grey
  'Ritual & Puja Items': '#D97706',       // Amber Haldi
  'Invitations & Miscellaneous': '#475569',// Charcoal Slate
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
