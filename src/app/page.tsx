'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Settings as SettingsIcon, 
  Download, 
  ListFilter, 
  PieChart as ChartIcon, 
  Calendar as CalendarIcon, 
  LogIn, 
  Sparkles, 
  CheckCircle, 
  FileSpreadsheet, 
  Crown, 
  RotateCcw, 
  Flower2,
  CalendarDays
} from 'lucide-react';
import { INITIAL_EXPENSES, INITIAL_SETTINGS } from '@/lib/mock-data';
import { INITIAL_CEREMONY_SCHEDULE } from '@/lib/ceremony-data';
import { INITIAL_SHAGUN_LIST, INITIAL_GUEST_GROUPS } from '@/lib/shagun-data';
import { INITIAL_VENDOR_DIRECTORY } from '@/lib/vendor-data';
import { ExpenseItem, WeddingSettings, CeremonyScheduleItem, FamilyShagunItem, GuestGroupItem, VendorDirectoryItem, WeddingEvent } from '@/types/wedding';
import { calculateSummary, computeExpenseShares } from '@/lib/calculator';
import { DashboardStats } from '@/components/DashboardStats';
import { BudgetCharts } from '@/components/BudgetCharts';
import { ExpenseTable } from '@/components/ExpenseTable';
import { OccasionGuestSyncBar } from '@/components/OccasionGuestSyncBar';
import { SettingsModal } from '@/components/SettingsModal';
import { WeddingCalendar } from '@/components/WeddingCalendar';
import { WeddingHeroBanner } from '@/components/WeddingHeroBanner';
import { AnimalCelebrationSection } from '@/components/AnimalCelebrationSection';
import { ShagunAndGuestManager } from '@/components/ShagunAndGuestManager';
import { VendorDirectory } from '@/components/VendorDirectory';
import { ThemeToggle } from '@/components/ThemeToggle';
import confetti from 'canvas-confetti';
import { Gift, Users as UsersIcon, Building2 } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'shaadi_planner_settings_v13';
const STORAGE_KEY_EXPENSES = 'shaadi_planner_expenses_v13';
const STORAGE_KEY_SCHEDULE = 'shaadi_planner_schedule_v13';
const STORAGE_KEY_SHAGUN = 'shaadi_planner_shagun_v13';
const STORAGE_KEY_GROUPS = 'shaadi_planner_groups_v13';
const STORAGE_KEY_VENDORS = 'shaadi_planner_vendors_v13';

