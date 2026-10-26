import { ExpenseItem, WeddingSettings } from '@/types/wedding';

export const INITIAL_SETTINGS: WeddingSettings = {
  coupleTitle: "Bhuvesh & Partner's Wedding",
  groomName: "Bhuvesh (Groom)",
  brideName: "Bride's Side",
  weddingDate: "2026-11-28",
  groomGuestCount: 220,
  brideGuestCount: 180,
  totalTargetBudget: 3500000, // 35 Lakhs
  currency: "INR",
};

// Initial state: Start phase (Planning & Estimations, advance payments yet to be made)
export const INITIAL_EXPENSES: ExpenseItem[] = [
  // 1. Venue & Stay
  {
    id: 'exp-1',
    name: 'Palace Resort Main Lawn & Banquet Booking',
    category: 'Venue & Accommodation',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Heritage Palace Resort',
    estimatedCost: 850000,
    actualCost: 850000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-15',
    notes: 'Quotation received. 25% booking advance to be finalized.'
  },
  {
    id: 'exp-2',
    name: 'Guest Rooms (50 Deluxe Rooms for 2 Nights)',
    category: 'Venue & Accommodation',
    event: 'All Events',
    vendorName: 'Heritage Palace Stay',
    estimatedCost: 600000,
    actualCost: 600000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO', // Split by guest count ratio
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-20',
    notes: 'Rooms to be split based on 220 Groom guests vs 180 Bride guests.'
  },

  // 2. Catering & Dining
  {
    id: 'exp-3',
    name: 'Wedding Grand Dinner Buffet (Live Stalls & Rajasthani Counter)',
    category: 'Catering & Dining',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Royal Flavours Caterers',
    estimatedCost: 620000,
    actualCost: 620000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-28',
    notes: '400 guest plates @ 1,550/plate. Per-guest ratio split.'
  },
  {
    id: 'exp-4',
    name: 'Sangeet Cocktails & High-Tea Chaat Counters',
    category: 'Catering & Dining',
    event: 'Sangeet & Cocktail',
    vendorName: 'Royal Flavours Caterers',
    estimatedCost: 240000,
    actualCost: 240000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'High-tea chaat counters and mocktail/cocktail bar.'
  },

  // 3. Decor & Production
  {
    id: 'exp-5',
    name: 'Mandap, Floral Decor & Grand Varmala Stage',
    category: 'Decor & Production',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Blooms & Vows Designers',
    estimatedCost: 480000,
    actualCost: 480000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-25',
    notes: 'Exotic marigold, tuberose & rose theme with fairy lights truss.'
  },
  {
    id: 'exp-6',
    name: 'Haldi Yellow Backdrop & Floral Phoolon Ki Holi Setup',
    category: 'Decor & Production',
    event: 'Haldi',
    vendorName: 'Blooms & Vows Designers',
    estimatedCost: 70000,
    actualCost: 70000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
  },

  // 4. Photography & Cinema
  {
    id: 'exp-7',
    name: 'Candid Photography, Drone & Cinematic Wedding Film',
    category: 'Photography & Cinema',
    event: 'All Events',
    vendorName: 'ShutterGlory Wedding Studios',
    estimatedCost: 350000,
    actualCost: 350000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-12-05',
    notes: 'Shortlisting team: 4-day coverage + teaser film + traditional album.'
  },

  // 5. Attire, Jewelry & MUA
  {
    id: 'exp-8',
    name: 'Bridal Luxury Lehenga & Reception Outfit',
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Heritage Bridal Couture',
    estimatedCost: 300000,
    actualCost: 300000,
    paidAmount: 0,
    splitType: 'BRIDE_ONLY',
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Bride side outfit budget allocation.'
  },
  {
    id: 'exp-9',
    name: 'Groom Silk Sherwani, Safa & Stole',
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Manyavar / Regalia',
    estimatedCost: 90000,
    actualCost: 90000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY',
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Groom side sherwani & accessories.'
  },
  {
    id: 'exp-10',
    name: 'Bridal Makeup Artist (Sangeet + Wedding HD Makeup)',
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Glamour Studio',
    estimatedCost: 85000,
    actualCost: 85000,
    paidAmount: 0,
    splitType: 'BRIDE_ONLY',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-28',
    notes: 'Bridal airbrush + 2 family siders.'
  },

  // 6. Music & Entertainment
  {
    id: 'exp-11',
    name: 'DJ, Sound & LED Wall console for Sangeet',
    category: 'Music & Entertainment',
    event: 'Sangeet & Cocktail',
    vendorName: 'DJ Harsh Beats',
    estimatedCost: 120000,
    actualCost: 120000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-27',
  },
  {
    id: 'exp-12',
    name: 'Punjabi Dhol Tasha Troupe for Baraat',
    category: 'Music & Entertainment',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'King Dholis',
    estimatedCost: 35000,
    actualCost: 35000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY',
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: '5 Dholis for Baraat procession.'
  },

  // 7. Logistics & Shuttles
  {
    id: 'exp-13',
    name: 'Airport / Railway Guest Pickups & 2 Tempo Travellers',
    category: 'Logistics & Shuttles',
    event: 'All Events',
    vendorName: 'Aman Tour & Travels',
    estimatedCost: 95000,
    actualCost: 95000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-29',
  },

  // 8. Gifts, Shagun & Favors
  {
    id: 'exp-14',
    name: 'Welcome Hampers & Dry Fruit Gift Boxes for Guests',
    category: 'Gifts, Shagun & Favors',
    event: 'All Events',
    vendorName: 'Sweet Treats Artisanal',
    estimatedCost: 115000,
    actualCost: 115000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO',
    paidBy: 'UNPAID',
    status: 'Estimated',
  },

  // 9. Ritual & Puja Items
  {
    id: 'exp-15',
    name: 'Pandit Ji Dakshina & Havan Samagri',
    category: 'Ritual & Puja Items',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Acharya Shastri',
    estimatedCost: 31000,
    actualCost: 31000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-28',
  }
];
