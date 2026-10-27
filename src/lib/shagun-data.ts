import { FamilyShagunItem, GuestGroupItem } from '@/types/wedding';

export const INITIAL_SHAGUN_LIST: FamilyShagunItem[] = [
  {
    "id": "shagun-1",
    "recipientName": "Chache\u2013Bhua",
    "relation": "Paternal Uncles & Aunts (Chache & Bhua)",
    "group": "Chache-Bhua",
    "calculationFormula": "8 \u00d7 \u20b95,100",
    "amount": 40800,
    "status": "Planned",
    "notes": "8 family units @ \u20b95,100 each envelope shagun.",
    "side": "GROOM"
  },
  {
    "id": "shagun-2",
    "recipientName": "Pawne chache kudian",
    "relation": "Extended Chache Daughters / Nieces",
    "group": "Chache-Bhua",
    "calculationFormula": "8 \u00d7 \u20b92,100",
    "amount": 16800,
    "status": "Planned",
    "notes": "8 daughters @ \u20b92,100 each.",
    "side": "GROOM"
  },
  {
    "id": "shagun-3",
    "recipientName": "Ritu, Neeru, Bunty, Raju",
    "relation": "First Cousins",
    "group": "Cousins & Youth",
    "calculationFormula": "4 \u00d7 \u20b92,100",
    "amount": 8400,
    "status": "Planned",
    "notes": "4 cousins @ \u20b92,100 each.",
    "side": "GROOM"
  },
  {
    "id": "shagun-4",
    "recipientName": "Chache, mamma, mamma, massi Jagadhri",
    "relation": "Maternal & Paternal Jagadhri Relatives",
    "group": "Mamma-Massi",
    "calculationFormula": "5 \u00d7 \u20b95,100 + \u20b95,100",
    "amount": 30600,
    "status": "Planned",
    "notes": "5 families @ \u20b95,100 + additional \u20b95,100 special envelope.",
    "side": "GROOM"
  },
  {
    "id": "shagun-5",
    "recipientName": "Isha and Shippu",
    "relation": "Cousin Sisters / Family",
    "group": "Cousins & Youth",
    "calculationFormula": "\u20b95,100 + 2 \u00d7 \u20b92,100",
    "amount": 9300,
    "status": "Planned",
    "notes": "Base shagun \u20b95,100 plus 2 \u00d7 \u20b92,100 special gifts.",
    "side": "GROOM"
  },
  {
    "id": "shagun-6",
    "recipientName": "Aditi and Ananya",
    "relation": "Young Nieces / Daughters",
    "group": "Cousins & Youth",
    "calculationFormula": "2 \u00d7 \u20b911,000",
    "amount": 22000,
    "status": "Planned",
    "notes": "2 \u00d7 \u20b911,000 special shagun gifts.",
    "side": "GROOM"
  },
  {
    "id": "shagun-7",
    "recipientName": "Bharti and jiju \u2014 ring, gold, gifts and shopping",
    "relation": "Sister & Brother-in-law (Jiju)",
    "group": "Sisters & In-laws",
    "calculationFormula": "\u20b975,000 + \u20b92,50,000 + 3 \u00d7 \u20b95,100 + \u20b910,000",
    "amount": 350300,
    "status": "Planned",
    "notes": "Ring (\u20b975k) + Gold (\u20b92.5L) + 3 envelopes @ \u20b95,100 + Shopping (\u20b910k). Total \u20b93,50,300.",
    "side": "GROOM"
  },
  {
    "id": "shagun-8",
    "recipientName": "Monty and Shanu",
    "relation": "Cousins / Family",
    "group": "Cousins & Youth",
    "calculationFormula": "2 \u00d7 \u20b92,100",
    "amount": 4200,
    "status": "Planned",
    "notes": "2 \u00d7 \u20b92,100 envelopes.",
    "side": "GROOM"
  },
  {
    "id": "shagun-9",
    "recipientName": "Ribbon katai",
    "relation": "Bridal Sisters & Friends Ceremony",
    "group": "Custom Rituals / Shagun",
    "calculationFormula": "Lump-sum ceremonial shagun",
    "amount": 21000,
    "status": "Planned",
    "notes": "Ceremonial door ribbon cutting shagun for bridal sisters.",
    "side": "GROOM"
  },
  {
    "id": "shagun-10",
    "recipientName": "Juta lukai (chupai)",
    "relation": "Bridal Squad Shoe Stealing Ritual",
    "group": "Custom Rituals / Shagun",
    "calculationFormula": "Negotiated ceremonial shagun",
    "amount": 5100,
    "status": "Planned",
    "notes": "Joota Chupai shagun to retrieve Groom shoes.",
    "side": "GROOM"
  },
  {
    "id": "shagun-11",
    "recipientName": "Chand ritual",
    "relation": "Family Wedding Shagun Custom",
    "group": "Custom Rituals / Shagun",
    "calculationFormula": "Tradition envelope",
    "amount": 5100,
    "status": "Planned",
    "notes": "Chand tradition shagun ceremony.",
    "side": "GROOM"
  },
  {
    "id": "shagun-12",
    "recipientName": "Vida Rasam: Relative Farewell Gifts (Saris & Suits)",
    "relation": "Departing Relatives from Bride Side",
    "group": "Custom Rituals / Shagun",
    "calculationFormula": "Budget for Girl's side farewell gifts",
    "amount": 100000,
    "status": "Planned",
    "notes": "Girl's side Vida custom: When relatives depart, they are gifted curated saris and suits as blessing/farewell token.",
    "side": "BRIDE"
  }
];

