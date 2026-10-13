/*
# FoodLink Platform Schema

Creates the complete database foundation for FoodLink, a food redistribution platform.

## Tables
- **profiles**: User profiles extending auth.users. Stores name, contact, role (donor/ngo/admin), location, verification status, and NGO-specific fields (organization_name, registration_number, etc.)
- **donations**: Food donations created by donors. Tracks food details, pickup window, location, and status lifecycle (AVAILABLE → CLAIMED → PICKED_UP, or EXPIRED/CANCELLED).
- **claims**: Audit trail of donation claims by NGOs, with claimed_at and picked_up_at timestamps.
- **notifications**: In-app notifications for donors, NGOs, and admins.

## Security Functions (SECURITY DEFINER)
- **current_user_role()**: Returns the authenticated user's role from profiles (bypasses RLS).
- **claim_donation(uuid)**: Atomically claims a donation for a verified NGO. Prevents double-claiming.
- **mark_picked_up(uuid)**: Marks a claimed donation as picked up by the claiming NGO.
- **handle_new_user()**: Trigger that auto-creates a profile row when a new auth user signs up.

## RLS Policies
- profiles: users read/update own profile; admins read/update all profiles.
- donations: donors manage own; NGOs read available + own claimed; admins read/update all.
- claims: NGOs read own claims; donors read claims on their donations; admins read all.
- notifications: users read/mark-read their own notifications.

## Indexes
- donations: donor_id, status, city, category, claimed_by, created_at
- notifications: user_id, is_read
- profiles: role, verification_status, city
*/

-- ============ PROFILES TABLE ============
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'donor' CHECK (role IN ('donor', 'ngo', 'admin')),
  profile_image text,
  address text,
  city text,
  state text,
  pincode text,
  latitude double precision,
  longitude double precision,
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  -- NGO-specific fields
  organization_name text,
  registration_number text,
  organization_type text,
  verification_documents jsonb DEFAULT '[]'::jsonb,
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  service_area text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()), 'anon')
$$;

-- Profiles RLS
DROP POLICY IF EXISTS "select_own_or_admin_profiles" ON public.profiles;
CREATE POLICY "select_own_or_admin_profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_or_admin_profile" ON public.profiles;
CREATE POLICY "update_own_or_admin_profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.current_user_role() = 'admin')
  WITH CHECK (auth.uid() = id OR public.current_user_role() = 'admin');

-- ============ DONATIONS TABLE ============
CREATE TABLE IF NOT EXISTS public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('Cooked Meals', 'Packaged Food', 'Bakery', 'Fruits', 'Vegetables', 'Groceries', 'Beverages', 'Other')),
  description text,
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit text NOT NULL,
  servings integer NOT NULL CHECK (servings > 0),
  food_type text,
  is_vegetarian boolean DEFAULT true,
  preparation_date timestamptz,
  expiry_date timestamptz NOT NULL,
  pickup_start timestamptz NOT NULL,
  pickup_end timestamptz NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  latitude double precision,
  longitude double precision,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  instructions text,
  image text,
  status text NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'CLAIMED', 'PICKED_UP', 'EXPIRED', 'CANCELLED')),
  claimed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at timestamptz,
  picked_up_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Donations RLS
DROP POLICY IF EXISTS "select_donations" ON public.donations;
CREATE POLICY "select_donations" ON public.donations
  FOR SELECT TO authenticated
  USING (
    auth.uid() = donor_id
    OR auth.uid() = claimed_by
    OR status = 'AVAILABLE'
    OR public.current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "insert_donations" ON public.donations;
CREATE POLICY "insert_donations" ON public.donations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = donor_id AND public.current_user_role() IN ('donor', 'admin'));

