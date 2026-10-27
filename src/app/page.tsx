'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  CalendarDays,
  MoreVertical
} from 'lucide-react';
import { INITIAL_EXPENSES, INITIAL_SETTINGS } from '@/lib/mock-data';
import { INITIAL_CEREMONY_SCHEDULE } from '@/lib/ceremony-data';
import { INITIAL_SHAGUN_LIST, INITIAL_GUEST_GROUPS } from '@/lib/shagun-data';
import { INITIAL_VENDOR_DIRECTORY } from '@/lib/vendor-data';
import { ExpenseItem, WeddingSettings, CeremonyScheduleItem, FamilyShagunItem, GuestGroupItem, VendorDirectoryItem, WeddingEvent } from '@/types/wedding';
import { calculateSummary, computeExpenseShares } from '@/lib/calculator';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  fetchRemoteWeddingData, 
  syncSettingsToRemote, 
  syncExpenseToRemote, 
  deleteExpenseFromRemote, 
  seedInitialDataIfEmpty,
  subscribeToRemoteChanges
} from '@/lib/supabase-sync';
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
  const [isSimplifiedView, setIsSimplifiedView] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track whether an edit was recently made locally to ignore incoming echo events
  const isLocalMutationRef = useRef(false);
  const localMutationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const markLocalMutation = () => {
    isLocalMutationRef.current = true;
    if (localMutationTimerRef.current) clearTimeout(localMutationTimerRef.current);
    localMutationTimerRef.current = setTimeout(() => {
      isLocalMutationRef.current = false;
    }, 2500); // 2.5s window protects against echo reloads while typing/editing
  };

  // 1. Initial Load: Supabase Cloud Database is Primary; LocalStorage is Offline Fallback
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const remoteData = await fetchRemoteWeddingData();
        if (remoteData && isMounted) {
          if (remoteData.settings) setSettings(remoteData.settings);
          if (remoteData.expenses && remoteData.expenses.length > 0) setExpenses(remoteData.expenses);
          if (remoteData.schedule && remoteData.schedule.length > 0) setSchedule(remoteData.schedule);
          if (remoteData.shagunList && remoteData.shagunList.length > 0) setShagunList(remoteData.shagunList);
          if (remoteData.guestGroups && remoteData.guestGroups.length > 0) setGuestGroups(remoteData.guestGroups);
          if (remoteData.vendors && remoteData.vendors.length > 0) setVendors(remoteData.vendors);
          console.log('✓ Successfully connected and loaded from Supabase Cloud');
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage cache:', err);
      }

      // Offline / Local fallback: Read from localStorage cached copy only if cloud is unreachable
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
        console.warn('LocalStorage fallback load error:', e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }

    loadData();

    // 2. Real-Time Remote Subscription: Instantly reflect updates made in other windows / mobile
    // Debounce to prevent remote updates from firing in quick succession
    let debounceTimer: NodeJS.Timeout | null = null;
    const unsubscribe = subscribeToRemoteChanges(() => {
      // If the current window is making local mutations, do NOT trigger a reload echo
      if (isLocalMutationRef.current) {
        console.log('Ignored remote echo from own local mutation');
        return;
      }

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (isLocalMutationRef.current) return;
        console.log('⚡ Real-time update received from Supabase cloud! Re-fetching latest data...');
        fetchRemoteWeddingData().then(remoteData => {
          if (remoteData && isMounted && !isLocalMutationRef.current) {
            if (remoteData.settings) setSettings(remoteData.settings);
            if (remoteData.expenses && remoteData.expenses.length > 0) setExpenses(remoteData.expenses);
            if (remoteData.schedule && remoteData.schedule.length > 0) setSchedule(remoteData.schedule);
            if (remoteData.shagunList && remoteData.shagunList.length > 0) setShagunList(remoteData.shagunList);
            if (remoteData.guestGroups && remoteData.guestGroups.length > 0) setGuestGroups(remoteData.guestGroups);
            if (remoteData.vendors && remoteData.vendors.length > 0) setVendors(remoteData.vendors);
            showToast('⚡ Live update synced from cloud');
          }
        });
      }, 1000);
    });

    return () => {
      isMounted = false;
      if (debounceTimer) clearTimeout(debounceTimer);
      unsubscribe();
    };
  }, []);

  // 2. Offline Mirror only (Supabase updates are invoked on explicit actions or debounced saves)
  useEffect(() => {
    if (!isLoaded) return;

    // Keep an offline mirror in localStorage
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(schedule));
      localStorage.setItem(STORAGE_KEY_SHAGUN, JSON.stringify(shagunList));
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(guestGroups));
      localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
    } catch (err) {
      console.warn('Failed to mirror to local cache:', err);
    }
  }, [expenses, settings, schedule, shagunList, guestGroups, vendors, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateExpense = (updated: ExpenseItem) => {
    markLocalMutation();
    setExpenses(prev => prev.map(item => item.id === updated.id ? updated : item));
    showToast(`Updated "${updated.name}"`);
    if (isSupabaseConfigured()) {
      syncExpenseToRemote(updated);
    }
  };

  const handleDeleteExpense = (id: string) => {
    markLocalMutation();
    const itemToDelete = expenses.find(x => x.id === id);
    setExpenses(prev => prev.filter(item => item.id !== id));
    showToast(`Deleted ${itemToDelete?.name || 'expense'}`);
    if (isSupabaseConfigured()) {
      deleteExpenseFromRemote(id);
    }
  };

  const handleAddNewExpense = (created: ExpenseItem) => {
    markLocalMutation();
    setExpenses(prev => [created, ...prev]);
    showToast(`Added "${created.name}"`);
    triggerCelebration();
    if (isSupabaseConfigured()) {
      syncExpenseToRemote(created);
    }
  };

  const handleUpdateScheduleItem = (updated: CeremonyScheduleItem) => {
    markLocalMutation();
    setSchedule(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast(`Updated schedule for ${updated.title}`);
  };

  const handleUpdateEventGuests = (event: WeddingEvent, groom: number, bride: number, perPlate?: number) => {
    markLocalMutation();
    const updatedSettings: WeddingSettings = {
      ...settings,
      eventGuestCounts: {
        ...(settings.eventGuestCounts || {}),
        [event]: {
          groom,
          bride,
          perPlateRate: perPlate !== undefined ? perPlate : settings.eventGuestCounts?.[event]?.perPlateRate
        }
      }
    };
    setSettings(updatedSettings);
    showToast(`Updated ${event} guests: ${groom}B : ${bride}H ${perPlate !== undefined ? `@ ₹${perPlate}/plate` : ''}`);
    if (isSupabaseConfigured()) {
      syncSettingsToRemote(updatedSettings);
    }
  };

  const handleSaveSettings = (newSettings: WeddingSettings) => {
    markLocalMutation();
    setSettings(newSettings);
    showToast('Saved wedding configuration & guest split');
    if (isSupabaseConfigured()) {
      syncSettingsToRemote(newSettings);
    }
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

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F1422]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          
          {/* Logo & Wedding Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Click for celebratory flower shower!"
            >
              <Heart size={16} className="fill-current text-rose-500" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                  ShaadiPlanner
                </h1>
                
                {/* Minimalist Cloud / Local Status Indicator Light */}
                <span 
                  className={`inline-block w-2 h-2 rounded-full ${
                    isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                  title={isSupabaseConfigured() ? 'Live Cloud Synced (Supabase PostgreSQL)' : 'Local Storage Mode'}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                {settings.coupleTitle} • 🗓️ {settings.weddingDate}
              </p>
            </div>
          </div>

          {/* Action buttons: Theme Toggle + Cloud Status + Export + Compact Overflow Menu */}
          <div className="flex items-center gap-2">
            
            {/* Perspective Filter Scope: Groom, Bride, Mutual */}
            <div className="hidden sm:inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 mr-1">
              <button
                onClick={() => setActiveSide('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSide === 'ALL'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Combined Mutual Ledger"
              >
                Mutual
              </button>
              <button
                onClick={() => setActiveSide('GROOM')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSide === 'GROOM'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
                title="Bhuvesh (Groom Blue)"
              >
                🤵 Bhuvi
              </button>
              <button
                onClick={() => setActiveSide('BRIDE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSide === 'BRIDE'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                }`}
                title="Harsha (Bride Pink)"
              >
                👰 Harsha
              </button>
            </div>

            {/* Simplified View Switcher Button */}
            <button
              onClick={() => {
                setIsSimplifiedView(prev => !prev);
                showToast(!isSimplifiedView ? 'Switched to Simple View' : 'Switched to Full Detailed View');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isSimplifiedView
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
              title={isSimplifiedView ? "Click to show full visuals & media" : "Click to hide decorative elements & show minimal ledger only"}
            >
              <span>{isSimplifiedView ? '⚡ Simple' : '📋 Simple'}</span>
            </button>

            {/* Day / Night Theme Toggle */}
            <ThemeToggle />

            {/* Quick Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
              title="Export complete ledger to CSV"
            >
              <FileSpreadsheet size={13} className="text-slate-500" />
              <span>CSV</span>
            </button>

            {/* More Actions Overflow Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
                title="More options & settings"
              >
                <MoreVertical size={15} />
              </button>

              {isMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <SettingsIcon size={14} className="text-slate-400" />
                    <span>Guest Ratios & Target</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={14} className="text-slate-400" />
                    <span>Export Full JSON Backup</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={handleResetToStartPhase}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Reset to Start Phase</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area: Expanded to full modern widescreen */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 space-y-6">
        
        {/* Hero Visual Graphics Banner (Hidden in Simple View) */}
        {!isSimplifiedView && (
          <>
            <WeddingHeroBanner
              settings={settings}
              totalActual={summary.totalActual}
              totalPaid={summary.totalPaid}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onCelebration={triggerCelebration}
            />

            {/* Shahi Barat Dhol & Animal Celebration Troupe Section */}
            <AnimalCelebrationSection />
          </>
        )}

        {/* Navigation Tabs with Interactive Calendar, Shagun & Groups */}
        <div className="flex border border-slate-200 dark:border-white/10 gap-3 sm:gap-5 text-xs font-semibold bg-white dark:bg-[#11141D] px-4 py-1.5 rounded-xl shadow-xs transition-colors overflow-x-auto">
          <button
            onClick={() => setCurrentTab('budget')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'budget' 
                ? 'text-slate-900 dark:text-white font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ListFilter size={17} />
            <span>Budget & Split Ledger</span>
            {currentTab === 'budget' && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('vendors')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'vendors' 
                ? 'text-slate-900 dark:text-white font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Building2 size={17} />
            <span>Vendors & Directory</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {vendors.length}
            </span>
            {currentTab === 'vendors' && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('shagun')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'shagun' 
                ? 'text-slate-900 dark:text-white font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Gift size={17} />
            <span>Family Shagun & Guests</span>
            {currentTab === 'shagun' && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('calendar')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'calendar' 
                ? 'text-slate-900 dark:text-white font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <CalendarDays size={17} />
            <span>Ceremony Calendar</span>
            {currentTab === 'calendar' && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('charts')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'charts' 
                ? 'text-slate-900 dark:text-white font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ChartIcon size={17} />
            <span>Analytics</span>
            {currentTab === 'charts' && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
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
              isSimplifiedView={isSimplifiedView}
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
