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
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_EXPENSES, INITIAL_SETTINGS } from '@/lib/mock-data';
import { ExpenseItem, WeddingSettings } from '@/types/wedding';
import { calculateSummary } from '@/lib/calculator';
import { DashboardStats } from '@/components/DashboardStats';
import { BudgetCharts } from '@/components/BudgetCharts';
import { ExpenseTable } from '@/components/ExpenseTable';
import { SettingsModal } from '@/components/SettingsModal';
import { ItineraryView } from '@/components/ItineraryView';
import confetti from 'canvas-confetti';

export default function Home() {
  const [settings, setSettings] = useState<WeddingSettings>(INITIAL_SETTINGS);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [activeSide, setActiveSide] = useState<'ALL' | 'GROOM' | 'BRIDE'>('ALL');
  const [currentTab, setCurrentTab] = useState<'budget' | 'charts' | 'itinerary'>('budget');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('shaadi_settings');
      const savedExpenses = localStorage.getItem('shaadi_expenses');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const persistChanges = (newExpenses: ExpenseItem[], newSettings: WeddingSettings) => {
    try {
      localStorage.setItem('shaadi_settings', JSON.stringify(newSettings));
      localStorage.setItem('shaadi_expenses', JSON.stringify(newExpenses));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateExpense = (updated: ExpenseItem) => {
    const updatedList = expenses.map(item => item.id === updated.id ? updated : item);
    setExpenses(updatedList);
    persistChanges(updatedList, settings);
    showToast(`Updated "${updated.name}"`);
  };

  const handleDeleteExpense = (id: string) => {
    const itemToDelete = expenses.find(x => x.id === id);
    const updatedList = expenses.filter(item => item.id !== id);
    setExpenses(updatedList);
    persistChanges(updatedList, settings);
    showToast(`Deleted ${itemToDelete?.name || 'expense'}`);
  };

  const handleAddNewExpense = (created: ExpenseItem) => {
    const updatedList = [created, ...expenses];
    setExpenses(updatedList);
    persistChanges(updatedList, settings);
    showToast(`Added "${created.name}"`);
    triggerCelebration();
  };

  const handleSaveSettings = (newSettings: WeddingSettings) => {
    setSettings(newSettings);
    persistChanges(expenses, newSettings);
    showToast('Updated guest count & budget ratios');
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const summary = calculateSummary(expenses, settings);

  // Export as Google Sheets / Excel compatible CSV
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
    showToast('Exported CSV for Google Sheets & Excel');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-20 font-sans selection:bg-amber-100">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Wedding Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Click to celebrate!"
            >
              <Heart size={20} className="fill-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900">
                  ShaadiPlanner
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Royal Edition
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium truncate max-w-xs sm:max-w-md">
                {settings.coupleTitle} • {settings.weddingDate}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <SettingsIcon size={14} className="text-stone-600" />
              <span className="hidden sm:inline">Guest Ratios & Budget</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Export directly to Google Sheets CSV"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* Google Sign-in */}
            <button
              onClick={() => {
                setUserLoggedIn(!userLoggedIn);
                showToast(userLoggedIn ? 'Logged out' : 'Connected with Google Account');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer ${
                userLoggedIn 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              <LogIn size={14} />
              <span>{userLoggedIn ? 'Google Connected' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-6 text-sm font-bold">
          <button
            onClick={() => setCurrentTab('budget')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'budget' 
                ? 'text-amber-700 font-extrabold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ListFilter size={17} />
            <span>Budget & Split Ledger</span>
            {currentTab === 'budget' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('charts')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'charts' 
                ? 'text-amber-700 font-extrabold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ChartIcon size={17} />
            <span>Visual Analytics</span>
            {currentTab === 'charts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('itinerary')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              currentTab === 'itinerary' 
                ? 'text-amber-700 font-extrabold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar size={17} />
            <span>Ceremony Itinerary</span>
            {currentTab === 'itinerary' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
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
