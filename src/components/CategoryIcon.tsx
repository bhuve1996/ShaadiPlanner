'use client';

import React from 'react';
import { 
  Building2, 
  UtensilsCrossed, 
  Sparkles, 
  Camera, 
  Crown, 
  Music, 
  Car, 
  Gift, 
  Flame, 
  Mail, 
  HelpCircle 
} from 'lucide-react';
import { ExpenseCategory } from '@/types/wedding';
import { CATEGORY_COLORS } from '@/lib/constants';
import { CATEGORY_HERO_IMAGES } from '@/lib/event-images';

interface CategoryIconProps {
  category: ExpenseCategory;
  className?: string;
  size?: number;
  showBadge?: boolean;
  showImageThumbnail?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  className = "w-4 h-4", 
  size = 18,
  showBadge = false,
  showImageThumbnail = true
}) => {
  const getIcon = () => {
    switch (category) {
      case 'Venue & Accommodation':
        return <Building2 size={size} />;
      case 'Catering & Dining':
        return <UtensilsCrossed size={size} />;
      case 'Decor & Production':
        return <Sparkles size={size} />;
      case 'Photography & Cinema':
        return <Camera size={size} />;
      case 'Attire, Jewelry & MUA':
        return <Crown size={size} />;
      case 'Music & Entertainment':
        return <Music size={size} />;
      case 'Logistics & Shuttles':
        return <Car size={size} />;
      case 'Gifts, Shagun & Favors':
        return <Gift size={size} />;
      case 'Ritual & Puja Items':
        return <Flame size={size} />;
      case 'Invitations & Miscellaneous':
      default:
        return <Mail size={size} />;
    }
  };

  const color = CATEGORY_COLORS[category] || '#E5C388';
  const imgUrl = CATEGORY_HERO_IMAGES[category];

  if (showImageThumbnail && imgUrl) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-white/60 dark:border-white/10 shadow-xs flex-shrink-0 ${className}`} style={{ width: size + 10, height: size + 10 }}>
        <img 
          src={imgUrl} 
          alt={category} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  if (showBadge) {
    return (
      <div 
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
        style={{ 
          backgroundColor: `${color}18`, 
          borderColor: `${color}40`,
          color: color 
        }}
      >
        {getIcon()}
        <span>{category}</span>
      </div>
    );
  }

  return (
    <span style={{ color }} className={`inline-flex items-center justify-center ${className}`}>
      {getIcon()}
    </span>
  );
};
