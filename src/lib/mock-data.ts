import { ExpenseItem, WeddingSettings } from '@/types/wedding';

export const INITIAL_SETTINGS: WeddingSettings = {
  coupleTitle: "Bhuvesh & Harsha's Wedding",
  groomName: "Bhuvesh (Groom)",
  brideName: "Harsha (Bride)",
  weddingDate: "2026-11-28",
  groomGuestCount: 220,
  brideGuestCount: 180,
  totalTargetBudget: 2253600, // Groom working budget: ₹22,53,600 (~22.54 Lakhs)
  currency: "INR",
};

export const INITIAL_EXPENSES: ExpenseItem[] = [
  // ==========================================
  // SECTION 1: GROOM MAIN WEDDING EXPENSES (₹17,40,000)
  // ==========================================
  {
    id: 'groom-exp-1',
    name: 'Gold & Jewelry (Boy to Girl Gifts - Mangalsutra, Bangles, Necklace, Earrings)',
    category: 'Attire, Jewelry & MUA',
    event: 'All Events',
    vendorName: 'Tanishq / Kalyan Jewellers',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 635000,
    actualCost: 635000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: '₹6,35,000 Gold budget gifted to Harsha from Bhuvesh side. Split into individual jewelry subtasks below.',
    subtasks: [
      { id: 'sub-gold-1', name: 'Gold Bridal Mangalsutra', cost: 110000, status: 'Pending', notes: 'Traditional black beads & 22k gold mangalsutra' },
      { id: 'sub-gold-2', name: 'Gold Bangles / Kadas (Pair)', cost: 160000, status: 'Pending', notes: '2 solid gold wedding kadas' },
      { id: 'sub-gold-3', name: 'Gold Bridal Choker & Necklace', cost: 230000, status: 'Pending', notes: 'Necklace set for wedding day' },
      { id: 'sub-gold-4', name: 'Gold Earrings / Jhumkas', cost: 100000, status: 'Pending', notes: 'Heavy gold jhumkis' },
      { id: 'sub-gold-5', name: 'Gold Tops (To confirm inclusion)', cost: 35000, status: 'Pending', notes: 'Clarification item: ₹35,000 tops' },
    ]
  },
  {
    id: 'groom-exp-2',
    name: 'Palace Resort Booking',
    category: 'Venue & Accommodation',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Royal Palace Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 500000,
    actualCost: 500000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Palace venue reservation for main wedding ceremony.',
  },
  {
    id: 'groom-exp-3',
    name: 'Mitha (Sweets & Traditional Mithai)',
    category: 'Catering & Dining',
    event: 'All Events',
    vendorName: 'Haldiram / Bikaner Sweets',
    imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 150000,
    actualCost: 150000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Wedding traditional sweets, shagun bhaji & sweet gift boxes.',
  },
  {
    id: 'groom-exp-4',
    name: 'Wedding Photography & Cinema',
    category: 'Photography & Cinema',
    event: 'All Events',
    vendorName: 'ShutterGlory Studios',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 100000,
    actualCost: 100000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Photography & album documentation for wedding festivities.',
  },
  {
    id: 'groom-exp-5',
    name: "Harsha's Clothes & Suits Pack (7 / 11 / 21 Suits & Bridal Lehenga)",
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Bridal Heritage Couture',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 100000,
    actualCost: 100000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: "Boy to Girl Attire Gifts: Wedding lehenga plus customary 7 / 11 / 21 unstitched & partywear suits given from Bhuvesh side.",
    subtasks: [
      { id: 'sub-suit-1', name: "Harsha's Main Bridal Wedding Lehenga", cost: 50000, status: 'Pending', notes: 'Main bridal lehenga gift' },
      { id: 'sub-suit-2', name: '7 / 11 Shagun Heavy Silk Suits Pack', cost: 30000, status: 'Pending', notes: 'Traditional 7/11 suits gifted to bride' },
      { id: 'sub-suit-3', name: '21 Dailywear & Partywear Suits Pack', cost: 20000, status: 'Pending', notes: 'Complete 21 suits trousseau pack' },
    ]
  },
  {
    id: 'groom-exp-6',
    name: "Our Clothes (Bhuvesh Sherwani & Family Attire)",
    category: 'Attire, Jewelry & MUA',
    event: 'All Events',
    vendorName: 'Regalia / Manyavar',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 60000,
    actualCost: 60000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Groom sherwani, suits and immediate family member attires.',
  },
  {
    id: 'groom-exp-7',
    name: 'Boy to Girl Vanity Gifts: Makeup Kit, Bridal Sandals & Scent Items',
    category: 'Attire, Jewelry & MUA',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Bridal Beauty Emporium / Metro Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 50000,
    actualCost: 50000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: '₹50,000 boy-to-girl vanity trousseau gifted to Harsha from Bhuvesh side. Split into 3 subtasks: Makeup box, Sandals/Slippers, and Bridal vanity perfume accessories.',
    subtasks: [
      { id: 'sub-vanity-1', name: 'Bridal Makeup Vanity Box & Cosmetics', cost: 25000, status: 'Pending', notes: 'Complete luxury bridal makeup kit (foundation, palettes, lipsticks)' },
      { id: 'sub-vanity-2', name: 'Bridal Sandals & Traditional Mojaris / Slippers', cost: 15000, status: 'Pending', notes: '3 pairs bridal heels, wedges and embroidered wedding mojaris' },
      { id: 'sub-vanity-3', name: 'Perfumes, Nightwear & Vanity Accessories', cost: 10000, status: 'Pending', notes: 'Signature wedding fragrance, clutches and grooming items' },
    ]
  },
  {
    id: 'groom-exp-8',
    name: 'Pandit Ji Dakshina & Vedic Havan',
    category: 'Ritual & Puja Items',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Acharya Shastri Ji',
    imageUrl: 'https://images.unsplash.com/photo-1609137144822-42177372d8fc?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 25000,
    actualCost: 25000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Pheras, puja samagri, rituals and pandit honorarium.',
  },
  {
    id: 'groom-exp-9',
    name: 'Rath, Royal Ghodi & Baraat Procession',
    category: 'Logistics & Shuttles',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Shahi Baraat Horse & Chariot Service',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 55000,
    actualCost: 55000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Decorated royal carriage (rath), ghodi, umbrellas and lights.',
  },
  {
    id: 'groom-exp-10',
    name: 'Kambal (Blankets for Family Shagun)',
    category: 'Gifts, Shagun & Favors',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Textile Wholesale Market',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 50000,
    actualCost: 50000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Listed note: ₹50,000. Clarification to check: 30 blankets × ₹500 = ₹15,000 vs ₹50,000.',
  },
  {
    id: 'groom-exp-11',
    name: 'Travel & Local Transportation',
    category: 'Logistics & Shuttles',
    event: 'All Events',
    vendorName: 'City Cabs & Fuel',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 15000,
    actualCost: 15000,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: 'Local travel, coordination vehicles and fuel expenses.',
  },

  // ==========================================
  // SECTION 2: BHUVESH FAMILY RELATIVE GIFTS & WEDDING CEREMONIES (₹5,13,600)
  // Consolidated under Bhuvesh Relatives Gifting Category with detailed subtasks
  // ==========================================
  {
    id: 'groom-exp-relatives-consolidated',
    name: 'Shagun to Bhuvesh Relatives & Ceremonies (Chache, Mamma, Sisters & Rituals)',
    category: 'Gifts, Shagun & Favors',
    event: 'Baraat & Wedding Pheras',
    vendorName: 'Bhuvesh Family Cash Envelopes',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 513600,
    actualCost: 513600,
    paidAmount: 0,
    splitType: 'GROOM_ONLY', // 100% Blue
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: '₹5,13,600 consolidated family shagun to Bhuvesh relatives & ceremonial rituals. Split into subtasks below.',
    subtasks: [
      { id: 'sub-rel-1', name: 'Chache–Bhua (8 × ₹5,100)', cost: 40800, status: 'Pending', notes: '8 family units @ ₹5,100' },
      { id: 'sub-rel-2', name: 'Pawne chache kudian (8 × ₹2,100)', cost: 16800, status: 'Pending', notes: '8 daughters @ ₹2,100' },
      { id: 'sub-rel-3', name: 'Ritu, Neeru, Bunty, Raju (4 × ₹2,100)', cost: 8400, status: 'Pending', notes: '4 first cousins @ ₹2,100' },
      { id: 'sub-rel-4', name: 'Chache, mamma, mamma, massi Jagadhri (5 × ₹5,100 + ₹5,100)', cost: 30600, status: 'Pending', notes: '5 families @ ₹5,100 + ₹5,100 special envelope' },
      { id: 'sub-rel-5', name: 'Isha and Shippu (₹5,100 + 2 × ₹2,100)', cost: 9300, status: 'Pending', notes: 'Base ₹5,100 + 2 × ₹2,100' },
      { id: 'sub-rel-6', name: 'Aditi and Ananya (2 × ₹11,000)', cost: 22000, status: 'Pending', notes: '2 × ₹11,000' },
      { id: 'sub-rel-7', name: 'Bharti and jiju — ring, gold, gifts and shopping', cost: 350300, status: 'Pending', notes: '₹75k Ring + ₹2.5L Gold + 3 × ₹5,100 + ₹10k Shopping' },
      { id: 'sub-rel-8', name: 'Monty and Shanu (2 × ₹2,100)', cost: 4200, status: 'Pending', notes: '2 × ₹2,100' },
      { id: 'sub-rel-9', name: 'Ceremony: Ribbon katai', cost: 21000, status: 'Pending', notes: 'Bridal sisters gate entry shagun' },
      { id: 'sub-rel-10', name: 'Ceremony: Juta lukai (Shoe hiding)', cost: 5100, status: 'Pending', notes: 'Bridal squad shoe negotiation' },
      { id: 'sub-rel-11', name: 'Ceremony: Chand ritual', cost: 5100, status: 'Pending', notes: 'Customary Chand ritual' },
    ]
  },

  // ==========================================
  // SECTION 3: BRIDE SIDE SPECIFIC RASAMS & GIFTS
  // ==========================================
  {
    id: 'bride-exp-vida-1',
    name: "Vida Rasam: Relative Farewell Gifts (Saris & Suit Lengths)",
    category: 'Gifts, Shagun & Favors',
    event: 'Vida (Bidai / Doli)',
    vendorName: 'Textile Silk & Suit Emporium',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
    estimatedCost: 100000,
    actualCost: 100000,
    paidAmount: 0,
    splitType: 'BRIDE_ONLY', // 100% Pink (Harsha Side)
    paidBy: 'UNPAID',
    status: 'Estimated',
    notes: "Girl's side custom: When relatives leave after Vida (Bidai / Doli), they are presented with curated saris and unstitched suit lengths.",
  },
];
