export type UserRole = 'donor' | 'ngo' | 'admin';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type DonationStatus = 'AVAILABLE' | 'CLAIMED' | 'PICKED_UP' | 'EXPIRED' | 'CANCELLED';

export type ClaimStatus = 'CLAIMED' | 'PICKED_UP' | 'CANCELLED';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  profile_image: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean;
  is_active: boolean;
  organization_name: string | null;
  registration_number: string | null;
  organization_type: string | null;
  verification_documents: string[];
  verification_status: VerificationStatus;
  rejection_reason: string | null;
  service_area: string | null;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  title: string;
  category: string;
  description: string | null;
  quantity: number;
  unit: string;
  servings: number;
  food_type: string | null;
  is_vegetarian: boolean;
  preparation_date: string | null;
  expiry_date: string;
  pickup_start: string;
  pickup_end: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  contact_name: string;
  contact_phone: string;
  instructions: string | null;
  image: string | null;
  status: DonationStatus;
  claimed_by: string | null;
  claimed_at: string | null;
  picked_up_at: string | null;
  created_at: string;
  updated_at: string;
  donor?: Profile;
  claimer?: Profile;
}

export interface Claim {
  id: string;
  donation_id: string;
  ngo_id: string;
  status: ClaimStatus;
  claimed_at: string;
  picked_up_at: string | null;
  created_at: string;
  updated_at: string;
  donation?: Donation;
  ngo?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
}

export interface DonationFormData {
  title: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  servings: number;
  food_type: string;
  is_vegetarian: boolean;
  preparation_date: string;
  expiry_date: string;
  pickup_start: string;
  pickup_end: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  contact_name: string;
  contact_phone: string;
  instructions: string;
}

export const FOOD_CATEGORIES = [
  'Cooked Meals',
  'Packaged Food',
  'Bakery',
  'Fruits',
  'Vegetables',
  'Groceries',
  'Beverages',
  'Other',
] as const;

export const UNITS = ['plates', 'kg', 'boxes', 'pieces', 'loaves', 'liters', 'packets', 'crates'] as const;

export const ORGANIZATION_TYPES = ['Trust', 'Society', 'Section 8 Company', 'NGO', 'Foundation'] as const;
