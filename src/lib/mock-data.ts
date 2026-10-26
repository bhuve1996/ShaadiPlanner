import { ExpenseItem, WeddingSettings } from '@/types/wedding';

export const INITIAL_SETTINGS: WeddingSettings = {
  coupleTitle: "Bhuvesh & Harsha's Wedding",
  groomName: "Bhuvesh (Groom)",
  brideName: "Harsha (Bride)",
  weddingDate: "2026-11-28",
  groomGuestCount: 220,
  brideGuestCount: 180,
  totalTargetBudget: 3500000,
  currency: "INR",
};

// Initial state: Curated with high-res relevant photographic thumbnails matching Indian wedding items
export const INITIAL_EXPENSES: ExpenseItem[] = [
  // 1. Venue & Stay (Mutual / Green)
  {
    id: 'exp-1',
    name: 'Palace Resort Main Lawn & Banquet Booking',
    category: 'Venue & Accommodation',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Heritage Palace Resort',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 600000,
    actualCost: 600000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO', // Split by guest count ratio (Mutual Green)
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-20',
    notes: 'Rooms to be split based on 220 Bhuvesh guests vs 180 Harsha guests.'
  },

  // 2. Catering & Dining (Mutual / Green with per-plate)
  {
    id: 'exp-3',
    name: 'Wedding Grand Dinner Buffet (Live Stalls & Rajasthani Counter)',
    category: 'Catering & Dining',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Royal Flavours Caterers',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80',
    isPerPlateCalculation: true,
    ratePerGuestOrPlate: 1550,
    eventGroomGuests: 220,
    eventBrideGuests: 180,
    estimatedCost: 620000,
    actualCost: 620000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-28',
    notes: '400 guest plates @ ₹1,550/plate. Per-guest ratio split.'
  },
  {
    id: 'exp-4',
    name: 'Sangeet Cocktails & High-Tea Chaat Counters',
    category: 'Catering & Dining',
    event: 'Sangeet & Cocktail',
    vendorName: 'Royal Flavours Caterers',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=300&q=80',
    isPerPlateCalculation: true,
    ratePerGuestOrPlate: 800,
    eventGroomGuests: 150,
    eventBrideGuests: 150,
    estimatedCost: 240000,
    actualCost: 240000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'High-tea chaat counters and mocktail/cocktail bar.'
  },

  // 3. Decor & Production (Mutual / Green)
  {
    id: 'exp-5',
    name: 'Mandap, Floral Decor & Grand Varmala Stage',
    category: 'Decor & Production',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Blooms & Vows Designers',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 70000,
    actualCost: 70000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
  },

  // 4. Photography & Cinema (Mutual / Green)
  {
    id: 'exp-7',
    name: 'Candid Photography, Drone & Cinematic Wedding Film',
    category: 'Photography & Cinema',
    event: 'All Events',
    vendorName: 'ShutterGlory Wedding Studios',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 350000,
    actualCost: 350000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50',
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-12-05',
    notes: 'Coverage across all events for Bhuvesh & Harsha + teaser film + traditional album.'
  },

  // 5. Attire, Jewelry & MUA (Bride / Pink & Groom / Blue)
  {
    id: 'exp-8',
    name: "Harsha's Bridal Luxury Lehenga & Reception Gown",
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Heritage Bridal Couture',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 300000,
    actualCost: 300000,
    paidAmount: 0,
    splitType: 'BRIDE_ONLY', // 100% Pink
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: "100% Harsha's side attire budget."
  },
  {
    id: 'exp-9',
    name: "Bhuvesh's Silk Sherwani, Safa & Stole",
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Manyavar / Regalia',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 90000,
    actualCost: 90000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: "100% Bhuvesh's side sherwani & accessories."
  },
  {
    id: 'exp-10',
    name: "Harsha's Bridal Makeup (Sangeet + Wedding HD Makeup)",
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Glamour Studio',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 85000,
    actualCost: 85000,
    paidAmount: 0,
    splitType: 'BRIDE_ONLY', // 100% Pink
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
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 120000,
    actualCost: 120000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50', // Mutual Green
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
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 35000,
    actualCost: 35000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: '5 Dholis for Bhuvesh Baraat procession.'
  },

  // 7. Logistics & Shuttles (Mutual / Green)
  {
    id: 'exp-13',
    name: 'Airport / Railway Guest Pickups & 2 Tempo Travellers',
    category: 'Logistics & Shuttles',
    event: 'All Events',
    vendorName: 'Aman Tour & Travels',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 95000,
    actualCost: 95000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO', // Mutual Green
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-29',
  },

  // 8. Gifts, Shagun & Favors (Mutual / Green)
  {
    id: 'exp-14',
    name: 'Welcome Hampers & Dry Fruit Gift Boxes for Guests',
    category: 'Gifts, Shagun & Favors',
    event: 'All Events',
    vendorName: 'Sweet Treats Artisanal',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 115000,
    actualCost: 115000,
    paidAmount: 0,
    splitType: 'GUEST_RATIO', // Mutual Green
    paidBy: 'UNPAID',
    status: 'Estimated',
  },

  // 9. Ritual & Puja Items (Mutual / Green)
  {
    id: 'exp-15',
    name: 'Pandit Ji Dakshina & Havan Samagri',
    category: 'Ritual & Puja Items',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Acharya Shastri',
    imageUrl: 'https://images.unsplash.com/photo-1609137144822-42177372d8fc?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 31000,
    actualCost: 31000,
    paidAmount: 0,
    splitType: 'EQUAL_50_50', // Mutual Green
    paidBy: 'UNPAID',
    status: 'Estimated',
    dueDate: '2026-11-28',
  }
];
