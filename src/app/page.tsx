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
  Share2,
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

const STORAGE_KEY_SETTINGS = 'shaadi_planner_settings_v2';
const STORAGE_KEY_EXPENSES = 'shaadi_planner_expenses_v2';

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
    if (confirm('Reset all expenses back to the initial start phase? All advances will reset to 0.')) {
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
      colors: ['#DC2626', '#D97706', '#F59E0B', '#E11D48', '#047857']
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
    <div className="min-h-screen text-stone-900 pb-20 font-sans selection:bg-amber-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-amber-200 text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Auspicious Red & Gold Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-red-800 via-red-900 to-amber-900 text-white border-b-2 border-amber-400/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Wedding Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-500 flex items-center justify-center text-red-900 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-amber-300"
              title="Click for celebratory flower shower!"
            >
              <Crown size={22} className="fill-amber-600 text-amber-900" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-amber-100 flex items-center gap-1.5">
                  ShaadiPlanner
                  <span className="text-amber-400 text-sm">✨</span>
                </h1>
                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  शुभ विवाह
                </span>
                
                {/* LocalStorage Live Sync Status Badge */}
                <div 
                  className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full"
                  title="Auto-saved to your browser local storage. Safe on page refresh."
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Auto-saved locally</span>
                </div>
              </div>
              <p className="text-xs text-amber-200/90 font-medium truncate max-w-xs sm:max-w-md">
                {settings.coupleTitle} • 🗓️ {settings.weddingDate}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 border border-amber-400 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <SettingsIcon size={14} />
              <span className="hidden sm:inline">Guest Ratios & Budget</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-amber-100 bg-red-950/60 hover:bg-red-950 border border-amber-400/30 rounded-xl transition-all cursor-pointer"
              title="Export directly to Google Sheets CSV"
            >
              <FileSpreadsheet size={14} className="text-amber-300" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* Reset to Start Phase Button */}
            <button
              onClick={handleResetToStartPhase}
              className="p-2 text-amber-200/80 hover:text-white hover:bg-red-950/70 rounded-xl transition-colors cursor-pointer"
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
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer ${
                userLoggedIn 
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-white text-red-950 hover:bg-amber-100'
              }`}
            >
              <LogIn size={14} />
              <span>{userLoggedIn ? 'Google Connected' : 'Google Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Hero Visual Graphics Banner */}
        <WeddingHeroBanner
          settings={settings}
          totalActual={summary.totalActual}
          totalPaid={summary.totalPaid}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onCelebration={triggerCelebration}
        />

        {/* Shahi Barat Interactive Animal Celebration Troupe Section */}
        <AnimalCelebrationSection />

        {/* Navigation Tabs with Golden Accent */}
        <div className="flex border-2 border-amber-200/80 gap-6 text-sm font-bold bg-white/80 backdrop-blur-xs px-5 py-1.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setCurrentTab('budget')}
            className={`py-2.5 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'budget' 
                ? 'text-red-700 font-black' 
                : 'text-stone-600 hover:text-red-800'
            }`}
          >
            <ListFilter size={17} />
            <span>Budget & Split Ledger</span>
            {currentTab === 'budget' && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-1 bg-red-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('charts')}
            className={`py-2.5 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'charts' 
                ? 'text-red-700 font-black' 
                : 'text-stone-600 hover:text-red-800'
            }`}
          >
            <ChartIcon size={17} />
            <span>Visual Analytics</span>
            {currentTab === 'charts' && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-1 bg-red-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('itinerary')}
            className={`py-2.5 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'itinerary' 
                ? 'text-red-700 font-black' 
                : 'text-stone-600 hover:text-red-800'
            }`}
          >
            <Calendar size={17} />
            <span>Ceremony Itinerary</span>
            {currentTab === 'itinerary' && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-1 bg-red-600 rounded-full" />
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
