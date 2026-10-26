export type SplitType = 
  | 'EQUAL_50_50' 
  | 'GUEST_RATIO' 
  | 'GROOM_ONLY' 
  | 'BRIDE_ONLY' 
  | 'CUSTOM';

export type ExpenseCategory = 
  | 'Venue & Accommodation'
  | 'Catering & Dining'
  | 'Decor & Production'
  | 'Photography & Cinema'
  | 'Attire, Jewelry & MUA'
  | 'Music & Entertainment'
  | 'Logistics & Shuttles'
  | 'Gifts, Shagun & Favors'
  | 'Ritual & Puja Items'
  | 'Invitations & Miscellaneous';

export type WeddingEvent = 
  | 'All Events'
  | 'Roka / Engagement'
  | 'Mehendi'
  | 'Haldi'
  | 'Sangeet & Cocktail'
  | 'Baraat & Wedding Pheras'
  | 'Reception';

export interface ExpenseItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  event: WeddingEvent;
  vendorName?: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  splitType: SplitType;
  customGroomPercent?: number; // Used when splitType is CUSTOM
  
  // Smart Event/Occasion specific guest & per-plate fields
  isPerPlateCalculation?: boolean; // By default checked for catering/events!
  ratePerGuestOrPlate?: number; // e.g. 2000 per plate
  overrideGuestCount?: boolean;
  eventGroomGuests?: number;
  eventBrideGuests?: number;

  paidBy: 'GROOM' | 'BRIDE' | 'SHARED' | 'UNPAID';
  status: 'Estimated' | 'Booked' | 'Partially Paid' | 'Settled';
  notes?: string;
  dueDate?: string;
}

export interface WeddingSettings {
  coupleTitle: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  groomGuestCount: number;
  brideGuestCount: number;
  totalTargetBudget: number;
  currency: string;
}
