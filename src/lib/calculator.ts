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
  globalBrideGuestCount: number,
  eventGuestCounts?: Record<string, { groom: number; bride: number; perPlateRate?: number }>
): { 
  groomDue: number; 
  brideDue: number; 
  groomPercent: number; 
  bridePercent: number;
  effectiveGroomGuests: number;
  effectiveBrideGuests: number;
  isCustomOccasionGuests: boolean;
  effectiveTotalCost: number;
  effectivePlateRate: number;
} {
  const totalCost = item.actualCost || item.estimatedCost || 0;
  
  // 1. Check if item has manual override
  const hasItemOverride = Boolean(
    item.overrideGuestCount && 
    (item.eventGroomGuests !== undefined || item.eventBrideGuests !== undefined)
  );

  // 2. Check if event has a top-level synced occasion guest count
  const eventConfig = eventGuestCounts && item.event ? eventGuestCounts[item.event] : undefined;

  let effectiveGroomGuests = globalGroomGuestCount;
  let effectiveBrideGuests = globalBrideGuestCount;
  let isCustomOccasionGuests = false;

  if (hasItemOverride) {
    effectiveGroomGuests = item.eventGroomGuests !== undefined ? item.eventGroomGuests : globalGroomGuestCount;
    effectiveBrideGuests = item.eventBrideGuests !== undefined ? item.eventBrideGuests : globalBrideGuestCount;
    isCustomOccasionGuests = true;
  } else if (eventConfig) {
    effectiveGroomGuests = eventConfig.groom;
    effectiveBrideGuests = eventConfig.bride;
    isCustomOccasionGuests = true;
  }

  const totalGuests = (effectiveGroomGuests + effectiveBrideGuests) || 1;

  // 3. Dynamic Calculation: Only items explicitly marked isPerPlateCalculation use guest count multiplication
  const effectivePlateRate = item.ratePerGuestOrPlate || 0;

  // If item has subtasks with positive cost values and is not a per-plate calculation,
  // derive the total cost directly from the sum of its subtasks.
  const subtasksTotal = item.subtasks && item.subtasks.length > 0
    ? item.subtasks.reduce((sum, st) => sum + (Number(st.cost) || 0), 0)
    : 0;

  let effectiveTotalCost = totalCost;
  if (item.isPerPlateCalculation && effectivePlateRate > 0) {
    effectiveTotalCost = totalGuests * effectivePlateRate;
  } else if (subtasksTotal > 0) {
    effectiveTotalCost = subtasksTotal;
  }

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
      if (item.customGroomCost !== undefined) {
        const groomDueExact = item.customGroomCost;
        const brideDueExact = item.customBrideCost !== undefined ? item.customBrideCost : Math.max(0, effectiveTotalCost - groomDueExact);
        const actualTotal = effectiveTotalCost || (groomDueExact + brideDueExact) || 1;
        return {
          groomDue: groomDueExact,
          brideDue: brideDueExact,
          groomPercent: Math.round((groomDueExact / actualTotal) * 100),
          bridePercent: Math.round((brideDueExact / actualTotal) * 100),
          effectiveGroomGuests,
          effectiveBrideGuests,
          isCustomOccasionGuests,
          effectiveTotalCost: groomDueExact + brideDueExact,
          effectivePlateRate,
        };
      }
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

  const groomDue = Math.round(effectiveTotalCost * groomPct);
  const brideDue = effectiveTotalCost - groomDue; // ensure exact rupee match

  return {
    groomDue,
    brideDue,
    groomPercent: Math.round(groomPct * 100),
    bridePercent: Math.round(bridePct * 100),
    effectiveGroomGuests,
    effectiveBrideGuests,
    isCustomOccasionGuests,
    effectiveTotalCost,
    effectivePlateRate,
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
    const { groomDue, brideDue, effectiveTotalCost } = computeExpenseShares(
      item,
      settings.groomGuestCount,
      settings.brideGuestCount,
      settings.eventGuestCounts
    );

    totalEstimated += item.estimatedCost || 0;
    totalActual += effectiveTotalCost;
    totalPaid += item.paidAmount || 0;

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
