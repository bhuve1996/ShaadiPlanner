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
  | 'Vida (Bidai / Doli)'
  | 'Reception';

export interface ExpenseItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  event: WeddingEvent;
  vendorName?: string;
  imageUrl?: string; // Rich relevant photo thumbnail for each expense!
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  splitType: SplitType;
  customGroomPercent?: number;
  
  // Smart Event/Occasion specific guest & per-plate fields
  isPerPlateCalculation?: boolean;
  ratePerGuestOrPlate?: number;
  overrideGuestCount?: boolean;
  eventGroomGuests?: number;
  eventBrideGuests?: number;

  paidBy: 'GROOM' | 'BRIDE' | 'SHARED' | 'UNPAID';
  status: 'Estimated' | 'Booked' | 'Partially Paid' | 'Settled';
  notes?: string;
  dueDate?: string;
}

export interface CeremonyScheduleItem {
  id: string;
  title: WeddingEvent;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  emoji: string;
  image: string;
  description: string;
  tagColor: string;
  guestCount?: number;
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

export interface FamilyShagunItem {
  id: string;
  recipientName: string;
  relation: string; // e.g. 'Chache-Bhua', 'Chache, Mamma, Massi', 'Sister & Jiju', 'Niece'
  group: 'Chache-Bhua' | 'Mamma-Massi' | 'Sisters & In-laws' | 'Cousins & Youth' | 'Custom Rituals / Shagun' | 'General Family';
  amount: number;
  calculationFormula?: string; // e.g. '8 × ₹5,100', '₹75,000 + ₹2,50,000 + 3 × ₹5,100 + ₹10,000'
  status: 'Planned' | 'Given' | 'Pending Confirmation';
  notes?: string;
  side: 'GROOM' | 'BRIDE';
}

export interface GuestGroupItem {
  id: string;
  name: string; // e.g. 'Jagadhri Relatives', 'College Friends', 'Office Colleagues', 'Bhua & Chacha Parivaar'
  side: 'GROOM' | 'BRIDE' | 'BOTH';
  count: number;
  estimatedPerPlate?: number;
  contactPerson?: string;
  contactPhone?: string;
  isAnonymousNumbers?: boolean; // toggle if only anonymous number count is entered
  notes?: string;
}

export interface FamilyShagunItem {
  id: string;
  recipientName: string;
  relation: string; // e.g. 'Chache-Bhua', 'Chache, Mamma, Massi', 'Sister & Jiju', 'Niece'
  group: 'Chache-Bhua' | 'Mamma-Massi' | 'Sisters & In-laws' | 'Cousins & Youth' | 'Custom Rituals / Shagun' | 'General Family';
  amount: number;
  calculationFormula?: string; // e.g. '8 × ₹5,100', '₹75,000 + ₹2,50,000 + 3 × ₹5,100 + ₹10,000'
  status: 'Planned' | 'Given' | 'Pending Confirmation';
  notes?: string;
  side: 'GROOM' | 'BRIDE';
}

export interface GuestGroupItem {
  id: string;
  name: string; // e.g. 'Jagadhri Relatives', 'College Friends', 'Office Colleagues', 'Bhua & Chacha Parivaar'
  side: 'GROOM' | 'BRIDE' | 'BOTH';
  count: number;
  estimatedPerPlate?: number;
  contactPerson?: string;
  contactPhone?: string;
  isAnonymousNumbers?: boolean; // toggle if only anonymous number count is entered
  notes?: string;
}
