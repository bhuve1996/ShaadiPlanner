import { supabase, isSupabaseConfigured } from './supabase';
import { 
  ExpenseItem, 
  WeddingSettings, 
  CeremonyScheduleItem, 
  FamilyShagunItem, 
  GuestGroupItem, 
  VendorDirectoryItem 
} from '@/types/wedding';

const WEDDING_ID = 'bhuvesh-harsha-wedding';

// ==========================================
// 1. FETCH ALL WEDDING DATA FROM SUPABASE
// ==========================================
export async function fetchRemoteWeddingData() {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const [settingsRes, expensesRes, schedRes, shagunRes, groupsRes, vendorsRes] = await Promise.all([
      supabase.from('weddings').select('*').eq('id', WEDDING_ID).single(),
      supabase.from('expenses').select('*').eq('wedding_id', WEDDING_ID),
      supabase.from('ceremony_schedules').select('*').eq('wedding_id', WEDDING_ID),
      supabase.from('family_shaguns').select('*').eq('wedding_id', WEDDING_ID),
      supabase.from('guest_groups').select('*').eq('wedding_id', WEDDING_ID),
      supabase.from('vendor_directory').select('*').eq('wedding_id', WEDDING_ID)
    ]);

    // Map DB column conventions to camelCase TypeScript interfaces
    let settings: WeddingSettings | null = null;
    if (settingsRes.data) {
      const s = settingsRes.data;
      settings = {
        coupleTitle: s.couple_title,
        groomName: s.groom_name,
        brideName: s.bride_name,
        weddingDate: s.wedding_date,
        groomGuestCount: s.groom_guest_count,
        brideGuestCount: s.bride_guest_count,
        totalTargetBudget: Number(s.total_target_budget),
        currency: s.currency,
        eventGuestCounts: s.event_guest_counts || {}
      };
    }

    let expenses: ExpenseItem[] | null = null;
    if (expensesRes.data && expensesRes.data.length > 0) {
      expenses = expensesRes.data.map(e => ({
        id: e.id,
        name: e.name,
        category: e.category,
        event: e.event,
        vendorName: e.vendor_name,
        vendorContactPerson: e.vendor_contact_person,
        vendorPhone: e.vendor_phone,
        internalLeadPerson: e.internal_lead_person,
        internalLeadPhone: e.internal_lead_phone,
        imageUrl: e.image_url,
        estimatedCost: Number(e.estimated_cost),
        actualCost: Number(e.actual_cost),
        paidAmount: Number(e.paid_amount),
        splitType: e.split_type,
        customGroomPercent: e.custom_groom_percent,
        payerCategory: e.payer_category,
        paidBy: e.paid_by,
        status: e.status,
        notes: e.notes,
        dueDate: e.due_date,
        isPerPlateCalculation: e.is_per_plate_calculation,
        ratePerGuestOrPlate: Number(e.rate_per_guest_or_plate || 0),
        overrideGuestCount: e.override_guest_count,
        eventGroomGuests: e.event_groom_guests,
        eventBrideGuests: e.event_bride_guests,
        subtasks: e.subtasks || []
      }));
    }

    let schedule: CeremonyScheduleItem[] | null = null;
    if (schedRes.data && schedRes.data.length > 0) {
      schedule = schedRes.data.map(s => ({
        id: s.id,
        title: s.title,
        date: s.date,
        startTime: s.start_time,
        endTime: s.end_time,
        venue: s.venue,
        emoji: s.emoji,
        image: s.image,
        description: s.description,
        tagColor: s.tag_color,
        guestCount: s.guest_count
      }));
    }

    let shagunList: FamilyShagunItem[] | null = null;
    if (shagunRes.data && shagunRes.data.length > 0) {
      shagunList = shagunRes.data.map(sh => ({
        id: sh.id,
        recipientName: sh.recipient_name,
        relation: sh.relation,
        group: sh.shagun_group,
        amount: Number(sh.amount),
        calculationFormula: sh.calculation_formula,
        status: sh.status,
        notes: sh.notes,
        side: sh.side
      }));
    }

    let guestGroups: GuestGroupItem[] | null = null;
    if (groupsRes.data && groupsRes.data.length > 0) {
      guestGroups = groupsRes.data.map(g => {
        // Try parsing optional JSON metadata stored in notes
        let meta: any = {};
        let cleanNotes = g.notes || '';
        if (cleanNotes.includes('<!--GUEST_META:')) {
          try {
            const rawMeta = cleanNotes.split('<!--GUEST_META:')[1].split('-->')[0];
            meta = JSON.parse(rawMeta);
            cleanNotes = cleanNotes.replace(/<!--GUEST_META:.*?-->/g, '').trim();
          } catch {}
        }

        return {
          id: g.id,
          name: g.name,
          side: g.side,
          count: g.count,
          estimatedPerPlate: g.estimated_per_plate ? Number(g.estimated_per_plate) : undefined,
          contactPerson: g.contact_person,
          contactPhone: g.contact_phone,
          isAnonymousNumbers: g.is_anonymous_numbers,
          relation: meta.relation,
          shagunAmount: meta.shagunAmount ? Number(meta.shagunAmount) : undefined,
          shagunCeremony: meta.shagunCeremony,
          shagunStatus: meta.shagunStatus,
          guestType: meta.guestType,
          plusCount: meta.plusCount ? Number(meta.plusCount) : undefined,
          relationCategory: meta.relationCategory,
          rsvpStatus: meta.rsvpStatus,
          city: meta.city,
          notes: cleanNotes
        };
      });
    }

    let vendors: VendorDirectoryItem[] | null = null;
    if (vendorsRes.data && vendorsRes.data.length > 0) {
      // Exclude internal system rows like 'system-sync-activity-logs' from public vendor directory
      vendors = vendorsRes.data
        .filter(v => v.id !== 'system-sync-activity-logs')
        .map(v => ({
          id: v.id,
          category: v.category,
          vendorBusinessName: v.vendor_business_name,
          contactPerson: v.contact_person,
          phone: v.phone,
          alternatePhone: v.alternate_phone,
          locationCity: v.location_city,
          internalResponsiblePerson: v.internal_responsible_person,
          serviceDescription: v.service_description,
          status: v.status,
          totalAgreedAmount: v.total_agreed_amount ? Number(v.total_agreed_amount) : undefined
        }));
    }

    return { settings, expenses, schedule, shagunList, guestGroups, vendors };
  } catch (err) {
    console.warn('Supabase fetch error, fallback to local:', err);
    return null;
  }
}

