import { WeddingEvent, ExpenseCategory } from '@/types/wedding';

// High-fidelity, cinematic AI/curated wedding photography for Indian ceremonies & functions
export const EVENT_IMAGES: Record<WeddingEvent, {
  image: string;
  badge: string;
  color: string;
  subtext: string;
}> = {
  'All Events': {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
    badge: 'Royal Palace Celebration',
    color: '#8B5CF6',
    subtext: 'Full Wedding Celebration'
  },
  'Roka / Engagement': {
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80',
    badge: 'Diamond Rings & Shagun',
    color: '#EC4899',
    subtext: 'Roka & Engagement Pheras'
  },
  'Mehendi': {
    image: 'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=400&q=80',
    badge: 'Bridal Henna & Floral Poolside',
    color: '#10B981',
    subtext: 'Mehendi & Dholak Beats'
  },
  'Haldi': {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    badge: 'Turmeric Glow & Phoolon Ki Holi',
    color: '#F59E0B',
    subtext: 'Yellow Floral Ubtan Ceremony'
  },
  'Sangeet & Cocktail': {
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    badge: 'Starlight Beats, DJ & Dance',
    color: '#3B82F6',
    subtext: 'Cocktails & Dance Showdowns'
  },
  'Baraat & Wedding Pheras': {
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
    badge: 'Royal Rath, Varmala & 7 Pheras',
    color: '#F43F5E',
    subtext: 'Main Wedding & Holy Havan'
  },
  'Reception': {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80',
    badge: 'Gala Banquet & Grand Toast',
    color: '#6366F1',
    subtext: 'Reception Dinner & Blessings'
  },
};

// Rich image representations for Expense Categories
export const CATEGORY_HERO_IMAGES: Record<ExpenseCategory, string> = {
  'Venue & Accommodation': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
  'Catering & Dining': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80',
  'Decor & Production': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
  'Photography & Cinema': 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80',
  'Attire, Jewelry & MUA': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
  'Music & Entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
  'Logistics & Shuttles': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
  'Gifts, Shagun & Favors': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
  'Ritual & Puja Items': 'https://images.unsplash.com/photo-1609137144822-42177372d8fc?auto=format&fit=crop&w=300&q=80',
  'Invitations & Miscellaneous': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80',
};
