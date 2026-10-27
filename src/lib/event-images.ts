import { WeddingEvent, ExpenseCategory } from '@/types/wedding';

export interface EventImageInfo {
  image: string;
  badge: string;
  color: string;
  subtext: string;
}

export const EVENT_IMAGES: Record<WeddingEvent, EventImageInfo> = {
  'All Events': {
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
    badge: '🌟 Overall Celebration',
    color: '#8B5CF6',
    subtext: 'Complete 3-Day Wedding Events'
  },
  'Roka / Engagement': {
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80',
    badge: '💍 Roka & Ring Ceremony',
    color: '#EC4899',
    subtext: 'Ring Exchange, Sweets & Blessings'
  },
  'Mehendi': {
    image: 'https://images.unsplash.com/photo-1560963805-6c6441a9bc25?auto=format&fit=crop&w=300&q=80',
    badge: '🌿 Mehendi Sundowner',
    color: '#10B981',
    subtext: 'Henna, Folk Songs & Sitar'
  },
  'Haldi': {
    image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=300&q=80',
    badge: '💛 Vibrant Haldi Morning',
    color: '#F59E0B',
    subtext: 'Yellow Floral Ubtan & Flowers'
  },
  'Sangeet & Cocktail': {
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
    badge: '🎶 Sangeet & Cocktail Bash',
    color: '#3B82F6',
    subtext: 'Dance Performances & DJ Night'
  },
  'Baraat & Wedding Pheras': {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    badge: '🔥 Royal Baraat & Pheras',
    color: '#E11D48',
    subtext: 'Havan Kund, 7 Vows & Kanyadaan'
  },
  'Vida (Bidai / Doli)': {
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
    badge: '🌸 Emotional Vida Ceremony',
    color: '#D97706',
    subtext: 'Doli Departure & Family Blessings'
  },
  'Reception': {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
    badge: '🥂 Grand Gala Reception',
    color: '#6366F1',
    subtext: 'Reception Dinner & Blessings'
  },
};

// Rich image representations for Expense Categories
export const CATEGORY_HERO_IMAGES: Record<ExpenseCategory, string> = {
  'Gold & Fine Jewelry': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
  'Catering, Food & Sweets': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80',
  'Venue & Accommodation': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
  'Attire & Wardrobe': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
  'Makeup & Bridal Care': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
  'Gifts, Shagun & Favors': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
  'Decor & Production': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
  'Photography & Cinema': 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80',
  'Music & Entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
  'Logistics & Shuttles': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
  'Ritual & Puja Items': 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=300&q=80',
  'Invitations & Miscellaneous': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80',
};
