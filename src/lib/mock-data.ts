import { ExpenseItem, WeddingSettings } from "@/types/wedding";

export const INITIAL_SETTINGS: WeddingSettings = {
  "coupleTitle": "Harsha & Bhuvi's Wedding",
  "groomName": "Bhuvesh (Groom)",
  "brideName": "Harsha (Bride)",
  "weddingDate": "2027-02-14",
  "groomGuestCount": 150,
  "brideGuestCount": 400,
  "totalTargetBudget": 5554600,
  "currency": "INR",
  "eventGuestCounts": {
    "Roka / Engagement": {
      "groom": 100,
      "bride": 200,
      "perPlateRate": 1200
    },
    "Mehendi": {
      "groom": 60,
      "bride": 120,
      "perPlateRate": 800
    },
    "Haldi": {
      "groom": 80,
      "bride": 100,
      "perPlateRate": 750
    },
    "Sangeet & Cocktail": {
      "groom": 150,
      "bride": 150,
      "perPlateRate": 1400
    },
    "Baraat & Wedding Pheras": {
      "groom": 250,
      "bride": 250,
      "perPlateRate": 2000
    },
    "Vida (Bidai / Doli)": {
      "groom": 50,
      "bride": 100,
      "perPlateRate": 0
    },
    "Reception": {
      "groom": 220,
      "bride": 180,
      "perPlateRate": 1800
    }
  }
};

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    "id": "groom-exp-1",
    "name": "Bridal Gold & Jewelry (Boy Side)",
    "category": "Gold & Fine Jewelry",
    "event": "All Events",
    "vendorName": "Tanishq / Kalyan Jewellers",
    "imageUrl": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 635000,
    "actualCost": 890000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Mangalsutra, bangles, necklace & earrings • ₹6,35,000 Gold budget gifted to Harsha from Bhuvesh side. Split into individual jewelry subtasks below.",
    "subtasks": [
      {
        "id": "sub-gold-1",
        "name": "Gold Bridal Mangalsutra",
        "cost": 80000,
        "status": "Pending",
        "label": "Gold Mangalsutra",
        "notes": "Traditional black beads & 22k gold mangalsutra"
      },
      {
        "id": "sub-gold-2",
        "name": "Gold Bangles / Kadas (Pair)",
        "cost": 360000,
        "status": "Pending",
        "label": "Gold Bangles",
        "notes": "2 solid gold wedding kadas - 2.5 tola"
      },
      {
        "id": "sub-gold-3",
        "name": "Gold Bridal Choker & Necklace",
        "cost": 350000,
        "status": "Pending",
        "label": "Gold Necklace",
        "notes": "Necklace set for wedding day -"
      },
      {
        "id": "sub-gold-4",
        "name": "Gold Earrings / Jhumkas",
        "cost": 100000,
        "status": "Pending",
        "label": "Gold Earrings",
        "notes": "Heavy gold jhumkis"
      },
      {
        "id": "sub-gold-5",
        "name": "Gold Tops (To confirm inclusion)",
        "cost": 0,
        "status": "Pending",
        "label": "Gold Tops",
        "notes": "Clarification item: ₹35,000 tops"
      }
    ],
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 220,
    "eventBrideGuests": 180,
    "payerCategory": "COUPLE"
  },
  {
    "id": "exp-1793019849199",
    "name": "Gold & Jewelry (Girl Side)",
    "category": "Gold & Fine Jewelry",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "",
    "estimatedCost": 200000,
    "actualCost": 680000,
    "paidAmount": 0,
    "splitType": "BRIDE_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Bridal gold & groom gold gifts (Chain, Watch, Kadaa) • Gifted from girl family to Harsha and Bhuvesh",
    "dueDate": "",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "subtasks": [
      {
        "id": "sub-girl-gold-1",
        "name": "Bridal Gold (Harsha Jewelry Gift)",
        "cost": 200000,
        "status": "Pending",
        "label": "Bridal Gold",
        "notes": "From girl family to Harsha"
      },
      {
        "id": "sub-girl-gold-2",
        "name": "Groom Gold Chain",
        "cost": 300000,
        "status": "Pending",
        "label": "Chain",
        "notes": "Gold chain for Bhuvesh"
      },
      {
        "id": "sub-girl-gold-3",
        "name": "Groom Premium Watch",
        "cost": 30000,
        "status": "Pending",
        "label": "Watch",
        "notes": "Ceremony watch for Bhuvesh"
      },
      {
        "id": "sub-girl-gold-4",
        "name": "Groom Pure Gold Kadaa",
        "cost": 150000,
        "status": "Pending",
        "label": "Kadaa",
        "notes": "Heavy gold kadaa for Bhuvesh"
      }
    ],
    "payerCategory": "COUPLE"
  },
  {
    "id": "groom-exp-ring-boy-to-girl",
    "name": "Engagement Rings",
    "category": "Gold & Fine Jewelry",
    "event": "Roka / Engagement",
    "vendorName": "Tanishq / CaratLane Diamond",
    "imageUrl": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 75000,
    "actualCost": 200000,
    "paidAmount": 0,
    "splitType": "EQUAL_50_50",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Gold & diamond couple rings • Boy to Girl engagement ring: Gold with Diamond ring specified for Harsha.",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE"
  },
  {
    "id": "groom-exp-2",
    "name": "Palace Resort & 2-Day Stay",
    "category": "Venue & Accommodation",
    "event": "All Events",
    "vendorName": "Royal Palace Heritage Stay & Banquet",
    "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 500000,
    "actualCost": 500000,
    "paidAmount": 0,
    "splitType": "EQUAL_50_50",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Deluxe guest rooms & meals for 2 days • Base stay is for 2 days. Extra 13 rooms @ ₹2,700/day and extra food buffer kept as ₹0 placeholder for future adjustment.",
    "subtasks": [
      {
        "id": "sub-stay-1",
        "name": "Deluxe Guest Rooms & Stay (2 Days)",
        "cost": 300000,
        "status": "Pending",
        "label": "Stay/Rooms",
        "notes": "Accommodation for family & guests for 2 days"
      },
      {
        "id": "sub-stay-2",
        "name": "Catering & Food for In-House Guests (2 Days)",
        "cost": 200000,
        "status": "Pending",
        "label": "Food/Meals",
        "notes": "Breakfast, lunches & high tea for 2 days at resort"
      },
      {
        "id": "sub-stay-extra",
        "name": "Extra Rooms (13 Rooms @ ₹2,700/day) & Extra Food Buffer",
        "cost": 0,
        "status": "Pending",
        "label": "Extra Rooms",
        "notes": "13 extra rooms @ ₹2,700/day + additional food buffer (currently ₹0 placeholder, to be updated later)"
      }
    ],
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 220,
    "eventBrideGuests": 180,
    "payerCategory": "COUPLE"
  },
  {
    "id": "bride-exp-palace-1",
    "name": "Wedding Hall & Dinner Banquet",
    "category": "Venue & Accommodation",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "Main Wedding Palace & Hall",
    "imageUrl": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80",
    "isPerPlateCalculation": true,
    "ratePerGuestOrPlate": 2000,
    "overrideGuestCount": true,
    "eventBrideGuests": 400,
    "estimatedCost": 1000000,
    "actualCost": 1100000,
    "paidAmount": 0,
    "splitType": "GUEST_RATIO",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Wedding buffet catering @ ₹2,000/plate • Main Wedding Hall separate from stay; catering calculated dynamically by guest count (150 Bhuvi + 400 Harsha = 550 guests).",
    "subtasks": [
      {
        "id": "sub-whall-1",
        "name": "Main Wedding Hall & Lawn Space",
        "cost": 0,
        "status": "Pending",
        "label": "Hall Rental",
        "notes": "Main grand wedding lawn & banquet space (covered with wedding arrangement)"
      },
      {
        "id": "sub-whall-2",
        "name": "Wedding Dinner Catering (@ ₹2,000/plate)",
        "cost": 1100000,
        "status": "Pending",
        "label": "Per-Plate Food",
        "notes": "Grand wedding dinner buffet (550 guests: 150 Bhuvi + 400 Harsha @ ₹2,000)"
      }
    ],
    "eventGroomGuests": 150,
    "payerCategory": "COUPLE"
  },
  {
    "id": "exp-ring-extra-hightea",
    "name": "Engagement Venue & Lunch",
    "category": "Catering, Food & Sweets",
    "event": "Roka / Engagement",
    "vendorName": "Resort In-House Caterer",
    "imageUrl": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 75000,
    "actualCost": 250000,
    "paidAmount": 0,
    "splitType": "EQUAL_50_50",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Roka day event catering & setup • Resort includes 13 rooms & 100 people food. For accommodating Harsha 200 guests (100 extra people), working buffer of ₹75,000 (₹50k-₹1L) added for extra high-tea & snacks.",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 1200,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE"
  },
  {
    "id": "exp-unified-mithai-boxes",
    "name": "Wedding Mithai & Sweets Distribution",
    "category": "Catering, Food & Sweets",
    "event": "All Events",
    "vendorName": "Haldiram / Bikaner Sweets & Local Halwai",
    "imageUrl": "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 650000,
    "actualCost": 470000,
    "paidAmount": 0,
    "splitType": "GUEST_RATIO",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Wedding sweets distribution & ring ceremony mithai • Split by Guest Ratio (400 Harsha : 150 Bhuvi)",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 800,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "overrideGuestCount": false,
    "payerCategory": "COUPLE",
    "subtasks": [
      {
        "id": "sub-mit-1",
        "name": "Harsha Family Shadi Mithai Boxes",
        "cost": 200000,
        "status": "Pending",
        "label": "Wedding Mithai",
        "notes": "Traditional wedding distribution boxes (Girl Side)"
      },
      {
        "id": "sub-mit-2",
        "name": "Ring Ceremony Mithai & Sweets",
        "cost": 150000,
        "status": "Pending",
        "label": "Roka Mithai",
        "notes": "Engagement day sweet platters & boxes"
      },
      {
        "id": "sub-mit-3",
        "name": "Bhuvesh Family Mithai Boxes (150 Boxes @ ₹800)",
        "cost": 120000,
        "status": "Pending",
        "label": "Groom Mithai",
        "notes": "150 traditional sweets & shagun bhaji boxes (Boy Side)"
      }
    ]
  },
  {
    "id": "groom-exp-5",
    "name": "Bridal Trousseau & Suits",
    "category": "Attire & Wardrobe",
    "event": "All Events",
    "vendorName": "Bridal Heritage Couture",
    "imageUrl": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 200000,
    "actualCost": 230000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Wedding lehenga, ring gown & 7/11/21 suits • Boy to Girl Attire Gifts: ₹2,00,000 budget covering main wedding lehenga, Ring Ceremony gown/dress, plus 7 / 11 / 21 unstitched suits.",
    "subtasks": [
      {
        "id": "sub-suit-1",
        "name": "Harsha's Main Bridal Wedding Lehenga",
        "cost": 90000,
        "status": "Pending",
        "label": "Bridal Lehenga",
        "notes": "Main heavy bridal wedding lehenga  - including haldi mehndi outfits "
      },
      {
        "id": "sub-suit-ring",
        "name": "Harsha's Ring Ceremony Gown / Designer Dress",
        "cost": 30000,
        "status": "Pending",
        "label": "Ring Dress",
        "notes": "Ring Ceremony evening gown / outfit gifted to bride"
      },
      {
        "id": "sub-suit-2",
        "name": "7 / 11 Shagun Heavy Silk Suits Pack",
        "cost": 80000,
        "status": "Pending",
        "label": "7/11/21 Suits",
        "notes": "Traditional 7/11 heavy suits gifted to bride"
      },
      {
        "id": "sub-suit-3",
        "name": "21 Dailywear & Partywear Suits Pack",
        "cost": 30000,
        "status": "Pending",
        "label": "Makeup and Others",
        "notes": "21 suits trousseau collection p including makeup and sandals this last one"
      },
      {
        "id": "sub-1793019606134",
        "name": "bridal makeup and all other makeups",
        "cost": 30000,
        "status": "Pending",
        "notes": "",
        "label": "makeup"
      }
    ],
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 0,
    "eventBrideGuests": 0,
    "payerCategory": "COUPLE"
  },
  {
    "id": "exp-1793020098639",
    "name": "Groom Family Wardrobe",
    "category": "Attire & Wardrobe",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "",
    "estimatedCost": 100000,
    "actualCost": 60000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Boy family outfits & shoes",
    "dueDate": "",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE"
  },
  {
    "id": "exp-unified-bride-wardrobe",
    "name": "Bride Family Wardrobe & Groom Attire",
    "category": "Attire & Wardrobe",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "",
    "estimatedCost": 200000,
    "actualCost": 200000,
    "paidAmount": 0,
    "splitType": "BRIDE_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Bride family outfits, groom wedding sherwani & reception apparel gifted by girl side",
    "dueDate": "",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE",
    "subtasks": [
      {
        "id": "sub-g-wardrobe-1",
        "name": "Bride Family Outfits & Sarees",
        "cost": 100000,
        "status": "Pending",
        "label": "Family Outfits",
        "notes": "Girl family ceremony outfits"
      },
      {
        "id": "sub-g-wardrobe-2",
        "name": "Bhuvesh Wedding Sherwani & Safa",
        "cost": 60000,
        "status": "Pending",
        "label": "Groom Sherwani",
        "notes": "Groom sherwani & safa gift"
      },
      {
        "id": "sub-g-wardrobe-3",
        "name": "Groom Reception Attire & Clothes",
        "cost": 40000,
        "status": "Pending",
        "label": "Groom Clothes",
        "notes": "Western & ethnic clothing gifted to groom"
      }
    ]
  },
  {
    "id": "exp-1793019704914",
    "name": "Ceremony Makeup & Styling",
    "category": "Makeup & Bridal Care",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "",
    "estimatedCost": 100000,
    "actualCost": 30000,
    "paidAmount": 0,
    "splitType": "EQUAL_50_50",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Bridal makeup & family styling across Haldi, Mehndi & Wedding",
    "dueDate": "",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE",
    "subtasks": [
      {
        "id": "sub-mu-bridal",
        "name": "Bridal Makeup (Main Wedding)",
        "cost": 0,
        "status": "Pending",
        "label": "Bridal Makeup",
        "notes": "Main bridal transformation & hair styling"
      },
      {
        "id": "sub-mu-haldi",
        "name": "Groom & Bride Family Makeup (Haldi)",
        "cost": 5000,
        "status": "Pending",
        "label": "Haldi Makeup",
        "notes": "Haldi function styling for family"
      },
      {
        "id": "sub-mu-mehndi",
        "name": "Groom & Bride Family Makeup (Mehndi)",
        "cost": 5000,
        "status": "Pending",
        "label": "Mehndi Makeup",
        "notes": "Mehndi function styling for family"
      },
      {
        "id": "sub-mu-wedding",
        "name": "Groom & Bride Family Makeup (Wedding)",
        "cost": 20000,
        "status": "Pending",
        "label": "Wedding Makeup",
        "notes": "Wedding day family makeup packages"
      }
    ]
  },
  {
    "id": "exp-mehendi-artist",
    "name": "Mehendi Artist & Henna Setup",
    "category": "Makeup & Bridal Care",
    "event": "Mehendi",
    "vendorName": "Mehendi Artist Collective",
    "imageUrl": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 20000,
    "actualCost": 20000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Professional henna artist & ceremonial mehendi cones",
    "payerCategory": "COUPLE",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "subtasks": [
      {
        "id": "sub-meh-1",
        "name": "Mehendi Artist (Bridal & Family)",
        "cost": 20000,
        "status": "Pending",
        "label": "Henna Artist",
        "notes": "Bridal hands/feet + close family members"
      },
      {
        "id": "sub-meh-2",
        "name": "Mehndi Saman & Cones",
        "cost": 0,
        "status": "Pending",
        "label": "Mehndi Saman",
        "notes": "Organic henna cones & glitter"
      }
    ]
  },
  {
    "id": "groom-exp-8",
    "name": "Pandit Ji, Vedic Havan & Puja Saman",
    "category": "Ritual & Puja Items",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "Acharya Shastri Ji",
    "imageUrl": "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 25000,
    "actualCost": 42000,
    "paidAmount": 0,
    "splitType": "EQUAL_50_50",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Pandit ji dakshina, havan samagri, haldi & ritual items",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE",
    "subtasks": [
      {
        "id": "sub-puj-1",
        "name": "Pandit Ji Dakshina & Vedic Rituals",
        "cost": 32000,
        "status": "Pending",
        "label": "Pandit Ji",
        "notes": "Vedic ceremony officiant dakshina"
      },
      {
        "id": "sub-puj-2",
        "name": "Havan & Puja Samagri",
        "cost": 10000,
        "status": "Pending",
        "label": "Puja Saman",
        "notes": "Samagri, ghee, coconuts, flowers"
      },
      {
        "id": "sub-puj-3",
        "name": "Haldi Saman & Organic Turmeric",
        "cost": 0,
        "status": "Pending",
        "label": "Haldi Saman",
        "notes": "Organic haldi paste & ceremony essentials"
      }
    ]
  },
  {
    "id": "groom-exp-4",
    "name": "Wedding Photography & Cinema",
    "category": "Photography & Cinema",
    "event": "All Events",
    "vendorName": "ShutterGlory Studios",
    "imageUrl": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 100000,
    "actualCost": 100000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Lead team photo/video & secondary cinema buffer",
    "payerCategory": "COUPLE",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "subtasks": [
      {
        "id": "sub-photo-1",
        "name": "Lead Wedding Photo & Cinematic Video",
        "cost": 100000,
        "status": "Pending",
        "label": "Lead Cinema",
        "notes": "Photography & album documentation"
      },
      {
        "id": "sub-photo-2",
        "name": "Secondary Cinema Buffer / Pre-wedding",
        "cost": 0,
        "status": "Pending",
        "label": "Cinema Buffer",
        "notes": "Buffer for extra team / pre-wedding"
      }
    ]
  },
  {
    "id": "exp-inhouse-dj-sound",
    "name": "Banquet Sound, DJ & Entertainment",
    "category": "Music & Entertainment",
    "event": "All Events",
    "vendorName": "Resort In-House Sound Operator",
    "imageUrl": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 20000,
    "actualCost": 20000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Banquet sound & DJ (₹5,000/night × 3) + Sangeet choreography",
    "payerCategory": "COUPLE",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "subtasks": [
      {
        "id": "sub-dj-1",
        "name": "In-house DJ & Sound (₹5,000 per night × 3)",
        "cost": 15000,
        "status": "Pending",
        "label": "DJ 3 Nights",
        "notes": "In-house hall sound operator for 3 nights"
      },
      {
        "id": "sub-dj-2",
        "name": "Sangeet Family Choreography",
        "cost": 5000,
        "status": "Pending",
        "label": "Choreography",
        "notes": "Sangeet dance rehearsals & choreography"
      }
    ]
  },
  {
    "id": "groom-exp-11",
    "name": "Wedding Logistics, Travel & Water Buffer",
    "category": "Logistics & Shuttles",
    "event": "All Events",
    "vendorName": "",
    "imageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 25000,
    "actualCost": 25000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Guest shuttles, local coordination cabs, fuel & packaged water buffer",
    "payerCategory": "COUPLE",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "subtasks": [
      {
        "id": "sub-log-1",
        "name": "Local Travel, Shuttles & Fuel",
        "cost": 15000,
        "status": "Pending",
        "label": "Travel & Fuel",
        "notes": "Coordination cabs & fuel"
      },
      {
        "id": "sub-log-2",
        "name": "Packaged Mineral Water Crates Buffer",
        "cost": 10000,
        "status": "Pending",
        "label": "Water Buffer",
        "notes": "Packaged water crates for 3 days"
      }
    ]
  },
  {
    "id": "exp-unified-baraat-band-milni",
    "name": "Baraat Procession, Band & Milni Kambal",
    "category": "Logistics & Shuttles",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "Shahi Baraat Horse, Chariot & King Dholis",
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 105000,
    "actualCost": 100000,
    "paidAmount": 0,
    "splitType": "GROOM_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Royal rath, Punjabi dhol troupe, ghodi chadhai & traditional milni kambal shagun",
    "subtasks": [
      {
        "id": "sub-ghodi-1",
        "name": "Baraat Ghodi (White Mare) & Chadhai Custom",
        "cost": 15000,
        "status": "Pending",
        "label": "Ghodi",
        "notes": "Decorated mare with traditional ghughrus & saafas"
      },
      {
        "id": "sub-ghodi-2",
        "name": "Royal Rath (Vintage Carriage) & Lights/Chattar",
        "cost": 15000,
        "status": "Pending",
        "label": "Royal Rath",
        "notes": "Illuminated carriage with royal umbrellas and lighting"
      },
      {
        "id": "sub-ghodi-3",
        "name": "Punjabi Dhol Wala Master Troupe (5 Dholis)",
        "cost": 5000,
        "status": "Pending",
        "label": "Dholis",
        "notes": "5 Punjabi Dhol players for high-energy Baraat beats"
      },
      {
        "id": "sub-ghodi-4",
        "name": "Fireworks & Procession Crackers",
        "cost": 15000,
        "status": "Pending",
        "label": "Fireworks",
        "notes": "Auspicious wedding fireworks"
      },
      {
        "id": "sub-kambal-1",
        "name": "Milni Kambal Shagun (30 Blankets)",
        "cost": 15000,
        "status": "Pending",
        "label": "Milni Blankets",
        "notes": "30 blankets × ₹500"
      },
      {
        "id": "sub-kambal-2",
        "name": "Additional Blanket & Shawl Buffer",
        "cost": 35000,
        "status": "Pending",
        "label": "Shagun Buffer",
        "notes": "Extended family milni envelopes & buffer"
      }
    ],
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE"
  },
  {
    "id": "groom-exp-relatives-consolidated",
    "name": "Family Shagun Envelopes",
    "category": "Gifts, Shagun & Favors",
    "event": "Baraat & Wedding Pheras",
    "vendorName": "Bhuvesh Family Cash Envelopes",
    "imageUrl": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 513600,
    "actualCost": 513600,
    "paidAmount": 0,
    "splitType": "EQUAL_50_50",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Chache, Mamma, sisters & rituals • ₹5,13,600 consolidated family shagun to Bhuvesh relatives & ceremonial rituals. Split into subtasks below.",
    "subtasks": [
      {
        "id": "sub-rel-1",
        "name": "Chache–Bhua (8 Families Shagun)",
        "cost": 40800,
        "status": "Pending",
        "label": "Shagun",
        "notes": "8 family units @ ₹5,100 cash envelopes"
      },
      {
        "id": "sub-rel-2",
        "name": "Pawne chache kudian (8 Nieces)",
        "cost": 16800,
        "status": "Pending",
        "label": "Shagun",
        "notes": "8 extended chache daughters @ ₹2,100 each"
      },
      {
        "id": "sub-rel-3",
        "name": "Ritu, Neeru, Bunty, Raju (4 Cousins)",
        "cost": 8400,
        "status": "Pending",
        "label": "Shagun",
        "notes": "4 first cousins @ ₹2,100 each"
      },
      {
        "id": "sub-rel-4",
        "name": "Chache, Mamma & Massi Jagadhri Relatives",
        "cost": 30600,
        "status": "Pending",
        "label": "Shagun",
        "notes": "5 family envelopes @ ₹5,100 + ₹5,100 special envelope"
      },
      {
        "id": "sub-rel-5",
        "name": "Isha and Shippu",
        "cost": 9300,
        "status": "Pending",
        "label": "Shagun",
        "notes": "Base ₹5,100 + 2 × ₹2,100 special gifts"
      },
      {
        "id": "sub-rel-6",
        "name": "Aditi and Ananya",
        "cost": 22000,
        "status": "Pending",
        "label": "Shagun",
        "notes": "2 nieces @ ₹11,000 each"
      },
      {
        "id": "sub-rel-bharti-gold",
        "name": "Sister Bharti: Pure Gold Jewelry Set",
        "cost": 250000,
        "status": "Pending",
        "label": "Sister Gold",
        "notes": "Gold necklace/bangles wedding set gifted to sister Bharti"
      },
      {
        "id": "sub-rel-jiju-ring",
        "name": "Jiju: Gold Ring with Diamond Accent",
        "cost": 75000,
        "status": "Pending",
        "label": "Jiju Ring",
        "notes": "Gold & Diamond ring ceremony gift for Brother-in-law (Jiju)"
      },
      {
        "id": "sub-rel-sister-shagun",
        "name": "Sister Bharti & Jiju Shagun Envelopes (3 × ₹5,100)",
        "cost": 15300,
        "status": "Pending",
        "label": "Shagun",
        "notes": "3 auspicious cash envelopes @ ₹5,100"
      },
      {
        "id": "sub-rel-sister-shopping",
        "name": "Sister Bharti & Jiju Wedding Shopping Allowance",
        "cost": 10000,
        "status": "Pending",
        "label": "Shopping",
        "notes": "Wedding apparel and shopping contribution"
      },
      {
        "id": "sub-rel-8",
        "name": "Monty and Shanu (2 Cousins)",
        "cost": 4200,
        "status": "Pending",
        "label": "Shagun",
        "notes": "2 × ₹2,100 envelopes"
      },
      {
        "id": "sub-rel-9",
        "name": "Ceremony: Ribbon katai",
        "cost": 21000,
        "status": "Pending",
        "label": "Ritual",
        "notes": "Bridal sisters gate entry shagun"
      },
      {
        "id": "sub-rel-10",
        "name": "Ceremony: Juta lukai (Shoe hiding)",
        "cost": 5100,
        "status": "Pending",
        "label": "Ritual",
        "notes": "Bridal squad shoe negotiation"
      },
      {
        "id": "sub-rel-11",
        "name": "Ceremony: Chand ritual",
        "cost": 5100,
        "status": "Pending",
        "label": "Ritual",
        "notes": "Customary Chand ritual"
      }
    ],
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 0,
    "eventBrideGuests": 0,
    "overrideGuestCount": true,
    "payerCategory": "COUPLE"
  },
  {
    "id": "bride-exp-vida-1",
    "name": "Vida Farewell Gifts",
    "category": "Gifts, Shagun & Favors",
    "event": "Vida (Bidai / Doli)",
    "vendorName": "Textile Silk & Suit Emporium",
    "imageUrl": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 100000,
    "actualCost": 100000,
    "paidAmount": 0,
    "splitType": "BRIDE_ONLY",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Relative saris & suit lengths • Girl's side custom: When relatives leave after Vida (Bidai / Doli), they are presented with curated saris and unstitched suit lengths: ₹1,00,000.",
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE"
  },
  {
    "id": "exp-wedding-cards-envelopes",
    "name": "Wedding Invitation Cards & Envelopes",
    "category": "Invitations & Miscellaneous",
    "event": "All Events",
    "vendorName": "Shree Ganesh Wedding Cards & Laser Crafts",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80",
    "estimatedCost": 24000,
    "actualCost": 24000,
    "paidAmount": 0,
    "splitType": "EQUAL_50_50",
    "paidBy": "UNPAID",
    "status": "Estimated",
    "notes": "Wedding cards & shagun envelopes print • ₹12,000 Harsha side + ₹12,000 Bhuvesh side (Equal 50:50 split)",
    "subtasks": [
      {
        "id": "sub-card-harsha",
        "name": "Harsha Family Cards & Custom Envelopes",
        "cost": 12000,
        "status": "Pending",
        "label": "Girl Side Cards",
        "notes": "Wedding invitation cards, inserts & envelopes for Harsha side"
      },
      {
        "id": "sub-card-bhuvi",
        "name": "Bhuvesh Family Cards & Custom Envelopes",
        "cost": 12000,
        "status": "Pending",
        "label": "Boy Side Cards",
        "notes": "Wedding invitation cards, inserts & envelopes for Bhuvi side"
      }
    ],
    "isPerPlateCalculation": false,
    "ratePerGuestOrPlate": 0,
    "eventGroomGuests": 150,
    "eventBrideGuests": 400,
    "payerCategory": "COUPLE"
  }
];
