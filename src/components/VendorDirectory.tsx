'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { VendorDirectoryItem, ExpenseCategory } from '@/types/wedding';
import { formatINR } from '@/lib/constants';

interface VendorDirectoryProps {
  vendors: VendorDirectoryItem[];
  onAddVendor: (vendor: VendorDirectoryItem) => void;
  onUpdateVendor: (vendor: VendorDirectoryItem) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorDirectory: React.FC<VendorDirectoryProps> = ({
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorDirectoryItem | null>(null);

  const [formData, setFormData] = useState<Partial<VendorDirectoryItem>>({
    vendorBusinessName: '',
    category: 'Venue & Accommodation',
    contactPerson: '',
    phone: '',
    alternatePhone: '',
    locationCity: '',
    internalResponsiblePerson: 'Bhuvesh (Groom)',
    serviceDescription: '',
    status: 'Confirmed',
    totalAgreedAmount: 0,
  });

  const categories = Array.from(new Set(vendors.map(v => v.category)));

  const filteredVendors = vendors.filter(item => {
    const matchesSearch = 
      item.vendorBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.internalResponsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setFormData({
      vendorBusinessName: '',
      category: 'Venue & Accommodation',
      contactPerson: '',
      phone: '',
      alternatePhone: '',
      locationCity: '',
      internalResponsiblePerson: 'Bhuvesh (Groom)',
      serviceDescription: '',
      status: 'Confirmed',
      totalAgreedAmount: 0,
    });
    setEditingVendor(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (v: VendorDirectoryItem) => {
    setFormData(v);
    setEditingVendor(v);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendorBusinessName || !formData.contactPerson) return;

    if (editingVendor) {
      onUpdateVendor({
        ...editingVendor,
        ...(formData as VendorDirectoryItem),
      });
    } else {
      const newV: VendorDirectoryItem = {
        id: `ven-${Date.now()}`,
        vendorBusinessName: formData.vendorBusinessName!,
        category: formData.category || 'General',
        contactPerson: formData.contactPerson!,
        phone: formData.phone || '',
        alternatePhone: formData.alternatePhone || '',
        locationCity: formData.locationCity || '',
        internalResponsiblePerson: formData.internalResponsiblePerson || 'Bhuvesh',
        serviceDescription: formData.serviceDescription || '',
        status: (formData.status as any) || 'Confirmed',
        totalAgreedAmount: Number(formData.totalAgreedAmount || 0),
      };
      onAddVendor(newV);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Overview */}
      <div className="theme-card bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-pink-50/60 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30 p-6 rounded-3xl border-2 border-pink-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-black mb-1 border border-blue-300 dark:border-blue-700">
            <ShieldCheck size={14} className="text-blue-600" />
            <span>Vendors Directory & Family Responsibilities</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Key Vendors, Phone Contacts & Our Family Leads</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            Who to call for Palace, Sweets (Mithai), Wedding Cards, Gold, Dhol & Rath — and <strong>who from our family is responsible for each</strong>.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            All Vendors ({vendors.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor, contact, or our lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-pink-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium w-full sm:w-64"
          />
        </div>
      </div>

      {/* Vendors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVendors.map((item) => (
          <div
            key={item.id}
            className="theme-card bg-white/95 rounded-3xl p-5 border-2 border-slate-200/90 dark:border-white/10 shadow-md hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Header: Category & Status */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {item.status}
                </span>
              </div>

              {/* Business Name */}
              <h4 className="mt-3 font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {item.vendorBusinessName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {item.serviceDescription}
              </p>

              {/* Vendor Contact Box */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Contact: <strong>{item.contactPerson}</strong></span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-slate-400 flex-shrink-0" />
                    <a href={`tel:${item.phone}`} className="hover:underline">{item.phone}</a>
                  </div>
                  {item.alternatePhone && (
                    <span className="text-[10px] text-slate-400">{item.alternatePhone}</span>
                  )}
                </div>
                {item.locationCity && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <MapPin size={10} className="text-slate-400" />
                    <span>{item.locationCity}</span>
                  </div>
                )}
              </div>

              {/* Family Responsibility Capsule (Who will handle from our side) */}
              <div className="mt-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/40">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
                  <UserCheck size={12} className="text-amber-600" />
                  <span>Responsible From Our Side:</span>
                </div>
                <div className="mt-1 text-xs font-black text-amber-950 dark:text-amber-200">
                  {item.internalResponsiblePerson}
                </div>
              </div>
            </div>

            {/* Card Footer: Agreed Amount & Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Agreed Budget</span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {formatINR(item.totalAgreedAmount || 0)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit vendor details"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete vendor "${item.vendorBusinessName}"?`)) {
                      onDeleteVendor(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Remove vendor"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT VENDOR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full shadow-2xl border-2 border-blue-300 dark:border-white/20 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Building2 className="text-blue-500" size={18} />
              <span>{editingVendor ? 'Edit Vendor Details' : 'Add New Vendor & Family Lead'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Vendor / Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Palace Resort, Bikaner Sweets, Shree Ganesh Wedding Cards"
                  value={formData.vendorBusinessName || ''}
                  onChange={(e) => setFormData({ ...formData, vendorBusinessName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold"
                  >
                    <option value="Venue & Accommodation">Venue & Accommodation</option>
                    <option value="Catering & Dining">Catering & Dining (Mithai)</option>
                    <option value="Invitations & Miscellaneous">Invitations & Cards</option>
                    <option value="Attire, Jewelry & MUA">Attire, Jewelry & MUA</option>
                    <option value="Photography & Cinema">Photography & Cinema</option>
                    <option value="Music & Entertainment">Music & Entertainment</option>
                    <option value="Logistics & Shuttles">Logistics & Rath/Ghodi</option>
                    <option value="Gifts, Shagun & Favors">Gifts & Blankets (Kambal)</option>
                    <option value="Ritual & Puja Items">Ritual & Pandit Ji</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Agreed Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.totalAgreedAmount || 0}
                    onChange={(e) => setFormData({ ...formData, totalAgreedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Rajesh / Owner"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Family Responsibility Lead */}
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                <label className="font-black text-amber-900 dark:text-amber-200 block mb-1">
                  Who from our side will handle this responsibility?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elder Chacha Ji, Father, Bhuvesh, Mamma Ji Jagadhri"
                  value={formData.internalResponsiblePerson || ''}
                  onChange={(e) => setFormData({ ...formData, internalResponsiblePerson: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 font-bold text-amber-950 dark:text-amber-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Service Inclusions / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Details of what is included, location, booking terms..."
                  value={formData.serviceDescription || ''}
                  onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