export default function Home() {
  const [settings, setSettings] = useState<WeddingSettings>(INITIAL_SETTINGS);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [schedule, setSchedule] = useState<CeremonyScheduleItem[]>(INITIAL_CEREMONY_SCHEDULE);
  const [shagunList, setShagunList] = useState<FamilyShagunItem[]>(INITIAL_SHAGUN_LIST);
  const [guestGroups, setGuestGroups] = useState<GuestGroupItem[]>(INITIAL_GUEST_GROUPS);
  const [vendors, setVendors] = useState<VendorDirectoryItem[]>(INITIAL_VENDOR_DIRECTORY);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSide, setActiveSide] = useState<'ALL' | 'GROOM' | 'BRIDE'>('ALL');
  const [currentTab, setCurrentTab] = useState<'budget' | 'vendors' | 'shagun' | 'calendar' | 'charts'>('budget');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Initial Load: Read from LocalStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        const storedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
        const storedSchedule = localStorage.getItem(STORAGE_KEY_SCHEDULE);
        const storedShagun = localStorage.getItem(STORAGE_KEY_SHAGUN);
        const storedGroups = localStorage.getItem(STORAGE_KEY_GROUPS);
        const storedVendors = localStorage.getItem(STORAGE_KEY_VENDORS);

        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          if (parsed && parsed.coupleTitle) setSettings(parsed);
        }

        if (storedExpenses) {
          const parsed = JSON.parse(storedExpenses);
          if (Array.isArray(parsed) && parsed.length > 0) setExpenses(parsed);
        }

        if (storedSchedule) {
          const parsed = JSON.parse(storedSchedule);
          if (Array.isArray(parsed) && parsed.length > 0) setSchedule(parsed);
        }

        if (storedShagun) {
          const parsed = JSON.parse(storedShagun);
          if (Array.isArray(parsed) && parsed.length > 0) setShagunList(parsed);
        }

        if (storedGroups) {
          const parsed = JSON.parse(storedGroups);
          if (Array.isArray(parsed) && parsed.length > 0) setGuestGroups(parsed);
        }

        if (storedVendors) {
          const parsed = JSON.parse(storedVendors);
          if (Array.isArray(parsed) && parsed.length > 0) setVendors(parsed);
        }
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Continuous Auto-Sync
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(schedule));
      localStorage.setItem(STORAGE_KEY_SHAGUN, JSON.stringify(shagunList));
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(guestGroups));
      localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
    } catch (err) {
      console.error('Failed to auto-save to localStorage:', err);
    }
  }, [expenses, settings, schedule, shagunList, guestGroups, vendors, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateExpense = (updated: ExpenseItem) => {
    setExpenses(prev => prev.map(item => item.id === updated.id ? updated : item));
    showToast(`Updated "${updated.name}"`);
  };

  const handleDeleteExpense = (id: string) => {
    const itemToDelete = expenses.find(x => x.id === id);
    setExpenses(prev => prev.filter(item => item.id !== id));
    showToast(`Deleted ${itemToDelete?.name || 'expense'}`);
  };

  const handleAddNewExpense = (created: ExpenseItem) => {
    setExpenses(prev => [created, ...prev]);
    showToast(`Added "${created.name}"`);
    triggerCelebration();
  };

  const handleUpdateScheduleItem = (updated: CeremonyScheduleItem) => {
    setSchedule(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast(`Updated schedule for ${updated.title}`);
  };

  const handleUpdateEventGuests = (event: WeddingEvent, groom: number, bride: number, perPlate?: number) => {
    setSettings(prev => ({
      ...prev,
      eventGuestCounts: {
        ...(prev.eventGuestCounts || {}),
        [event]: {
          groom,
          bride,
          perPlateRate: perPlate !== undefined ? perPlate : prev.eventGuestCounts?.[event]?.perPlateRate
        }
      }
    }));
    showToast(`Updated ${event} guest counts (${groom} Groom / ${bride} Bride)`);
  };

  const handleSaveSettings = (newSettings: WeddingSettings) => {
    setSettings(newSettings);
    showToast('Saved wedding configuration & guest split');
  };

  const handleResetToStartPhase = () => {
    if (confirm('Reset all expenses and ceremonies back to clean initial start phase?')) {
      setExpenses(INITIAL_EXPENSES);
      setSettings(INITIAL_SETTINGS);
      setSchedule(INITIAL_CEREMONY_SCHEDULE);
      localStorage.removeItem(STORAGE_KEY_EXPENSES);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_SCHEDULE);
      showToast('Reset to clean start phase');
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#EC4899', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981']
    });
  };

  const summary = calculateSummary(expenses, settings);

  const handleExportCSV = () => {
    const headers = [
      'Type',
      'Item Name',
      'Subtask / Detail',
      'Category',
      'Ceremony / Occasion',
      'Responsibility (Payer)',
      'Split Rule',
      'Estimated Cost (₹)',
      'Actual Cost (₹)',
      'Paid Advance (₹)',
      'Pending Due (₹)',
      'Bhuvesh Share (₹)',
      'Harsha Share (₹)',
      'Vendor Name',
      'Booking Status',
      'Notes'
    ];

    const escapeCsv = (str: any) => `"${String(str ?? '').replace(/"/g, '""')}"`;
    
    const rows: string[] = [];

    expenses.forEach(item => {
      const shares = computeExpenseShares(
        item,
        settings.groomGuestCount,
        settings.brideGuestCount,
        settings.eventGuestCounts
      );

      const actualCost = item.actualCost || item.estimatedCost || 0;
      const pendingDue = Math.max(0, actualCost - (item.paidAmount || 0));
      const payerLabel = item.payerCategory === 'PARENTS'
        ? 'Parents / Elders'
        : item.payerCategory === 'SHARED_FAMILY'
        ? 'Joint Family'
        : 'Couple (Bhuvesh & Harsha)';

      // 1. Main Expense Row
      rows.push([
        escapeCsv('Expense Item'),
        escapeCsv(item.name),
        escapeCsv('-'),
        escapeCsv(item.category),
        escapeCsv(item.event),
        escapeCsv(payerLabel),
        escapeCsv(item.splitType),
        item.estimatedCost || 0,
        actualCost,
        item.paidAmount || 0,
        pendingDue,
        shares.groomDue,
        shares.brideDue,
        escapeCsv(item.vendorName || ''),
        escapeCsv(item.status),
        escapeCsv(item.notes || '')
      ].join(','));

      // 2. Subtasks rows if present
      if (item.subtasks && item.subtasks.length > 0) {
        item.subtasks.forEach(st => {
          rows.push([
            escapeCsv('  ↳ Subtask'),
            escapeCsv(item.name),
            escapeCsv(`${st.label ? `[${st.label}] ` : ''}${st.name || st.label || 'Subtask'}`),
            escapeCsv(item.category),
            escapeCsv(item.event),
            escapeCsv(payerLabel),
            escapeCsv(item.splitType),
            st.cost || 0,
            st.cost || 0,
            st.paidAmount || 0,
            Math.max(0, (st.cost || 0) - (st.paidAmount || 0)),
            '-',
            '-',
            escapeCsv(item.vendorName || ''),
            escapeCsv(st.status || 'Pending'),
            escapeCsv(st.notes || '')
          ].join(','));
        });
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShaadiPlanner_${settings.coupleTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV with all subtasks and split details');
  };

  const handleExportJSON = () => {
    const fullBackup = {
      settings,
      expenses,
      schedule,
      shagunList,
      guestGroups,
      vendors,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `ShaadiPlanner_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported complete JSON backup');
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 pb-20 font-sans selection:bg-pink-300 selection:text-pink-900 transition-colors duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-pink-300 text-xs font-black px-4 py-3 rounded-2xl shadow-2xl border border-pink-500/30 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Colorful Floral Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0E1220]/90 backdrop-blur-xl border-b-2 border-pink-200 dark:border-white/10 shadow-md transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between">
          
          {/* Logo & Wedding Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-400 to-sky-400 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Click for celebratory flower shower!"
            >
              <Heart size={22} className="fill-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ShaadiPlanner
                  </span>
                  <Flower2 className="text-pink-500 w-5 h-5 animate-spin-slow" />
                </h1>
                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-500/30">
                  Floral Blossom
                </span>
                
                {/* Auto-sync indicator */}
                <div 
                  className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full"
                  title="Auto-saved to your browser storage. Safe on page refresh."
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Auto-saved locally</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                {settings.coupleTitle} • 🗓️ {settings.weddingDate}
              </p>
            </div>
          </div>

          {/* Action buttons: Theme Toggle + Settings + Export + Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Day / Night Theme Toggle */}
            <ThemeToggle />

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-500/30 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <SettingsIcon size={14} />
              <span className="hidden sm:inline">Guest Ratios & Target</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Export complete ledger with subtasks to CSV for Excel / Google Sheets"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Export full data backup (Expenses, Schedule, Shagun, Vendors, Guests) as JSON"
            >
              <Download size={14} className="text-blue-600" />
              <span className="hidden lg:inline">Export JSON</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetToStartPhase}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Reset data back to clean start phase"
            >
              <RotateCcw size={15} />
            </button>

            {/* Google Sign-in */}
            <button
              onClick={() => {
                setUserLoggedIn(!userLoggedIn);
                showToast(userLoggedIn ? 'Logged out' : 'Connected with Google Account');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl transition-all shadow-md cursor-pointer ${
                userLoggedIn 
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                  : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/20'
              }`}
            >
              <LogIn size={14} />
              <span>{userLoggedIn ? 'Connected' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area: Expanded to full modern widescreen */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 space-y-6">
        
        {/* Hero Visual Graphics Banner */}
        <WeddingHeroBanner
          settings={settings}
          totalActual={summary.totalActual}
          totalPaid={summary.totalPaid}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onCelebration={triggerCelebration}
        />

        {/* Shahi Barat Dhol & Animal Celebration Troupe Section */}
        <AnimalCelebrationSection />

        {/* Navigation Tabs with Interactive Calendar, Shagun & Groups */}
        <div className="flex border-2 border-pink-200 dark:border-white/10 gap-4 sm:gap-6 text-sm font-bold bg-white/90 dark:bg-[#121626]/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-md transition-colors overflow-x-auto">
          <button
            onClick={() => setCurrentTab('budget')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'budget' 
                ? 'text-pink-600 dark:text-pink-400 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ListFilter size={17} />
            <span>Budget & Split Ledger</span>
            {currentTab === 'budget' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('vendors')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'vendors' 
                ? 'text-indigo-600 dark:text-indigo-400 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Building2 size={17} />
            <span>Vendors & Family Leads</span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-extrabold px-1.5 py-0.2 rounded-full border border-indigo-300 dark:border-indigo-700">
              {vendors.length} Vendors
            </span>
            {currentTab === 'vendors' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('shagun')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'shagun' 
                ? 'text-rose-600 dark:text-rose-400 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Gift size={17} />
            <span>Family Shagun & Guest Groups</span>
            <span className="text-[10px] bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-extrabold px-1.5 py-0.2 rounded-full border border-rose-300 dark:border-rose-700">
              ₹5.13L
            </span>
            {currentTab === 'shagun' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('calendar')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'calendar' 
                ? 'text-purple-600 dark:text-purple-400 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <CalendarDays size={17} />
            <span>Ceremony Calendar & Timings</span>
            {currentTab === 'calendar' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('charts')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'charts' 
                ? 'text-blue-600 dark:text-blue-400 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ChartIcon size={17} />
            <span>Visual Analytics</span>
            {currentTab === 'charts' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Dashboard KPIs */}
        <DashboardStats
          summary={summary}
          settings={settings}
          activeSide={activeSide}
          onSideChange={setActiveSide}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Tab 1: Color-Coded Expense Table with full horizontal visibility */}
        {currentTab === 'budget' && (
          <div className="space-y-6">
            {/* Real-time Interactive Occasion Guest Sync Bar */}
            <OccasionGuestSyncBar
              settings={settings}
              onUpdateEventGuests={handleUpdateEventGuests}
            />

            <ExpenseTable
              expenses={expenses}
              groomGuestCount={settings.groomGuestCount}
              brideGuestCount={settings.brideGuestCount}
              eventGuestCounts={settings.eventGuestCounts}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              onAddNewExpense={handleAddNewExpense}
              sideFilter={activeSide}
            />
          </div>
        )}

        {/* Tab 2: Vendors Directory & Family Responsibilities */}
        {currentTab === 'vendors' && (
          <VendorDirectory
            vendors={vendors}
            onAddVendor={(v) => {
              setVendors(prev => [v, ...prev]);
              showToast(`Added ${v.vendorBusinessName}`);
            }}
            onUpdateVendor={(v) => {
              setVendors(prev => prev.map(item => item.id === v.id ? v : item));
              showToast(`Updated ${v.vendorBusinessName}`);
            }}
            onDeleteVendor={(id) => {
              setVendors(prev => prev.filter(item => item.id !== id));
              showToast('Deleted vendor entry');
            }}
          />
        )}

        {/* Tab 3: Family Shagun & Guest Groups Manager */}
        {currentTab === 'shagun' && (
          <ShagunAndGuestManager
            shagunList={shagunList}
            guestGroups={guestGroups}
            onUpdateShagun={(item) => {
              setShagunList(prev => prev.map(s => s.id === item.id ? item : s));
              showToast(`Updated shagun for ${item.recipientName}`);
            }}
            onAddShagun={(item) => {
              setShagunList(prev => [item, ...prev]);
              showToast(`Added shagun for ${item.recipientName}`);
            }}
            onDeleteShagun={(id) => {
              setShagunList(prev => prev.filter(s => s.id !== id));
              showToast('Deleted shagun entry');
            }}
            onUpdateGuestGroup={(grp) => {
              setGuestGroups(prev => prev.map(g => g.id === grp.id ? grp : g));
              showToast(`Updated ${grp.name}`);
            }}
            onAddGuestGroup={(grp) => {
              setGuestGroups(prev => [grp, ...prev]);
              showToast(`Added ${grp.name} (${grp.count} guests)`);
            }}
            onDeleteGuestGroup={(id) => {
              setGuestGroups(prev => prev.filter(g => g.id !== id));
              showToast('Deleted guest group');
            }}
          />
        )}

        {/* Tab 3: Interactive Wedding Calendar & Time Slots */}
        {currentTab === 'calendar' && (
          <WeddingCalendar
            schedule={schedule}
            expenses={expenses}
            onUpdateScheduleItem={handleUpdateScheduleItem}
          />
        )}

        {/* Tab 4: Visual Analytics */}
        {currentTab === 'charts' && (
          <BudgetCharts
            expenses={expenses}
            groomGuestCount={settings.groomGuestCount}
            brideGuestCount={settings.brideGuestCount}
          />
        )}
      </main>

      {/* Guest Count & Budget Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
