'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Settings as SettingsIcon, 
  Download, 
  ListFilter, 
  PieChart as ChartIcon, 
  Calendar, 
  LogIn, 
  Sparkles, 
  CheckCircle,
  FileSpreadsheet,
  Crown,
  RotateCcw
} from 'lucide-react';
import { INITIAL_EXPENSES, INITIAL_SETTINGS } from '@/lib/mock-data';
import { ExpenseItem, WeddingSettings } from '@/types/wedding';
import { calculateSummary } from '@/lib/calculator';
import { DashboardStats } from '@/components/DashboardStats';
import { BudgetCharts } from '@/components/BudgetCharts';
import { ExpenseTable } from '@/components/ExpenseTable';
import { SettingsModal } from '@/components/SettingsModal';
import { ItineraryView } from '@/components/ItineraryView';
import { WeddingHeroBanner } from '@/components/WeddingHeroBanner';
import { AnimalCelebrationSection } from '@/components/AnimalCelebrationSection';
import confetti from 'canvas-confetti';

const STORAGE_KEY_SETTINGS = 'shaadi_planner_settings_v3';
const STORAGE_KEY_EXPENSES = 'shaadi_planner_expenses_v3';

export default function Home() {
  const [settings, setSettings] = useState<WeddingSettings>(INITIAL_SETTINGS);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSide, setActiveSide] = useState<'ALL' | 'GROOM' | 'BRIDE'>('ALL');
  const [currentTab, setCurrentTab] = useState<'budget' | 'charts' | 'itinerary'>('budget');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Initial Load: Read from LocalStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        const storedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);

        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          if (parsed && parsed.coupleTitle) {
            setSettings(parsed);
          }
        }

        if (storedExpenses) {
          const parsed = JSON.parse(storedExpenses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setExpenses(parsed);
          }
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
    } catch (err) {
      console.error('Failed to auto-save to localStorage:', err);
    }
  }, [expenses, settings, isLoaded]);

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

  const handleSaveSettings = (newSettings: WeddingSettings) => {
    setSettings(newSettings);
    showToast('Saved wedding configuration & guest split');
  };

  const handleResetToStartPhase = () => {
    if (confirm('Reset all expenses back to the clean initial start phase?')) {
      setExpenses(INITIAL_EXPENSES);
      setSettings(INITIAL_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_EXPENSES);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      showToast('Reset to clean start phase');
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F59E0B', '#EF4444', '#3B82F6', '#10B981']
    });
  };

  const summary = calculateSummary(expenses, settings);

  const handleExportCSV = () => {
    const headers = [
      'ID', 'Item Name', 'Category', 'Ceremony Event', 'Vendor Name', 
      'Estimated Cost (INR)', 'Actual Cost (INR)', 'Paid Advance (INR)', 
      'Split Formula', 'Advance Paid By', 'Booking Status', 'Due Date', 'Notes'
    ];
    
    const rows = expenses.map(item => [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.event}"`,
      `"${item.vendorName || ''}"`,
      item.estimatedCost,
      item.actualCost,
      item.paidAmount,
      `"${item.splitType}"`,
      `"${item.paidBy}"`,
      `"${item.status}"`,
      `"${item.dueDate || ''}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShaadiPlanner_${settings.coupleTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV for Google Sheets');
  };

  return (
    <div className="min-h-screen text-slate-100 pb-20 font-sans selection:bg-amber-400/30 selection:text-amber-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1F30] text-amber-300 text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Royal Dark & Champagne Gold Header */}
      <header className="sticky top-0 z-40 bg-[#0B0E17]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Wedding Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Click for celebratory flower shower!"
            >
              <Crown size={22} className="fill-slate-950 text-slate-950" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>ShaadiPlanner</span>
                  <span className="text-amber-400 text-sm">✦</span>
                </h1>
                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  Luxury Edition
                </span>
                
                {/* Auto-sync indicator */}
                <div 
                  className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full"
                  title="Auto-saved to your browser storage. Safe on page refresh."
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Auto-saved locally</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                {settings.coupleTitle} • 🗓️ {settings.weddingDate}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
            >
              <SettingsIcon size={14} className="text-amber-400" />
              <span className="hidden sm:inline">Guest Ratios & Target</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              title="Export directly to Google Sheets CSV"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetToStartPhase}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              title="Reset data back to clean start phase"
            >
              <RotateCcw size={16} />
            </button>

            {/* Google Sign-in */}
            <button
              onClick={() => {
                setUserLoggedIn(!userLoggedIn);
                showToast(userLoggedIn ? 'Logged out' : 'Connected with Google Account');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer ${
                userLoggedIn 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-amber-500/20'
              }`}
            >
              <LogIn size={14} />
              <span>{userLoggedIn ? 'Google Connected' : 'Google Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Hero Visual Graphics Banner */}
        <WeddingHeroBanner
          settings={settings}
          totalActual={summary.totalActual}
          totalPaid={summary.totalPaid}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onCelebration={triggerCelebration}
        />

        {/* Shahi Barat Animal Celebration Troupe Section */}
        <AnimalCelebrationSection />

        {/* Navigation Tabs with Golden Accent */}
        <div className="flex border border-white/10 gap-6 text-sm font-bold bg-[#121624]/80 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl">
          <button
            onClick={() => setCurrentTab('budget')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'budget' 
                ? 'text-amber-400 font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter size={17} />
            <span>Budget & Split Ledger</span>
            {currentTab === 'budget' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('charts')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'charts' 
                ? 'text-amber-400 font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ChartIcon size={17} />
            <span>Visual Analytics</span>
            {currentTab === 'charts' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('itinerary')}
            className={`py-2 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'itinerary' 
                ? 'text-amber-400 font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar size={17} />
            <span>Ceremony Itinerary</span>
            {currentTab === 'itinerary' && (
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
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

        {/* Tab 1: Expense Table */}
        {currentTab === 'budget' && (
          <ExpenseTable
            expenses={expenses}
            groomGuestCount={settings.groomGuestCount}
            brideGuestCount={settings.brideGuestCount}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddNewExpense={handleAddNewExpense}
            sideFilter={activeSide}
          />
        )}

        {/* Tab 2: Visual Charts */}
        {currentTab === 'charts' && (
          <BudgetCharts
            expenses={expenses}
            groomGuestCount={settings.groomGuestCount}
            brideGuestCount={settings.brideGuestCount}
          />
        )}

        {/* Tab 3: Itinerary View */}
        {currentTab === 'itinerary' && (
          <ItineraryView expenses={expenses} />
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
