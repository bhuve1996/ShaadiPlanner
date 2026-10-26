import { ExpenseItem, WeddingSettings } from '@/types/wedding';

export interface SplitCalculation {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  totalPending: number;
  
  // Groom's side
  groomShareDue: number;
  groomSharePaid: number;
  groomSharePending: number;

  // Bride's side
  brideShareDue: number;
  brideSharePaid: number;
  brideSharePending: number;

  // Settlement reconciliation: who owes whom
  netBalance: number; // positive = Bride owes Groom, negative = Groom owes Bride
  guestRatioGroomPercent: number;
  guestRatioBridePercent: number;
}

export function computeExpenseShares(
  item: ExpenseItem,
  globalGroomGuestCount: number,
  globalBrideGuestCount: number
): { 
  groomDue: number; 
  brideDue: number; 
  groomPercent: number; 
  bridePercent: number;
  effectiveGroomGuests: number;
  effectiveBrideGuests: number;
  isCustomOccasionGuests: boolean;
} {
  const totalCost = item.actualCost || item.estimatedCost || 0;
  
  // Check if item has event-specific guest override (e.g. Sangeet has 200 guests while Wedding has 400)
  const isCustomOccasionGuests = Boolean(
    item.overrideGuestCount && 
    (item.eventGroomGuests !== undefined || item.eventBrideGuests !== undefined)
  );

  const effectiveGroomGuests = isCustomOccasionGuests && item.eventGroomGuests !== undefined
    ? item.eventGroomGuests
    : globalGroomGuestCount;

  const effectiveBrideGuests = isCustomOccasionGuests && item.eventBrideGuests !== undefined
    ? item.eventBrideGuests
    : globalBrideGuestCount;

  const totalGuests = (effectiveGroomGuests + effectiveBrideGuests) || 1;

  let groomPct = 0.5;
  let bridePct = 0.5;

  switch (item.splitType) {
    case 'GROOM_ONLY':
      groomPct = 1.0;
      bridePct = 0.0;
      break;
    case 'BRIDE_ONLY':
      groomPct = 0.0;
      bridePct = 1.0;
      break;
    case 'GUEST_RATIO':
      groomPct = effectiveGroomGuests / totalGuests;
      bridePct = effectiveBrideGuests / totalGuests;
      break;
    case 'CUSTOM':
      const customG = (item.customGroomPercent ?? 50) / 100;
      groomPct = customG;
      bridePct = 1.0 - customG;
      break;
    case 'EQUAL_50_50':
    default:
      groomPct = 0.5;
      bridePct = 0.5;
      break;
  }

  const groomDue = Math.round(totalCost * groomPct);
  const brideDue = totalCost - groomDue; // ensure exact rupee match

  return {
    groomDue,
    brideDue,
    groomPercent: Math.round(groomPct * 100),
    bridePercent: Math.round(bridePct * 100),
    effectiveGroomGuests,
    effectiveBrideGuests,
    isCustomOccasionGuests,
  };
}

export function calculateSummary(
  expenses: ExpenseItem[],
  settings: WeddingSettings
): SplitCalculation {
  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;

  let groomShareDue = 0;
  let brideShareDue = 0;

  let groomActualPaidCash = 0;
  let brideActualPaidCash = 0;

  const totalGuests = (settings.groomGuestCount + settings.brideGuestCount) || 1;
  const guestRatioGroomPercent = Math.round((settings.groomGuestCount / totalGuests) * 100);
  const guestRatioBridePercent = 100 - guestRatioGroomPercent;

  expenses.forEach(item => {
    const cost = item.actualCost || item.estimatedCost || 0;
    totalEstimated += item.estimatedCost || 0;
    totalActual += cost;
    totalPaid += item.paidAmount || 0;

    const { groomDue, brideDue } = computeExpenseShares(
      item,
      settings.groomGuestCount,
      settings.brideGuestCount
    );

    groomShareDue += groomDue;
    brideShareDue += brideDue;

    // Track who physically paid
    const paid = item.paidAmount || 0;
    if (item.paidBy === 'GROOM') {
      groomActualPaidCash += paid;
    } else if (item.paidBy === 'BRIDE') {
      brideActualPaidCash += paid;
    } else if (item.paidBy === 'SHARED') {
      groomActualPaidCash += Math.round(paid * 0.5);
      brideActualPaidCash += paid - Math.round(paid * 0.5);
    }
  });

  const totalPending = Math.max(0, totalActual - totalPaid);
  const groomSharePending = Math.max(0, groomShareDue - groomActualPaidCash);
  const brideSharePending = Math.max(0, brideShareDue - brideActualPaidCash);

  const netBalance = groomActualPaidCash - groomShareDue;

  return {
    totalEstimated,
    totalActual,
    totalPaid,
    totalPending,
    groomShareDue,
    groomSharePaid: groomActualPaidCash,
    groomSharePending,
    brideShareDue,
    brideSharePaid: brideActualPaidCash,
    brideSharePending,
    netBalance,
    guestRatioGroomPercent,
    guestRatioBridePercent,
  };
}
