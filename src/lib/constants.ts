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

// Vibrant Colorful Floral Wedding Palette
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Venue & Accommodation': '#F59E0B', // Marigold Amber
  'Catering & Dining': '#F43F5E',    // Rose Blossom Pink
  'Decor & Production': '#EC4899',   // Lotus Pink
  'Photography & Cinema': '#8B5CF6',// Lavender Violet
  'Attire, Jewelry & MUA': '#FB7185',// Bridal Peony Pink
  'Music & Entertainment': '#3B82F6',// Royal Groom Blue
  'Logistics & Shuttles': '#10B981', // Mint Green
  'Gifts, Shagun & Favors': '#F97316',// Sunset Peach
  'Ritual & Puja Items': '#EAB308', // Turmeric Haldi
  'Invitations & Miscellaneous': '#6366F1', // Indigo Floral
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
