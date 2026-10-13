import { supabase } from '@/lib/supabase';
import type { Donation, DonationFormData, Notification, Profile, Claim } from '@/types';

// ============ DONATIONS ============

export async function createDonation(data: DonationFormData, donorId: string): Promise<Donation | null> {
  const { data: result, error } = await supabase
    .from('donations')
    .insert({
      donor_id: donorId,
      title: data.title,
      category: data.category,
      description: data.description || null,
      quantity: data.quantity,
      unit: data.unit,
      servings: data.servings,
      food_type: data.food_type || null,
      is_vegetarian: data.is_vegetarian,
      preparation_date: data.preparation_date || null,
      expiry_date: data.expiry_date,
      pickup_start: data.pickup_start,
      pickup_end: data.pickup_end,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      instructions: data.instructions || null,
      status: 'AVAILABLE',
    })
    .select('*')
    .single();
  if (error) throw error;
  return result as Donation;
}

export async function updateDonation(id: string, data: Partial<DonationFormData>): Promise<Donation | null> {
  const { data: result, error } = await supabase
    .from('donations')
    .update({
      title: data.title,
      category: data.category,
      description: data.description || null,
      quantity: data.quantity,
      unit: data.unit,
      servings: data.servings,
      food_type: data.food_type || null,
      is_vegetarian: data.is_vegetarian,
      preparation_date: data.preparation_date || null,
      expiry_date: data.expiry_date,
      pickup_start: data.pickup_start,
      pickup_end: data.pickup_end,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      instructions: data.instructions || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return result as Donation;
}

export async function cancelDonation(id: string): Promise<void> {
  const { error } = await supabase
    .from('donations')
    .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function getDonationById(id: string): Promise<Donation | null> {
  const { data, error } = await supabase
    .from('donations')
    .select(`*, donor:profiles!donations_donor_id_fkey(*), claimer:profiles!donations_claimed_by_fkey(*)`)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Donation | null;
}

export async function getDonorDonations(donorId: string, status?: string): Promise<Donation[]> {
  let query = supabase
    .from('donations')
    .select(`*, claimer:profiles!donations_claimed_by_fkey(*)`)
    .eq('donor_id', donorId)
    .order('created_at', { ascending: false });
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Donation[]) || [];
}

export async function getAvailableDonations(filters: {
  search?: string;
  category?: string;
  city?: string;
  foodType?: string;
}): Promise<Donation[]> {
  let query = supabase
    .from('donations')
    .select(`*, donor:profiles!donations_donor_id_fkey(*)`)
    .eq('status', 'AVAILABLE')
    .order('created_at', { ascending: false });
  if (filters.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
  if (filters.city && filters.city !== 'all') query = query.eq('city', filters.city);
  if (filters.foodType === 'veg') query = query.eq('is_vegetarian', true);
  if (filters.foodType === 'nonveg') query = query.eq('is_vegetarian', false);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Donation[]) || [];
}

export async function getClaimedDonations(ngoId: string): Promise<Donation[]> {
  const { data, error } = await supabase
    .from('donations')
    .select(`*, donor:profiles!donations_donor_id_fkey(*)`)
    .eq('claimed_by', ngoId)
    .order('claimed_at', { ascending: false });
  if (error) throw error;
  return (data as Donation[]) || [];
}

export async function getAllDonations(filters: {
  search?: string;
  status?: string;
  category?: string;
  city?: string;
}): Promise<Donation[]> {
  let query = supabase
    .from('donations')
    .select(`*, donor:profiles!donations_donor_id_fkey(*), claimer:profiles!donations_claimed_by_fkey(*)`)
    .order('created_at', { ascending: false });
  if (filters.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
  if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
  if (filters.city && filters.city !== 'all') query = query.eq('city', filters.city);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Donation[]) || [];
}

// ============ CLAIMS ============

export async function claimDonation(donationId: string): Promise<{ error: string | null }> {
  const { data, error } = await supabase.rpc('claim_donation', { donation_uuid: donationId });
  if (error) return { error: error.message };
  if (data && data.error) return { error: data.error };
  return { error: null };
}

export async function markPickedUp(donationId: string): Promise<{ error: string | null }> {
  const { data, error } = await supabase.rpc('mark_picked_up', { donation_uuid: donationId });
  if (error) return { error: error.message };
  if (data && data.error) return { error: data.error };
  return { error: null };
}

export async function getClaimsByNgo(ngoId: string): Promise<Claim[]> {
  const { data, error } = await supabase
    .from('claims')
    .select(`*, donation:donations(*, donor:profiles!donations_donor_id_fkey(*)), ngo:profiles!claims_ngo_id_fkey(*)`)
    .eq('ngo_id', ngoId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Claim[]) || [];
}

// ============ PROFILES ============

export async function updateProfile(id: string, data: Partial<Profile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function getAllProfiles(filters: { role?: string; verificationStatus?: string; search?: string }): Promise<Profile[]> {
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (filters.role && filters.role !== 'all') query = query.eq('role', filters.role);
  if (filters.verificationStatus && filters.verificationStatus !== 'all') query = query.eq('verification_status', filters.verificationStatus);
  if (filters.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,organization_name.ilike.%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Profile[]) || [];
}

export async function getPendingNgos(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'ngo')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Profile[]) || [];
}

export async function approveNgo(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ verification_status: 'approved', is_verified: true, rejection_reason: null, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  await supabase.from('notifications').insert({
    user_id: id, type: 'ngo_approved', title: 'Verification Approved',
    message: 'Your NGO has been verified! You can now claim food donations.', is_read: false,
  });
}

export async function rejectNgo(id: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ verification_status: 'rejected', is_verified: false, rejection_reason: reason, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  await supabase.from('notifications').insert({
    user_id: id, type: 'ngo_rejected', title: 'Verification Rejected',
    message: `Your NGO verification was rejected. Reason: ${reason}`, is_read: false,
  });
}

export async function toggleUserActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from('profiles').update({ is_active: active, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// ============ NOTIFICATIONS ============

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Notification[]) || [];
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
  if (error) throw error;
}