export const INITIAL_GUEST_GROUPS: GuestGroupItem[] = [
  {
    "id": "grp-7",
    "name": "Harsha's Extended Family & Relatives",
    "side": "BRIDE",
    "count": 120,
    "contactPerson": "Harsha's Father",
    "isAnonymousNumbers": false,
    "notes": "Main bridal party guests"
  },
  {
    "id": "grp-8",
    "name": "Harsha's School & University Friends",
    "side": "BRIDE",
    "count": 60,
    "contactPerson": "Sneha (Bridesmaid)",
    "isAnonymousNumbers": false,
    "notes": "Sangeet performances & Ribbon katai squad"
  },
  {
    "id": "grp-g01-akqa",
    "name": "AKQA Office Colleagues",
    "side": "GROOM",
    "count": 10,
    "contactPerson": "Office Lead / Self",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: No (commute from Delhi NCR)"
  },
  {
    "id": "grp-g02-badminton",
    "name": "Badminton Club Members",
    "side": "GROOM",
    "count": 10,
    "contactPerson": "Badminton Captain",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: No (local evening reception)"
  },
  {
    "id": "grp-g03-dabwali",
    "name": "Dabwali Family Branch",
    "side": "GROOM",
    "count": 20,
    "contactPerson": "Pawan Chacha Ji",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (4 rooms or hall stay with mattresses)"
  },
  {
    "id": "grp-g04-sirsa",
    "name": "Sirsa Family Branch",
    "side": "GROOM",
    "count": 18,
    "contactPerson": "Vicky Chacha Ji",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (3 rooms)"
  },
  {
    "id": "grp-g05-hanumangarh",
    "name": "Hanumangarh Family Branch",
    "side": "GROOM",
    "count": 16,
    "contactPerson": "Billu Chacha Ji",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (3 rooms)"
  },
  {
    "id": "grp-g06-raman",
    "name": "Raman Mandi Relatives",
    "side": "GROOM",
    "count": 14,
    "contactPerson": "Elder Fuffa Ji",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (2 rooms, ground floor preferred)"
  },
  {
    "id": "grp-g07-samana",
    "name": "Samana Family Relatives",
    "side": "GROOM",
    "count": 15,
    "contactPerson": "Ludhiana Tata Ji",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (3 rooms)"
  },
  {
    "id": "grp-g08-budhlada",
    "name": "Budhlada Family Branch",
    "side": "GROOM",
    "count": 12,
    "contactPerson": "Maasi Ji & Parivar",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (2 rooms or hall with mattresses)"
  },
  {
    "id": "grp-g09-sunam",
    "name": "Sunam Family Relatives",
    "side": "GROOM",
    "count": 12,
    "contactPerson": "Bhua Ji & Family",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (2 rooms)"
  },
  {
    "id": "grp-g10-zirakpur",
    "name": "Zirakpur Relatives & Friends",
    "side": "GROOM",
    "count": 15,
    "contactPerson": "Cousin Brother",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: Yes (3 rooms)"
  },
  {
    "id": "grp-g11-delhi",
    "name": "Delhi NCR Local Relatives & Friends",
    "side": "GROOM",
    "count": 18,
    "contactPerson": "Self / Best Man",
    "contactPhone": "",
    "isAnonymousNumbers": false,
    "notes": "Room required: No (local residents; self-commute)"
  }
];
