'use client';

import React, { useState, useMemo } from 'react';
import { 
  Gift, 
  Users, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileSpreadsheet, 
  Info, 
  Phone, 
  Search,
  CheckCircle2,
  AlertCircle,
  User,
  UserCheck,
  Building,
  MapPin,
  MessageCircle,
  ChevronDown,
  Filter
} from 'lucide-react';
import { FamilyShagunItem, GuestGroupItem } from '@/types/wedding';
import { formatINR } from '@/lib/constants';

interface ShagunAndGuestManagerProps {
  shagunList: FamilyShagunItem[];
  guestGroups: GuestGroupItem[];
  onUpdateShagun: (item: FamilyShagunItem) => void;
  onAddShagun: (item: FamilyShagunItem) => void;
  onDeleteShagun: (id: string) => void;
  onUpdateGuestGroup: (group: GuestGroupItem) => void;
  onAddGuestGroup: (group: GuestGroupItem) => void;
  onDeleteGuestGroup: (id: string) => void;
}

export const ShagunAndGuestManager: React.FC<ShagunAndGuestManagerProps> = ({
  shagunList,
  guestGroups,
  onUpdateShagun,
  onAddShagun,
  onDeleteShagun,
  onUpdateGuestGroup,
  onAddGuestGroup,
  onDeleteGuestGroup,
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'shagun'>('guests');
  const [searchTerm, setSearchTerm] = useState('');
  const [guestSideFilter, setGuestSideFilter] = useState<'ALL' | 'GROOM' | 'BRIDE'>('ALL');
  const [guestTypeFilter, setGuestTypeFilter] = useState<'ALL' | 'INDIVIDUAL' | 'FAMILY_PLUS' | 'CLUSTER'>('ALL');
  
  // Shagun Modal / Form State
  const [showAddShagunModal, setShowAddShagunModal] = useState(false);
  const [newShagun, setNewShagun] = useState<Partial<FamilyShagunItem>>({
    recipientName: '',
    relation: '',
    group: 'General Family',
    calculationFormula: '',
    amount: 5100,
    status: 'Planned',
    notes: '',
    side: 'GROOM',
  });

  // Guest Entry Form State (Flexible: Individual, Family+Count, or Group Cluster)
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [guestEntryMode, setGuestEntryMode] = useState<'INDIVIDUAL' | 'FAMILY_PLUS' | 'CLUSTER'>('INDIVIDUAL');
  const [newGuest, setNewGuest] = useState<{
    name: string;
    side: 'GROOM' | 'BRIDE' | 'BOTH';
    guestType: 'INDIVIDUAL' | 'FAMILY_PLUS' | 'CLUSTER';
    primaryName: string;
    plusCount: number;
    relationCategory: 'Family' | 'Relatives' | 'Friends' | 'Colleagues' | 'Neighbours' | 'VIP';
    phone: string;
    city: string;
    rsvpStatus: 'Attending' | 'Invited' | 'Tentative' | 'Declined';
    notes: string;
  }>({
    name: '',
    side: 'GROOM',
    guestType: 'INDIVIDUAL',
    primaryName: '',
    plusCount: 0,
    relationCategory: 'Family',
    phone: '',
    city: '',
    rsvpStatus: 'Invited',
    notes: '',
  });

  // Calculations
  const totalShagunAmount = shagunList.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalShagunCount = shagunList.length;

  const totalGroomGuests = useMemo(() => {
    return guestGroups
      .filter(g => g.side === 'GROOM')
      .reduce((sum, g) => sum + (g.count || 0), 0);
  }, [guestGroups]);

  const totalBrideGuests = useMemo(() => {
    return guestGroups
      .filter(g => g.side === 'BRIDE')
      .reduce((sum, g) => sum + (g.count || 0), 0);
  }, [guestGroups]);

  const totalMutualGuests = useMemo(() => {
    return guestGroups
      .filter(g => g.side === 'BOTH')
      .reduce((sum, g) => sum + (g.count || 0), 0);
  }, [guestGroups]);

  const totalAllGuests = useMemo(() => {
    return guestGroups.reduce((sum, g) => sum + (g.count || 0), 0);
  }, [guestGroups]);

  const filteredShagun = useMemo(() => {
    return shagunList.filter(item => 
      item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.calculationFormula && item.calculationFormula.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [shagunList, searchTerm]);

  const filteredGuests = useMemo(() => {
    return guestGroups.filter(item => {
      // Search
      const q = searchTerm.toLowerCase();
      const matchSearch = !searchTerm || 
        item.name.toLowerCase().includes(q) ||
        (item.contactPerson && item.contactPerson.toLowerCase().includes(q)) ||
        (item.contactPhone && item.contactPhone.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));

      // Side Filter
      const matchSide = guestSideFilter === 'ALL' || item.side === guestSideFilter || item.side === 'BOTH';

      // Type Filter
      const inferredType = item.guestType || (item.count === 1 ? 'INDIVIDUAL' : item.name.includes('+') ? 'FAMILY_PLUS' : 'CLUSTER');
      const matchType = guestTypeFilter === 'ALL' || inferredType === guestTypeFilter;

      return matchSearch && matchSide && matchType;
    });
  }, [guestGroups, searchTerm, guestSideFilter, guestTypeFilter]);

  const handleCreateShagun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShagun.recipientName || !newShagun.amount) return;
    const item: FamilyShagunItem = {
      id: `shagun-${Date.now()}`,
      recipientName: newShagun.recipientName,
      relation: newShagun.relation || 'Family Relation',
      group: newShagun.group as any || 'General Family',
      calculationFormula: newShagun.calculationFormula || '',
      amount: Number(newShagun.amount),
      status: (newShagun.status as any) || 'Planned',
      notes: newShagun.notes || '',
      side: newShagun.side as any || 'GROOM',
    };
    onAddShagun(item);
    setShowAddShagunModal(false);
    setNewShagun({
      recipientName: '',
      relation: '',
      group: 'General Family',
      calculationFormula: '',
      amount: 5100,
      status: 'Planned',
      notes: '',
      side: 'GROOM',
    });
  };

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();

    let computedName = '';
    let totalHeadcount = 1;

    if (guestEntryMode === 'INDIVIDUAL') {
      computedName = newGuest.primaryName || 'Guest Name';
      totalHeadcount = 1;
    } else if (guestEntryMode === 'FAMILY_PLUS') {
      const plus = Number(newGuest.plusCount || 1);
      computedName = `${newGuest.primaryName || 'Family Head'} (+${plus} Family)`;
      totalHeadcount = 1 + plus;
    } else {
      // Group Cluster
      computedName = newGuest.name || 'Group Cluster';
      totalHeadcount = Math.max(1, Number(newGuest.plusCount || 10));
    }

    const item: GuestGroupItem = {
      id: `guest-${Date.now()}`,
      name: computedName,
      side: newGuest.side,
      count: totalHeadcount,
      guestType: guestEntryMode,
      plusCount: guestEntryMode === 'FAMILY_PLUS' ? Number(newGuest.plusCount) : undefined,
      relationCategory: newGuest.relationCategory,
      contactPerson: newGuest.primaryName || newGuest.name,
      contactPhone: newGuest.phone,
      city: newGuest.city,
      rsvpStatus: newGuest.rsvpStatus,
      isAnonymousNumbers: guestEntryMode === 'CLUSTER',
      notes: newGuest.notes,
    };

    onAddGuestGroup(item);
    setShowAddGuestModal(false);
    setNewGuest({
      name: '',
      side: 'GROOM',
      guestType: 'INDIVIDUAL',
      primaryName: '',
      plusCount: 0,
      relationCategory: 'Family',
      phone: '',
      city: '',
      rsvpStatus: 'Invited',
      notes: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Total Confirmed Guests */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 p-5 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Total Guest Headcount
            </span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalAllGuests}
            </span>
            <span className="text-xs text-slate-500 font-bold">Total Expected</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Across {guestGroups.length} guests, families & clusters
          </p>
        </div>

        {/* Card 2: Bhuvi (Groom) Guests */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-sky-950/20 p-5 rounded-3xl border-2 border-blue-200 dark:border-blue-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              🤵 Bhuvesh Guests
            </span>
            <span className="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-lg">
              Boy Side
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalGroomGuests}
            </span>
            <span className="text-xs text-slate-500 font-bold">Guests</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Paternal relatives, tech friends & colleagues
          </p>
        </div>

        {/* Card 3: Harsha (Bride) Guests */}
        <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-pink-950/30 dark:via-slate-900 dark:to-rose-950/20 p-5 rounded-3xl border-2 border-pink-200 dark:border-pink-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              👰 Harsha Guests
            </span>
            <span className="text-xs font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-lg">
              Girl Side
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalBrideGuests}
            </span>
            <span className="text-xs text-slate-500 font-bold">Guests</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Extended family, bridesmaids & relatives
          </p>
        </div>

        {/* Card 4: Family Shagun Total */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20 p-5 rounded-3xl border-2 border-amber-200 dark:border-amber-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Family Shagun Total
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300">
              <Gift size={20} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {formatINR(totalShagunAmount)}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
            {totalShagunCount} family cash envelopes & rituals
          </p>
        </div>

      </div>

      {/* Main Switcher: Guests List vs Shagun Manager */}
      <div className="bg-white/95 dark:bg-[#121626]/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-5">
        
        {/* Header Strip with Tabs & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          
          {/* Main Module Tabs */}
          <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('guests')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'guests'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Users size={15} className="text-blue-500" />
              <span>Wedding Guest Directory ({totalAllGuests})</span>
            </button>

            <button
              onClick={() => setActiveTab('shagun')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'shagun'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Gift size={15} className="text-pink-500" />
              <span>Family Shagun Manager ({totalShagunCount})</span>
            </button>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'guests' ? (
              <button
                onClick={() => setShowAddGuestModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer shadow-md transition-all"
              >
                <Plus size={15} />
                <span>Add Guest / Family (+Plus)</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddShagunModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs cursor-pointer shadow-md transition-all"
              >
                <Plus size={15} />
                <span>Add Shagun Envelope</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Perspective Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text"
              placeholder={activeTab === 'guests' ? "Search by guest name, phone, city, notes..." : "Search shagun recipient, relation..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Guest Specific Filters */}
          {activeTab === 'guests' && (
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Side Filter: All / Boy / Girl */}
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-white/10 text-xs">
                <button
                  onClick={() => setGuestSideFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    guestSideFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Sides
                </button>
                <button
                  onClick={() => setGuestSideFilter('GROOM')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    guestSideFilter === 'GROOM'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  🤵 Bhuvi ({totalGroomGuests})
                </button>
                <button
                  onClick={() => setGuestSideFilter('BRIDE')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    guestSideFilter === 'BRIDE'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-rose-600'
                  }`}
                >
                  👰 Harsha ({totalBrideGuests})
                </button>
              </div>

              {/* Guest Type Filter: Individual / Family Plus / Cluster */}
              <select
                value={guestTypeFilter}
                onChange={(e) => setGuestTypeFilter(e.target.value as any)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
              >
                <option value="ALL">👥 All Types</option>
                <option value="INDIVIDUAL">👤 Individual (1 Guest)</option>
                <option value="FAMILY_PLUS">👨‍👩‍👧 Family with Plus (e.g. +3, +4)</option>
                <option value="CLUSTER">🏢 Group Headcount Cluster</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: GUEST DIRECTORY */}
        {activeTab === 'guests' && (
          <div className="space-y-4 pt-2">
            
            {/* Quick Helper Banner */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Info size={14} className="text-blue-500 flex-shrink-0" />
                <span>
                  Track guests as <strong>Individual guests (1)</strong>, <strong>Families (e.g. Sharma Family + 4)</strong>, or <strong>Group Clusters (e.g. 30 Colleagues)</strong> with direct WhatsApp/phone contact numbers.
                </span>
              </span>
              <strong className="text-blue-700 dark:text-blue-300 whitespace-nowrap font-black">
                Showing {filteredGuests.length} entries ({filteredGuests.reduce((s, g) => s + (g.count || 0), 0)} headcount)
              </strong>
            </div>

            {/* Guests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuests.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-400">
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No matching guests found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Click "Add Guest / Family" to add individual or group entries.</p>
                </div>
              ) : (
                filteredGuests.map((grp) => {
                  const isPlus = grp.name.includes('+') || (grp.plusCount && grp.plusCount > 0);
                  const isSingle = grp.count === 1;

                  return (
                    <div 
                      key={grp.id}
                      className="bg-white dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      {/* Top Header: Name + Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                              {grp.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                              {grp.relationCategory || 'Guest Cluster'}
                            </span>
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md flex-shrink-0 border ${
                            grp.side === 'GROOM'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300'
                              : grp.side === 'BRIDE'
                              ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-300'
                              : 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/70 dark:border-purple-800 dark:text-purple-300'
                          }`}>
                            {grp.side === 'GROOM' ? '🤵 Bhuvi' : grp.side === 'BRIDE' ? '👰 Harsha' : 'Mutual'}
                          </span>
                        </div>

                        {/* Headcount Stat */}
                        <div className="mt-3 flex items-baseline gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                            {grp.count}
                          </span>
                          <div className="text-xs text-slate-500 font-semibold leading-tight">
                            <span>{grp.count === 1 ? 'Individual Guest' : isPlus ? 'Total Family Members' : 'Group Headcount'}</span>
                            {isPlus && grp.plusCount && (
                              <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                                1 Primary + {grp.plusCount} Additional Guests
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contact details */}
                        {(grp.contactPerson || grp.contactPhone) && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            {grp.contactPerson && (
                              <div className="flex items-center gap-1.5 font-medium">
                                <User size={12} className="text-slate-400 flex-shrink-0" />
                                <span className="truncate">Contact: <strong>{grp.contactPerson}</strong></span>
                              </div>
                            )}

                            {grp.contactPhone && (
                              <div className="flex items-center justify-between gap-1.5 font-mono text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <Phone size={11} className="text-emerald-500 flex-shrink-0" />
                                  <span>{grp.contactPhone}</span>
                                </div>
                                <a
                                  href={`https://wa.me/${grp.contactPhone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 text-[10px]"
                                >
                                  <MessageCircle size={10} /> WhatsApp
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {grp.notes && (
                          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-200/50 dark:border-white/5 line-clamp-2">
                            {grp.notes}
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-400">
                          {isSingle ? '👤 1 Guest' : isPlus ? '👨‍👩‍👧 Family Plus' : '🏢 Headcount Cluster'}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Remove guest entry "${grp.name}"?`)) {
                              onDeleteGuestGroup(grp.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete guest entry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB 2: SHAGUN MANAGER */}
        {activeTab === 'shagun' && (
          <div className="overflow-x-auto w-full pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4">Recipient Name</th>
                  <th className="py-3 px-4">Side</th>
                  <th className="py-3 px-4">Relation / Detail</th>
                  <th className="py-3 px-4">Calculation / Formula</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredShagun.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {item.recipientName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        item.side === 'GROOM'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                      }`}>
                        {item.side === 'GROOM' ? 'Bhuvesh' : 'Harsha'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {item.relation}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700 dark:text-purple-300 text-[11px]">
                      {item.calculationFormula || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white text-sm">
                      {formatINR(item.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateShagun({ ...item, status: e.target.value as any })}
                        className={`text-[10px] font-black px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                          item.status === 'Given'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        <option value="Planned">Planned</option>
                        <option value="Given">Given / Cleared</option>
                        <option value="Pending Confirmation">To Confirm</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs truncate">
                      {item.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Remove shagun entry for "${item.recipientName}"?`)) {
                            onDeleteShagun(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD GUEST / FAMILY (+PLUS) */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-[#11141D] p-5 sm:p-6 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-white/10 my-4 sm:my-8 animate-in zoom-in-95 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
            <h3 className="font-black text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2 flex-shrink-0">
              <Users className="text-blue-500" size={18} />
              <span>Add Wedding Guest / Family (+Plus)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-shrink-0">
              Add individual guests, families with additional headcount (+1, +2, +3, +4), or group clusters.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3.5 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setGuestEntryMode('INDIVIDUAL')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  guestEntryMode === 'INDIVIDUAL'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                👤 Individual (1)
              </button>
              <button
                type="button"
                onClick={() => setGuestEntryMode('FAMILY_PLUS')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  guestEntryMode === 'FAMILY_PLUS'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                👨‍👩‍👧 Family (+Plus)
              </button>
              <button
                type="button"
                onClick={() => setGuestEntryMode('CLUSTER')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  guestEntryMode === 'CLUSTER'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-black'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🏢 Group Cluster
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              
              {/* Name Fields according to Mode */}
              {guestEntryMode === 'CLUSTER' ? (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Group / Cluster Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Office Colleagues, City Neighbours, College Friends"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  />
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {guestEntryMode === 'INDIVIDUAL' ? 'Guest Full Name' : 'Family Head / Primary Guest Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={guestEntryMode === 'INDIVIDUAL' ? "e.g. Aman Gupta" : "e.g. Rajesh Sharma Family"}
                    value={newGuest.primaryName}
                    onChange={(e) => setNewGuest({ ...newGuest, primaryName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  />
                </div>
              )}

              {/* Side & Plus Count Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Side (Boy / Girl)
                  </label>
                  <select
                    value={newGuest.side}
                    onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  >
                    <option value="GROOM">🤵 Bhuvesh (Groom)</option>
                    <option value="BRIDE">👰 Harsha (Bride)</option>
                    <option value="BOTH">Mutual / Both</option>
                  </select>
                </div>

                {guestEntryMode === 'FAMILY_PLUS' ? (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Additional Members (+Plus)
                    </label>
                    <select
                      value={newGuest.plusCount}
                      onChange={(e) => setNewGuest({ ...newGuest, plusCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                    >
                      <option value={1}>+1 (Spouse / Partner) — Total 2</option>
                      <option value={2}>+2 (Couple + 1 Child) — Total 3</option>
                      <option value={3}>+3 (Family of 4) — Total 4</option>
                      <option value={4}>+4 (Family of 5) — Total 5</option>
                      <option value={5}>+5 (Large Family) — Total 6</option>
                    </select>
                  </div>
                ) : guestEntryMode === 'CLUSTER' ? (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Total Headcount
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 25"
                      value={newGuest.plusCount || 20}
                      onChange={(e) => setNewGuest({ ...newGuest, plusCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Guest Count
                    </label>
                    <div className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border rounded-xl font-bold text-slate-500">
                      1 (Individual)
                    </div>
                  </div>
                )}
              </div>

              {/* Category & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Relationship Category
                  </label>
                  <select
                    value={newGuest.relationCategory}
                    onChange={(e) => setNewGuest({ ...newGuest, relationCategory: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  >
                    <option value="Family">👨‍👩‍👦 Family</option>
                    <option value="Relatives">🏡 Relatives</option>
                    <option value="Friends">🎉 Friends</option>
                    <option value="Colleagues">💼 Colleagues</option>
                    <option value="Neighbours">🏘️ Neighbours</option>
                    <option value="VIP">⭐ VIP Guest</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Phone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-mono font-medium"
                  />
                </div>
              </div>

              {/* City & RSVP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Delhi, Mumbai"
                    value={newGuest.city}
                    onChange={(e) => setNewGuest({ ...newGuest, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={newGuest.rsvpStatus}
                    onChange={(e) => setNewGuest({ ...newGuest, rsvpStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  >
                    <option value="Invited">💌 Invited</option>
                    <option value="Attending">✅ Attending (Confirmed)</option>
                    <option value="Tentative">⏳ Tentative</option>
                    <option value="Declined">❌ Declined</option>
                  </select>
                </div>
              </div>

              {/* Accommodation Requirement (Simplified: Yes, No, Hall stay with mattresses) */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Accommodation / Room Requirement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Room required: Yes', label: '🛏️ Yes (Room)' },
                    { id: 'Room required: No', label: '❌ No Room' },
                    { id: 'Will accommodate in hall with extra mattresses', label: '🛋️ Hall / Mattresses' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const existing = newGuest.notes || '';
                        const clean = existing.replace(/Room required: [^•]*/g, '').replace(/Will accommodate[^•]*/g, '').trim();
                        setNewGuest({
                          ...newGuest,
                          notes: clean ? `${opt.id} • ${clean}` : opt.id
                        });
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                        newGuest.notes?.includes(opt.id)
                          ? 'bg-blue-500 text-white border-blue-500 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Room required: Yes (or hall stay with mattresses)"
                  value={newGuest.notes}
                  onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md cursor-pointer"
                >
                  Save Guest
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SHAGUN */}
      {showAddShagunModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-[#11141D] p-5 sm:p-6 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-white/10 my-4 sm:my-8 animate-in zoom-in-95 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
            <h3 className="font-black text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2 flex-shrink-0">
              <Gift className="text-pink-500" size={18} />
              <span>Add Family Shagun / Ritual Envelope</span>
            </h3>

            <form onSubmit={handleCreateShagun} className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Name / Ceremony
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chache-Bhua, Aditi & Ananya, Juta Lukai"
                  value={newShagun.recipientName}
                  onChange={(e) => setNewShagun({ ...newShagun, recipientName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Relation / Detail
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paternal Uncles, Nieces"
                    value={newShagun.relation}
                    onChange={(e) => setNewShagun({ ...newShagun, relation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category Group
                  </label>
                  <select
                    value={newShagun.group}
                    onChange={(e) => setNewShagun({ ...newShagun, group: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  >
                    <option value="Chache-Bhua">Chache-Bhua</option>
                    <option value="Mamma-Massi">Mamma-Massi</option>
                    <option value="Sisters & In-laws">Sisters & In-laws</option>
                    <option value="Cousins & Youth">Cousins & Youth</option>
                    <option value="Custom Rituals / Shagun">Custom Rituals / Shagun</option>
                    <option value="General Family">General Family</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newShagun.amount}
                    onChange={(e) => setNewShagun({ ...newShagun, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-black text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Side
                  </label>
                  <select
                    value={newShagun.side}
                    onChange={(e) => setNewShagun({ ...newShagun, side: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  >
                    <option value="GROOM">Bhuvesh (Groom)</option>
                    <option value="BRIDE">Harsha (Bride)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Formula / Breakdown (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8 × ₹5,100 cash envelopes"
                  value={newShagun.calculationFormula}
                  onChange={(e) => setNewShagun({ ...newShagun, calculationFormula: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newShagun.notes}
                  onChange={(e) => setNewShagun({ ...newShagun, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddShagunModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black shadow-md cursor-pointer"
                >
                  Save Shagun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
