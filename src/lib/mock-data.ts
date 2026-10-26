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

export const INITIAL_EXPENSES: ExpenseItem[] = [
  // 1. Venue & Stay
  {
    id: 'exp-1',
    name: 'Palace Resort Main Lawn & Banquet Booking',
    category: 'Venue & Accommodation',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Heritage Palace Resort',
    estimatedCost: 800000,
    actualCost: 850000,
    paidAmount: 500000,
    splitType: 'EQUAL_50_50',
    paidBy: 'SHARED',
    status: 'Partially Paid',
    dueDate: '2026-11-15',
    notes: 'Advance 5L paid jointly. Balance due 2 weeks before wedding.'
  },
  {
    id: 'exp-2',
    name: 'Guest Rooms (50 Deluxe Rooms for 2 Nights)',
    category: 'Venue & Accommodation',
    event: 'All Events',
    vendorName: 'Heritage Palace Stay',
    estimatedCost: 600000,
    actualCost: 600000,
    paidAmount: 300000,
    splitType: 'GUEST_RATIO', // Split by guest ratio
    paidBy: 'SHARED',
    status: 'Partially Paid',
    dueDate: '2026-11-20',
    notes: 'Rooms allocation split based on 220 Groom guests vs 180 Bride guests.'
  },

  // 2. Catering & Dining
  {
    id: 'exp-3',
    name: 'Wedding Grand Dinner Buffet (Live Stalls & Rajasthani Counter)',
    category: 'Catering & Dining',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Royal Flavours Caterers',
    estimatedCost: 600000,
    actualCost: 620000,
    paidAmount: 200000,
    splitType: 'GUEST_RATIO',
    paidBy: 'GROOM',
    status: 'Partially Paid',
    dueDate: '2026-11-28',
    notes: '400 plates @ 1550/plate. Split proportionately based on guests.'
  },
  {
    id: 'exp-4',
    name: 'Sangeet Cocktails & High-Tea Chaat Counters',
    category: 'Catering & Dining',
    event: 'Sangeet & Cocktail',
    vendorName: 'Royal Flavours Caterers',
    estimatedCost: 250000,
    actualCost: 240000,
    paidAmount: 240000,
    splitType: 'EQUAL_50_50',
    paidBy: 'BRIDE',
    status: 'Settled',
    notes: 'Full payment cleared by Bride side.'
  },

  // 3. Decor & Production
  {
    id: 'exp-5',
    name: 'Mandap, Floral Decor & Grand Varmala Stage',
    category: 'Decor & Production',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Blooms & Vows Designers',
    estimatedCost: 450000,
    actualCost: 480000,
    paidAmount: 250000,
    splitType: 'EQUAL_50_50',
    paidBy: 'SHARED',
    status: 'Partially Paid',
    dueDate: '2026-11-25',
    notes: 'Exotic marigold, tuberose & rose theme with fairy lights truss.'
  },
  {
    id: 'exp-6',
    name: 'Haldi Yellow Backdrop & Floral Phoolon Ki Holi Setup',
    category: 'Decor & Production',
    event: 'Haldi',
    vendorName: 'Blooms & Vows Designers',
    estimatedCost: 75000,
    actualCost: 70000,
    paidAmount: 70000,
    splitType: 'EQUAL_50_50',
    paidBy: 'GROOM',
    status: 'Settled',
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
    paidAmount: 150000,
    splitType: 'EQUAL_50_50',
    paidBy: 'SHARED',
    status: 'Partially Paid',
    dueDate: '2026-12-05',
    notes: '4-day shoot including pre-wedding teaser + traditional album.'
  },

  // 5. Attire, Jewelry & MUA
  {
    id: 'exp-8',
    name: 'Bridal Luxury Lehenga & Reception Gown',
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Heritage Couture Chandni Chowk',
    estimatedCost: 280000,
    actualCost: 310000,
    paidAmount: 310000,
    splitType: 'BRIDE_ONLY',
    paidBy: 'BRIDE',
    status: 'Settled',
    notes: '100% Bride side outfit.'
  },
  {
    id: 'exp-9',
    name: 'Groom Silk Sherwani, Safa & Stole',
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Manyavar / Royal Regalia',
    estimatedCost: 95000,
    actualCost: 90000,
    paidAmount: 90000,
    splitType: 'GROOM_ONLY',
    paidBy: 'GROOM',
    status: 'Settled',
    notes: '100% Groom side outfit.'
  },
  {
    id: 'exp-10',
    name: 'Bridal Makeup Artist (Sangeet + Wedding HD Makeup)',
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Glamour by Simran Studio',
    estimatedCost: 80000,
    actualCost: 85000,
    paidAmount: 40000,
    splitType: 'BRIDE_ONLY',
    paidBy: 'BRIDE',
    status: 'Partially Paid',
    dueDate: '2026-11-28',
    notes: 'Airbrush bridal + 2 family siders.'
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
    paidAmount: 60000,
    splitType: 'EQUAL_50_50',
    paidBy: 'GROOM',
    status: 'Partially Paid',
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
    paidAmount: 35000,
    splitType: 'GROOM_ONLY',
    paidBy: 'GROOM',
    status: 'Settled',
    notes: '5 Dholis for Baraat procession.'
  },

  // 7. Logistics & Shuttles
  {
    id: 'exp-13',
    name: 'Airport / Railway Guest Pickups & 2 Tempo Travellers',
    category: 'Logistics & Shuttles',
    event: 'All Events',
    vendorName: 'Aman Tour & Travels',
    estimatedCost: 90000,
    actualCost: 95000,
    paidAmount: 30000,
    splitType: 'GUEST_RATIO',
    paidBy: 'GROOM',
    status: 'Partially Paid',
    dueDate: '2026-11-29',
  },

  // 8. Gifts, Shagun & Favors
  {
    id: 'exp-14',
    name: 'Welcome Hampers & Dry Fruit Gift Boxes for Guests',
    category: 'Gifts, Shagun & Favors',
    event: 'All Events',
    vendorName: 'Sweet Treats Artisanal',
    estimatedCost: 110000,
    actualCost: 115000,
    paidAmount: 115000,
    splitType: 'GUEST_RATIO',
    paidBy: 'SHARED',
    status: 'Settled',
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
    paidAmount: 15000,
    splitType: 'EQUAL_50_50',
    paidBy: 'GROOM',
    status: 'Partially Paid',
    dueDate: '2026-11-28',
  }
];