// ==========================================
// 2. SYNC SETTINGS TO SUPABASE
// ==========================================
export async function syncSettingsToRemote(s: WeddingSettings) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from('weddings').upsert({
      id: WEDDING_ID,
      couple_title: s.coupleTitle,
      groom_name: s.groomName,
      bride_name: s.brideName,
      wedding_date: s.weddingDate,
      groom_guest_count: s.groomGuestCount,
      bride_guest_count: s.brideGuestCount,
      total_target_budget: s.totalTargetBudget,
      currency: s.currency,
      event_guest_counts: s.eventGuestCounts || {},
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.error('Remote settings sync error:', e);
  }
}

// ==========================================
// 3. SYNC EXPENSES TO SUPABASE
// ==========================================
export async function syncExpenseToRemote(item: ExpenseItem) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from('expenses').upsert({
      id: item.id,
      wedding_id: WEDDING_ID,
      name: item.name,
      category: item.category,
      event: item.event,
      vendor_name: item.vendorName || '',
      vendor_contact_person: item.vendorContactPerson || '',
      vendor_phone: item.vendorPhone || '',
      internal_lead_person: item.internalLeadPerson || '',
      internal_lead_phone: item.internalLeadPhone || '',
      image_url: item.imageUrl || '',
      estimated_cost: item.estimatedCost || 0,
      actual_cost: item.actualCost || 0,
      paid_amount: item.paidAmount || 0,
      split_type: item.splitType,
      custom_groom_percent: item.customGroomPercent || 50,
      payer_category: item.payerCategory || 'COUPLE',
      paid_by: item.paidBy || 'UNPAID',
      status: item.status || 'Estimated',
      notes: item.notes || '',
      due_date: item.dueDate || '',
      is_per_plate_calculation: item.isPerPlateCalculation ?? false,
      rate_per_guest_or_plate: item.ratePerGuestOrPlate || 0,
      override_guest_count: item.overrideGuestCount ?? false,
      event_groom_guests: item.eventGroomGuests,
      event_bride_guests: item.eventBrideGuests,
      subtasks: item.subtasks || [],
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.error('Remote expense sync error:', e);
  }
}

