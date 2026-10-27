export type SplitType = 
  | 'EQUAL_50_50' 
  | 'GUEST_RATIO' 
  | 'GROOM_ONLY' 
  | 'BRIDE_ONLY' 
  | 'CUSTOM';

export type ExpensePayerCategory = 
  | 'COUPLE'          // Bhuvesh / Harshu personal expense
  | 'PARENTS'         // Parents / Family expense
  | 'SHARED_FAMILY';  // Mutual / Joint family expense

export type ExpenseCategory = 
  | 'Gold & Fine Jewelry'
  | 'Catering, Food & Sweets'
  | 'Venue & Accommodation'
  | 'Attire & Wardrobe'
  | 'Makeup & Bridal Care'
  | 'Gifts, Shagun & Favors'
  | 'Decor & Production'
  | 'Photography & Cinema'
  | 'Music & Entertainment'
  | 'Logistics & Shuttles'
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

export interface SubTaskItem {
  id: string;
  name: string; // e.g. "Sister Gold Jewelry", "Jiju Gold Ring", "Shagun Envelopes"
  cost: number;
  paidAmount?: number;
  status: 'Pending' | 'Purchased' | 'Done';
  label?: string; // e.g. "Jewelry", "Shagun", "Shopping", "Attire", "Ritual"
  notes?: string; // Individual notes specific to this subtask
}

export interface ExpenseItem {
  id: string;
  name: string;
  subname?: string; // Concise secondary description or sub-label
  category: ExpenseCategory;
  event: WeddingEvent;
  
  // Vendor details & contacts
  vendorName?: string;
  vendorContactPerson?: string; // e.g. "Mr. Rajesh Sharma (Manager)"
  vendorPhone?: string;         // e.g. "+91 98765 43210"
  
  // Internal Family Lead / Responsibility Handler
  internalLeadPerson?: string;  // e.g. "Chacha Ji", "Bhuvesh", "Father", "Mamma Ji Jagadhri"
  internalLeadPhone?: string;

  imageUrl?: string; // Rich relevant photo thumbnail for each expense!
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  splitType: SplitType;
  customGroomPercent?: number;
  customGroomCost?: number;
  customBrideCost?: number;
  payerCategory?: ExpensePayerCategory; // Couple (Bhuvesh/Harshu) vs Parents/Family
  
  // Subtasks & Sub-costs breakdown (e.g. Gold split into mangalsutra, bangles; Gifts split into makeup, sandals, 7/11/21 suits)
  subtasks?: SubTaskItem[];
  
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

export interface VendorDirectoryItem {
  id: string;
  category: ExpenseCategory | string;
  vendorBusinessName: string;
  contactPerson: string;
  phone: string;
  alternatePhone?: string;
  locationCity?: string;
  internalResponsiblePerson: string; // Who from our family is handling this
  serviceDescription: string;
  status: 'Shortlisted' | 'Advance Paid' | 'Confirmed' | 'Completed';
  totalAgreedAmount?: number;
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

export interface CeremonyGuestCountItem {
  event: WeddingEvent;
  groomGuests: number;
  brideGuests: number;
  perPlateRate?: number;
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
  eventGuestCounts?: Record<string, { groom: number; bride: number; perPlateRate?: number }>;
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
  name: string; // e.g. 'Jagadhri Relatives', 'College Friends', 'Office Colleagues', 'Sharma Family (+3)'
  side: 'GROOM' | 'BRIDE' | 'BOTH';
  count: number; // Total count (e.g. 1 for individual, 4 for individual + 3, or cluster headcount)
  guestType?: 'INDIVIDUAL' | 'FAMILY_PLUS' | 'CLUSTER'; // Individual guest, Family with plus count, or group cluster
  plusCount?: number; // Additional family/plus count e.g. +1, +2, +3, +4
  relationCategory?: 'Family' | 'Relatives' | 'Friends' | 'Colleagues' | 'Neighbours' | 'VIP';
  relation?: string; // Exact specific relation e.g. 'Mamma Ji', 'Chachi Ji', 'College Roommate', 'Bhua Ji'
  shagunAmount?: number; // Expected or designated shagun gift amount e.g. 5100, 11000
  shagunCeremony?: string; // When/which ceremony shagun is given e.g. 'Roka / Engagement', 'Baraat / Milni', 'Haldi', 'Reception'
  shagunStatus?: 'Planned' | 'Given' | 'Pending'; // Status of shagun
  rsvpStatus?: 'Attending' | 'Invited' | 'Tentative' | 'Declined';
  city?: string;
  estimatedPerPlate?: number;
  contactPerson?: string; // Contact person / guest full name
  contactPhone?: string; // Phone number for RSVP and WhatsApp invite
  isAnonymousNumbers?: boolean; // toggle if only anonymous number count is entered
  notes?: string;
}

export interface UserProfile {
  id: string; // unique device or user id
  name: string; // e.g. "Bhuvesh", "Harshu", "Papa", "Chacha Ji"
  avatar: string; // emoji or avatar icon e.g. "🤵", "👰", "👑", "🌸"
  role?: string; // e.g. "Groom", "Bride", "Family Elder", "Organizer"
  deviceInfo: string; // e.g. "iPhone Safari", "Mac Chrome"
  createdAt: string;
}

export type ActivityActionType = 'ADD' | 'EDIT' | 'DELETE' | 'PAYMENT' | 'SETTING_CHANGE';

export interface ActivityLogItem {
  id: string;
  weddingId: string;
  userName: string;
  userAvatar: string;
  deviceInfo: string;
  actionType: ActivityActionType;
  entityType: 'expense' | 'schedule' | 'shagun' | 'vendor' | 'settings';
  entityName: string;
  description: string;
  diff?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
  };
  createdAt: string;
}
