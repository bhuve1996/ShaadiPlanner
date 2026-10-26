'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Calendar, 
  PieChart as ChartIcon, 
  ListFilter, 
  Share2,
  LogIn,
  Heart
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

  // Load from LocalStorage if available
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

  // Save to LocalStorage
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
  };

  const handleDeleteExpense = (id: string) => {
    const updatedList = expenses.filter(item => item.id !== id);
    setExpenses(updatedList);
    persistChanges(updatedList, settings);
  };

  const handleAddNewExpense = (created: ExpenseItem) => {
    const updatedList = [created, ...expenses];
    setExpenses(updatedList);
    persistChanges(updatedList, settings);
  };

  const handleSaveSettings = (newSettings: WeddingSettings) => {
    setSettings(newSettings);
    persistChanges(expenses, newSettings);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const summary = calculateSummary(expenses, settings);

  // Export as CSV (Google Sheets compatible)
  const handleExportCSV = () => {
    const headers = [
      'ID', 'Item Name', 'Category', 'Event', 'Vendor', 
      'Estimated Cost', 'Actual Cost', 'Paid Amount', 
      'Split Type', 'Groom Share', 'Bride Share', 'Paid By', 'Status', 'Notes'
    ];
    
    const rows = expenses.map(item => {
      return [
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
        `"${(item.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShaadiPlanner_${settings.coupleTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-900 pb-16 font-sans">
      {/* Top Luxury Banner / Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div 
              onClick={triggerCelebration}
              className="cursor-pointer w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform"
              title="Click for celebratory shower!"
            >
              <Heart size={20} className="fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900">
                  ShaadiPlanner
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Royal Edition
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate max-w-xs sm:max-w-md">
                {settings.coupleTitle} • {settings.weddingDate}
              </p>
            </div>
          </div>

          {/* Right Action buttons: Split setup & Google Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors"
            >
              <SettingsIcon size={14} className="text-stone-600" />
              <span className="hidden sm:inline">Guest Ratios & Budget</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors"
              title="Export to Google Sheets CSV"
            >
              <Download size={14} />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* Google Sign-in Simulation */}
            <button
              onClick={() => setUserLoggedIn(!userLoggedIn)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                userLoggedIn 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              <LogIn size={14} />
              <span>{userLoggedIn ? 'Connected (Google)' : 'Connect Google'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
          <button
            onClick={() => setCurrentTab('budget')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              currentTab === 'budget' 
                ? 'text-amber-700 font-bold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ListFilter size={16} />
            <span>Budget & Split Ledger</span>
            {currentTab === 'budget' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('charts')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              currentTab === 'charts' 
                ? 'text-amber-700 font-bold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ChartIcon size={16} />
            <span>Visual Analytics & Categories</span>
            {currentTab === 'charts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('itinerary')}
            className={`pb-3 transition-colors relative flex items-center gap-2 ${
              currentTab === 'itinerary' 
                ? 'text-amber-700 font-bold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar size={16} />
            <span>Ceremony Timeline</span>
            {currentTab === 'itinerary' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Consolidated KPIs & Filter Switcher */}
        <DashboardStats
          summary={summary}
          settings={settings}
          activeSide={activeSide}
          onSideChange={setActiveSide}
        />

        {/* Tab 1: Detailed Expense & Split Table */}
        {currentTab === 'budget' && (
          <div className="space-y-6">
            <ExpenseTable
              expenses={expenses}
              groomGuestCount={settings.groomGuestCount}
              brideGuestCount={settings.brideGuestCount}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              onAddNewExpense={handleAddNewExpense}
              sideFilter={activeSide}
            />
          </div>
        )}

        {/* Tab 2: Visual Charts & Analytics */}
        {currentTab === 'charts' && (
          <div className="space-y-6">
            <BudgetCharts
              expenses={expenses}
              groomGuestCount={settings.groomGuestCount}
              brideGuestCount={settings.brideGuestCount}
            />
          </div>
        )}

        {/* Tab 3: Itinerary View */}
        {currentTab === 'itinerary' && (
          <ItineraryView expenses={expenses} />
        )}
      </main>

      {/* Guest Count & Ratio Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