export async function deleteExpenseFromRemote(id: string) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from('expenses').delete().eq('id', id);
  } catch (e) {
    console.error('Remote expense delete error:', e);
  }
}

// ==========================================
// 4. SYNC GUEST GROUPS & INDIVIDUALS TO SUPABASE
// ==========================================
export async function syncGuestGroupToRemote(item: GuestGroupItem) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    // Pack extra guest fields into safe metadata comment inside notes
    const meta: any = {};
    if (item.relation) meta.relation = item.relation;
    if (item.shagunAmount) meta.shagunAmount = item.shagunAmount;
    if (item.shagunCeremony) meta.shagunCeremony = item.shagunCeremony;
    if (item.shagunStatus) meta.shagunStatus = item.shagunStatus;
    if (item.guestType) meta.guestType = item.guestType;
    if (item.plusCount) meta.plusCount = item.plusCount;
    if (item.relationCategory) meta.relationCategory = item.relationCategory;
    if (item.rsvpStatus) meta.rsvpStatus = item.rsvpStatus;
    if (item.city) meta.city = item.city;

    let cleanNotes = (item.notes || '').replace(/<!--GUEST_META:.*?-->/g, '').trim();
    if (Object.keys(meta).length > 0) {
      cleanNotes = `${cleanNotes} <!--GUEST_META:${JSON.stringify(meta)}-->`.trim();
    }

    await supabase.from('guest_groups').upsert({
      id: item.id,
      wedding_id: WEDDING_ID,
      name: item.name,
      side: item.side,
      count: item.count,
      estimated_per_plate: item.estimatedPerPlate || null,
      contact_person: item.contactPerson || '',
      contact_phone: item.contactPhone || '',
      is_anonymous_numbers: Boolean(item.isAnonymousNumbers),
      notes: cleanNotes,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.error('Remote guest sync error:', e);
  }
}

export async function deleteGuestGroupFromRemote(id: string) {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.from('guest_groups').delete().eq('id', id);
  } catch (e) {
    console.error('Remote guest delete error:', e);
  }
}

// ==========================================
// 5. REAL-TIME SUBSCRIPTION TO ALL TABLES
// ==========================================
export function subscribeToRemoteChanges(onRemoteUpdate: () => void) {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  const channel = supabase
    .channel('wedding-realtime-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'weddings' }, (payload) => {
      console.log('Real-time wedding change detected:', payload);
      onRemoteUpdate();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, (payload) => {
      console.log('Real-time expense change detected:', payload);
      onRemoteUpdate();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ceremony_schedules' }, (payload) => {
      console.log('Real-time schedule change detected:', payload);
      onRemoteUpdate();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'family_shaguns' }, (payload) => {
      console.log('Real-time shagun change detected:', payload);
      onRemoteUpdate();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_groups' }, (payload) => {
      console.log('Real-time group change detected:', payload);
      onRemoteUpdate();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_directory' }, (payload) => {
      console.log('Real-time vendor change detected:', payload);
      onRemoteUpdate();
    })
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}
export async function seedInitialDataIfEmpty(
  initialSettings: WeddingSettings,
  initialExpenses: ExpenseItem[],
  initialSchedule: CeremonyScheduleItem[],
  initialShagun: FamilyShagunItem[],
  initialGroups: GuestGroupItem[],
  initialVendors: VendorDirectoryItem[]
) {
  if (!isSupabaseConfigured() || !supabase) return;

  try {
    const { data } = await supabase.from('weddings').select('id').eq('id', WEDDING_ID);
    if (!data || data.length === 0) {
      console.log('Seeding Supabase with initial wedding data...');
      await syncSettingsToRemote(initialSettings);
      for (const exp of initialExpenses) {
        await syncExpenseToRemote(exp);
      }
    }
  } catch (e) {
    console.warn('Seeding check error:', e);
  }
}
