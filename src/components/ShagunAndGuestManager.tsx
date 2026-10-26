'use client';

import React, { useState } from 'react';
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
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'shagun' | 'guests'>('shagun');
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // Guest Group Form State
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState<Partial<GuestGroupItem>>({
    name: '',
    side: 'GROOM',
    count: 20,
    contactPerson: '',
    isAnonymousNumbers: false,
    notes: '',
  });

  // Shagun calculations
  const totalShagunAmount = shagunList.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalShagunCount = shagunList.length;

  // Guest group calculations
  const totalGroomGroupGuests = guestGroups
    .filter(g => g.side === 'GROOM')
    .reduce((sum, g) => sum + (g.count || 0), 0);
  const totalBrideGroupGuests = guestGroups
    .filter(g => g.side === 'BRIDE')
    .reduce((sum, g) => sum + (g.count || 0), 0);
  const totalAllGuests = guestGroups.reduce((sum, g) => sum + (g.count || 0), 0);

  const filteredShagun = shagunList.filter(item => 
    item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.calculationFormula && item.calculationFormula.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredGroups = guestGroups.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.contactPerson && item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.count) return;
    const item: GuestGroupItem = {
      id: `grp-${Date.now()}`,
      name: newGroup.name,
      side: newGroup.side as any || 'GROOM',
      count: Number(newGroup.count),
      contactPerson: newGroup.contactPerson || '',
      isAnonymousNumbers: Boolean(newGroup.isAnonymousNumbers),
      notes: newGroup.notes || '',
    };
    onAddGuestGroup(item);
    setShowAddGroupModal(false);
    setNewGroup({
      name: '',
      side: 'GROOM',
      count: 20,
      contactPerson: '',
      isAnonymousNumbers: false,
      notes: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Shagun Total */}
        <div className="theme-card bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-pink-950/20 p-5 rounded-3xl border-2 border-pink-200 dark:border-pink-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
              Family Shagun & Rituals
            </span>
            <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300">
              <Gift size={20} />
            </div>
          </div>
          <div className="mt-2 font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {formatINR(totalShagunAmount)}
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <strong>{totalShagunCount}</strong> recipients / ceremonial events recorded (Chache, Bhua, Jagadhri, Juta & Ribbon)
          </p>
        </div>

        {/* Card 2: Guest Group Headcount */}
        <div className="theme-card bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-blue-950/30 dark:via-slate-900 dark:to-sky-950/20 p-5 rounded-3xl border-2 border-blue-200 dark:border-blue-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Total Guest Headcount
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-2 font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {totalAllGuests} <span className="text-sm font-bold text-slate-500">Guests</span>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <strong className="text-blue-600 dark:text-blue-400">{totalGroomGroupGuests}</strong> Groom side • <strong className="text-pink-600 dark:text-pink-400">{totalBrideGroupGuests}</strong> Bride side
          </p>
        </div>

        {/* Card 3: Clarifications & Notes Banner */}
        <div className="theme-card bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20 p-5 rounded-3xl border-2 border-amber-200 dark:border-amber-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Notes & Pending Clarifications
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
              <Info size={20} />
            </div>
          </div>
          <ul className="mt-2 text-xs space-y-1 text-slate-700 dark:text-slate-300 font-medium">
            <li>• <strong>Tops:</strong> ₹35k included in ₹6.35L Gold budget.</li>
            <li>• <strong>Kambal:</strong> Listed at ₹50,000 (30 pcs × ₹500 = ₹15k alternate).</li>
            <li>• <strong>Family gifts:</strong> Jagadhri (₹30.6k) & Isha–Shippu (₹9.3k) calculated.</li>
          </ul>
        </div>
      </div>

      {/* Tabs Switcher: Shagun vs Guest Groups */}
      <div className="theme-card bg-white/95 rounded-3xl border-2 border-pink-200 shadow-xl overflow-hidden p-6 transition-all">
        
        {/* Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-pink-100 dark:border-white/10">
          
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('shagun')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'shagun'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gift size={15} />
              <span>Family Shagun & Rituals ({shagunList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'guests'
                  ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users size={15} />
              <span>Guest Headcount & Groups ({guestGroups.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={activeTab === 'shagun' ? "Search person, relation..." : "Search group, contact..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-pink-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium"
              />
            </div>

            {/* Add Button */}
            {activeTab === 'shagun' ? (
              <button
                onClick={() => setShowAddShagunModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-md cursor-pointer transition-all"
              >
                <Plus size={15} />
                <span>Add Shagun Entry</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddGroupModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-black shadow-md cursor-pointer transition-all"
              >
                <Plus size={15} />
                <span>Add Guest Group</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB CONTENT 1: FAMILY SHAGUN LIST */}
        {activeTab === 'shagun' && (
          <div className="pt-5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-black border-b border-pink-100 dark:border-white/10">
                  <th className="py-3 px-4">Recipient / Occasion</th>
                  <th className="py-3 px-4">Relation / Purpose</th>
                  <th className="py-3 px-4">Calculation / Multiplier</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100/60 dark:divide-white/5">
                {filteredShagun.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-pink-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Recipient */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 dark:text-white text-[13px]">
                        {item.recipientName}
                      </div>
                      <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-md border border-pink-200 dark:border-pink-800 inline-block mt-0.5">
                        {item.group}
                      </span>
                    </td>

                    {/* Relation */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {item.relation}
                    </td>

                    {/* Formula */}
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700 dark:text-purple-300 text-[11px]">
                      {item.calculationFormula || '—'}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white text-sm">
                      {formatINR(item.amount)}
                    </td>

                    {/* Status */}
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

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs truncate">
                      {item.notes || '—'}
                    </td>

                    {/* Delete */}
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

        {/* TAB CONTENT 2: GUEST GROUPS & HEADCOUNTS */}
        {activeTab === 'guests' && (
          <div className="pt-5 space-y-4">
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
              <span>
                💡 <strong>Group Headcounts:</strong> You can add anonymous headcounts (e.g. "Colleagues: 30", "Neighbours: 67") or individual named family clusters with contact person info.
              </span>
              <span className="font-extrabold bg-blue-200 dark:bg-blue-900 px-2.5 py-1 rounded-xl text-blue-900 dark:text-blue-100">
                Total: {totalAllGuests} guests
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((grp) => (
                <div 
                  key={grp.id}
                  className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {grp.name}
                      </h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md flex-shrink-0 ${
                        grp.side === 'GROOM'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                          : 'bg-pink-100 text-pink-800 dark:bg-pink-950/70 dark:text-pink-300'
                      }`}>
                        {grp.side === 'GROOM' ? 'Bhuvesh Side' : 'Harsha Side'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {grp.count}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        Expected Guests
                      </span>
                    </div>

                    {grp.contactPerson && (
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Phone size={11} className="text-pink-500" />
                        <span>Lead: <strong>{grp.contactPerson}</strong></span>
                      </div>
                    )}

                    {grp.notes && (
                      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        {grp.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400">
                      {grp.isAnonymousNumbers ? '👤 Anonymous Group Headcount' : '👥 Named Cluster'}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Remove group "${grp.name}"?`)) {
                          onDeleteGuestGroup(grp.id);
                        }
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete group"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD SHAGUN */}
      {showAddShagunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full shadow-2xl border-2 border-pink-300 dark:border-white/20 animate-in zoom-in-95">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Gift className="text-pink-500" size={18} />
              <span>Add Family Shagun / Ritual Envelope</span>
            </h3>

            <form onSubmit={handleCreateShagun} className="space-y-3 text-xs">
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

              <div className="grid grid-cols-2 gap-2">
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Multiplier / Formula
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 × ₹5,100"
                    value={newShagun.calculationFormula}
                    onChange={(e) => setNewShagun({ ...newShagun, calculationFormula: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newShagun.amount}
                    onChange={(e) => setNewShagun({ ...newShagun, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes / Clarification
                </label>
                <textarea
                  rows={2}
                  placeholder="Any special remarks or bank/envelope details..."
                  value={newShagun.notes}
                  onChange={(e) => setNewShagun({ ...newShagun, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddShagunModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold shadow-md hover:bg-pink-600"
                >
                  Save Shagun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD GUEST GROUP */}
      {showAddGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full shadow-2xl border-2 border-blue-300 dark:border-white/20 animate-in zoom-in-95">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Users className="text-blue-500" size={18} />
              <span>Add Guest Group / Headcount</span>
            </h3>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Group / Cluster Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jagadhri Relatives, College Friends, Neighbours"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Side
                  </label>
                  <select
                    value={newGroup.side}
                    onChange={(e) => setNewGroup({ ...newGroup, side: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  >
                    <option value="GROOM">Bhuvesh (Groom)</option>
                    <option value="BRIDE">Harsha (Bride)</option>
                    <option value="BOTH">Mutual / Both</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Guest Count (Headcount)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newGroup.count}
                    onChange={(e) => setNewGroup({ ...newGroup, count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Person / Family Head (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mamma Ji, Office Lead"
                  value={newGroup.contactPerson}
                  onChange={(e) => setNewGroup({ ...newGroup, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={newGroup.isAnonymousNumbers}
                  onChange={(e) => setNewGroup({ ...newGroup, isAnonymousNumbers: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="anonymousCheck" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  This is an anonymous group headcount (e.g. 30 colleagues, 50 neighbours)
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes & Accommodation
                </label>
                <textarea
                  rows={2}
                  placeholder="Room requirements, arrival dates, etc."
                  value={newGroup.notes}
                  onChange={(e) => setNewGroup({ ...newGroup, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