DROP POLICY IF EXISTS "update_donations" ON public.donations;
CREATE POLICY "update_donations" ON public.donations
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = donor_id
    OR public.current_user_role() = 'admin'
  )
  WITH CHECK (
    auth.uid() = donor_id
    OR public.current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "delete_donations" ON public.donations;
CREATE POLICY "delete_donations" ON public.donations
  FOR DELETE TO authenticated
  USING (
    auth.uid() = donor_id
    OR public.current_user_role() = 'admin'
  );

-- ============ CLAIMS TABLE ============
CREATE TABLE IF NOT EXISTS public.claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  ngo_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'CLAIMED' CHECK (status IN ('CLAIMED', 'PICKED_UP', 'CANCELLED')),
  claimed_at timestamptz NOT NULL DEFAULT now(),
  picked_up_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_claims" ON public.claims;
CREATE POLICY "select_claims" ON public.claims
  FOR SELECT TO authenticated
  USING (
    auth.uid() = ngo_id
    OR EXISTS (SELECT 1 FROM public.donations d WHERE d.id = claims.donation_id AND d.donor_id = auth.uid())
    OR public.current_user_role() = 'admin'
  );

-- ============ NOTIFICATIONS TABLE ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  related_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON public.notifications;
CREATE POLICY "select_own_notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON public.notifications;
CREATE POLICY "update_own_notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON public.notifications;
CREATE POLICY "insert_own_notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============ SECURITY DEFINER FUNCTIONS ============

-- Atomically claim a donation (prevents double-claim race condition)
CREATE OR REPLACE FUNCTION public.claim_donation(donation_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  donation_rec RECORD;
  ngo_rec RECORD;
BEGIN
  SELECT * INTO donation_rec FROM public.donations WHERE id = donation_uuid;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Donation not found');
  END IF;

  IF donation_rec.status != 'AVAILABLE' THEN
    RETURN jsonb_build_object('error', 'This donation is no longer available');
  END IF;

  SELECT role, is_verified, is_active, verification_status, organization_name
  INTO ngo_rec FROM public.profiles WHERE id = auth.uid();

  IF NOT FOUND OR ngo_rec.role != 'ngo' THEN
    RETURN jsonb_build_object('error', 'Only NGOs can claim donations');
  END IF;

  IF NOT ngo_rec.is_verified OR ngo_rec.verification_status != 'approved' THEN
    RETURN jsonb_build_object('error', 'Your NGO must be verified before claiming donations');
  END IF;

  IF NOT ngo_rec.is_active THEN
    RETURN jsonb_build_object('error', 'Your account is inactive');
  END IF;

  -- Atomic conditional update: only succeeds if status is still AVAILABLE
  UPDATE public.donations
  SET status = 'CLAIMED', claimed_by = auth.uid(), claimed_at = now(), updated_at = now()
  WHERE id = donation_uuid AND status = 'AVAILABLE'
  RETURNING * INTO donation_rec;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Donation was already claimed by another NGO');
  END IF;

  INSERT INTO public.claims (donation_id, ngo_id, status, claimed_at)
  VALUES (donation_uuid, auth.uid(), 'CLAIMED', now());

  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (
    donation_rec.donor_id, 'donation_claimed', 'Donation Claimed',
    COALESCE(ngo_rec.organization_name, 'An NGO') || ' has claimed your donation "' || donation_rec.title || '".',
    donation_uuid
  );

  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (
    auth.uid(), 'claim_successful', 'Claim Successful',
    'You have successfully claimed "' || donation_rec.title || '". Please coordinate pickup with the donor.',
    donation_uuid
  );

  RETURN jsonb_build_object('success', true, 'donation_id', donation_uuid);
END $$;

-- Mark a claimed donation as picked up
CREATE OR REPLACE FUNCTION public.mark_picked_up(donation_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  donation_rec RECORD;
BEGIN
  SELECT * INTO donation_rec FROM public.donations WHERE id = donation_uuid;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Donation not found');
  END IF;

  IF donation_rec.claimed_by != auth.uid() THEN
    RETURN jsonb_build_object('error', 'Only the NGO that claimed this donation can mark it as picked up');
  END IF;

  IF donation_rec.status != 'CLAIMED' THEN
    RETURN jsonb_build_object('error', 'Donation must be in CLAIMED status to mark as picked up');
  END IF;

  UPDATE public.donations
  SET status = 'PICKED_UP', picked_up_at = now(), updated_at = now()
  WHERE id = donation_uuid AND status = 'CLAIMED'
  RETURNING * INTO donation_rec;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Could not update donation status');
  END IF;

  UPDATE public.claims
  SET status = 'PICKED_UP', picked_up_at = now(), updated_at = now()
  WHERE donation_id = donation_uuid AND ngo_id = auth.uid();

  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (
    donation_rec.donor_id, 'pickup_completed', 'Pickup Completed',
    'Your donation "' || donation_rec.title || '" has been successfully picked up. Thank you for your contribution!',
    donation_uuid
  );

  RETURN jsonb_build_object('success', true, 'donation_id', donation_uuid);
END $$;

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, name, role, phone, address, city, state, pincode,
    organization_name, registration_number, organization_type, service_area
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'donor'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'state', ''),
    COALESCE(NEW.raw_user_meta_data->>'pincode', ''),
    COALESCE(NEW.raw_user_meta_data->>'organizationName', ''),
    COALESCE(NEW.raw_user_meta_data->>'registrationNumber', ''),
    COALESCE(NEW.raw_user_meta_data->>'organizationType', ''),
    COALESCE(NEW.raw_user_meta_data->>'serviceArea', '')
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_city ON public.donations(city);
CREATE INDEX IF NOT EXISTS idx_donations_category ON public.donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_claimed_by ON public.donations(claimed_by);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON public.profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_claims_ngo_id ON public.claims(ngo_id);
CREATE INDEX IF NOT EXISTS idx_claims_donation_id ON public.claims(donation_id);
