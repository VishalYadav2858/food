/*
# Seed Demo Donations, Claims, and Notifications (Fixed)

Creates 10 realistic donations with correct donor IDs.
*/

-- ============ AVAILABLE DONATIONS ============
INSERT INTO public.donations (
  id, donor_id, title, category, description, quantity, unit, servings, food_type, is_vegetarian,
  preparation_date, expiry_date, pickup_start, pickup_end,
  address, city, state, pincode, latitude, longitude,
  contact_name, contact_phone, instructions, status
) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'Wedding Reception Surplus Meals',
  'Cooked Meals',
  'Large batch of freshly cooked North Indian meals from a wedding reception. Includes rice, dal, paneer curry, and rotis. All food prepared today in hygienic conditions.',
  200, 'plates', 200, 'Indian', true,
  now() - interval '4 hours',
  now() + interval '8 hours',
  now() - interval '1 hour',
  now() + interval '6 hours',
  '123 Marine Drive, Nariman Point', 'Mumbai', 'Maharashtra', '400001',
  18.9433, 72.8234,
  'Rajesh Sharma', '+919876543210',
  'Please bring insulated containers. Food is packed in standard catering boxes.',
  'AVAILABLE'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'Corporate Event Sandwiches',
  'Packaged Food',
  'Assorted vegetarian sandwiches from a corporate conference. Individually wrapped, labeled with ingredients. Never opened.',
  75, 'boxes', 150, 'Continental', true,
  now() - interval '6 hours',
  now() + interval '18 hours',
  now() - interval '2 hours',
  now() + interval '12 hours',
  'Ocean Tower, Worli', 'Mumbai', 'Maharashtra', '400018',
  18.9975, 72.8210,
  'Rajesh Sharma', '+919876543210',
  'Available at reception desk. Ask for Rajesh.',
  'AVAILABLE'
),
(
  'd0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  'Fresh Bakery Items - End of Day',
  'Bakery',
  'Fresh bread loaves, croissants, and puffs from our bakery. Baked this morning, best consumed within 24 hours.',
  50, 'pieces', 100, 'Bakery', true,
  now() - interval '12 hours',
  now() + interval '12 hours',
  now() - interval '1 hour',
  now() + interval '8 hours',
  '45 MG Road, Camp', 'Pune', 'Maharashtra', '411001',
  18.5195, 73.8553,
  'Priya Patel', '+919876543211',
  'Please collect from the back entrance of the bakery.',
  'AVAILABLE'
),
(
  'd0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000003',
  'Fresh Vegetables - Surplus Stock',
  'Vegetables',
  'Surplus fresh vegetables including tomatoes, onions, potatoes, spinach, and carrots. All produce is fresh and high quality, unsold from our grocery store.',
  30, 'kg', 60, 'Produce', true,
  now() - interval '2 hours',
  now() + interval '48 hours',
  now() - interval '1 hour',
  now() + interval '24 hours',
  '45 MG Road, Camp', 'Pune', 'Maharashtra', '411001',
  18.5195, 73.8553,
  'Priya Patel', '+919876543211',
  'Bring your own bags or crates for transport.',
  'AVAILABLE'
)
ON CONFLICT (id) DO NOTHING;

-- ============ CLAIMED DONATIONS ============
INSERT INTO public.donations (
  id, donor_id, title, category, description, quantity, unit, servings, food_type, is_vegetarian,
  preparation_date, expiry_date, pickup_start, pickup_end,
  address, city, state, pincode, latitude, longitude,
  contact_name, contact_phone, instructions, status, claimed_by, claimed_at
) VALUES
(
  'd0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000002',
  'Restaurant Dinner Buffet Leftover',
  'Cooked Meals',
  'End-of-day buffet surplus from a fine dining restaurant. Includes biryani, butter chicken, vegetable pulao, and naan. High quality, freshly prepared.',
  80, 'plates', 80, 'Indian', false,
  now() - interval '5 hours',
  now() + interval '4 hours',
  now() - interval '30 minutes',
  now() + interval '3 hours',
  'The Grand Hotel, Churchgate', 'Mumbai', 'Maharashtra', '400020',
  18.9322, 72.8192,
  'Rajesh Sharma', '+919876543210',
  'Use the staff entrance at the back. Food is in thermal containers.',
  'CLAIMED',
  'a0000000-0000-0000-0000-000000000004',
  now() - interval '20 minutes'
),
(
  'd0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000003',
  'Festival Sweets and Snacks',
  'Packaged Food',
  'Assorted Indian sweets (laddoos, barfi, jalebi) and savory snacks (samosa, kachori) from a festival celebration. All freshly made and packaged.',
  40, 'boxes', 120, 'Indian', true,
  now() - interval '8 hours',
  now() + interval '16 hours',
  now() - interval '2 hours',
  now() + interval '10 hours',
  '12 FC Road, Shivajinagar', 'Pune', 'Maharashtra', '411002',
  18.5195, 73.8553,
  'Priya Patel', '+919876543211',
  'Multiple boxes, may need a larger vehicle.',
  'CLAIMED',
  'a0000000-0000-0000-0000-000000000006',
  now() - interval '1 hour'
)
ON CONFLICT (id) DO NOTHING;

-- ============ PICKED UP (COMPLETED) DONATIONS ============
INSERT INTO public.donations (
  id, donor_id, title, category, description, quantity, unit, servings, food_type, is_vegetarian,
  preparation_date, expiry_date, pickup_start, pickup_end,
  address, city, state, pincode, latitude, longitude,
  contact_name, contact_phone, instructions, status, claimed_by, claimed_at, picked_up_at
) VALUES
(
  'd0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000002',
  'Conference Lunch Boxes',
  'Cooked Meals',
  'Veg thali lunch boxes from a tech conference. Each box contains rice, two sabzis, dal, roti, and sweet.',
  120, 'boxes', 120, 'Indian', true,
  now() - interval '3 days',
  now() - interval '2 days',
  now() - interval '3 days' + interval '1 hour',
  now() - interval '3 days' + interval '8 hours',
  'BKC Convention Center', 'Mumbai', 'Maharashtra', '400051',
  19.0640, 72.8679,
  'Rajesh Sharma', '+919876543210',
  'Picked up successfully by Hope Foundation team.',
  'PICKED_UP',
  'a0000000-0000-0000-0000-000000000004',
  now() - interval '3 days' + interval '2 hours',
  now() - interval '3 days' + interval '5 hours'
),
(
  'd0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000003',
  'Bakery Day-Old Bread',
  'Bakery',
  'Surplus bread and buns from our daily production. Still fresh and good for consumption.',
  60, 'loaves', 120, 'Bakery', true,
  now() - interval '5 days',
  now() - interval '4 days',
  now() - interval '5 days' + interval '2 hours',
  now() - interval '5 days' + interval '10 hours',
  '45 MG Road, Camp', 'Pune', 'Maharashtra', '411001',
  18.5195, 73.8553,
  'Priya Patel', '+919876543211',
  'Collected by Feed India Trust.',
  'PICKED_UP',
  'a0000000-0000-0000-0000-000000000006',
  now() - interval '5 days' + interval '3 hours',
  now() - interval '5 days' + interval '6 hours'
),
(
  'd0000000-0000-0000-0000-000000000009',
  'a0000000-0000-0000-0000-000000000002',
  'Office Party Food Surplus',
  'Cooked Meals',
  'Leftover catered food from office celebration. Mix of vegetarian and non-veg items. Pasta, salads, and main course dishes.',
  50, 'plates', 50, 'Continental', false,
  now() - interval '10 days',
  now() - interval '9 days',
  now() - interval '10 days' + interval '1 hour',
  now() - interval '10 days' + interval '6 hours',
  'One BKC Tower', 'Mumbai', 'Maharashtra', '400051',
  19.0634, 72.8669,
  'Rajesh Sharma', '+919876543210',
  'Successfully picked up by Hope Foundation.',
  'PICKED_UP',
  'a0000000-0000-0000-0000-000000000004',
  now() - interval '10 days' + interval '2 hours',
  now() - interval '10 days' + interval '4 hours'
)
ON CONFLICT (id) DO NOTHING;

-- ============ CANCELLED DONATION ============
INSERT INTO public.donations (
  id, donor_id, title, category, description, quantity, unit, servings, food_type, is_vegetarian,
  preparation_date, expiry_date, pickup_start, pickup_end,
  address, city, state, pincode, latitude, longitude,
  contact_name, contact_phone, instructions, status
) VALUES
(
  'd0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000003',
  'Birthday Party Food (Cancelled)',
  'Cooked Meals',
  'Cancelled because event was rescheduled.',
  30, 'plates', 30, 'Indian', true,
  now() - interval '7 days',
  now() - interval '6 days',
  now() - interval '7 days' + interval '2 hours',
  now() - interval '7 days' + interval '8 hours',
  '45 MG Road, Camp', 'Pune', 'Maharashtra', '411001',
  18.5195, 73.8553,
  'Priya Patel', '+919876543211',
  'Cancelled by donor.',
  'CANCELLED'
)
ON CONFLICT (id) DO NOTHING;

-- ============ CLAIM RECORDS ============
INSERT INTO public.claims (donation_id, ngo_id, status, claimed_at, picked_up_at) VALUES
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000004', 'CLAIMED', now() - interval '20 minutes', NULL),
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'CLAIMED', now() - interval '1 hour', NULL),
('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004', 'PICKED_UP', now() - interval '3 days' + interval '2 hours', now() - interval '3 days' + interval '5 hours'),
('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000006', 'PICKED_UP', now() - interval '5 days' + interval '3 hours', now() - interval '5 days' + interval '6 hours'),
('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000004', 'PICKED_UP', now() - interval '10 days' + interval '2 hours', now() - interval '10 days' + interval '4 hours')
ON CONFLICT DO NOTHING;

-- ============ NOTIFICATIONS ============
INSERT INTO public.notifications (user_id, type, title, message, is_read, related_id) VALUES
('a0000000-0000-0000-0000-000000000002', 'donation_claimed', 'Donation Claimed', 'Hope Foundation has claimed your donation "Restaurant Dinner Buffet Leftover".', false, 'd0000000-0000-0000-0000-000000000005'),
('a0000000-0000-0000-0000-000000000002', 'pickup_completed', 'Pickup Completed', 'Your donation "Conference Lunch Boxes" has been successfully picked up. Thank you!', true, 'd0000000-0000-0000-0000-000000000007'),
('a0000000-0000-0000-0000-000000000002', 'pickup_completed', 'Pickup Completed', 'Your donation "Office Party Food Surplus" has been successfully picked up. Thank you!', true, 'd0000000-0000-0000-0000-000000000009'),
('a0000000-0000-0000-0000-000000000003', 'pickup_completed', 'Pickup Completed', 'Your donation "Bakery Day-Old Bread" has been successfully picked up. Thank you!', true, 'd0000000-0000-0000-0000-000000000008'),
('a0000000-0000-0000-0000-000000000004', 'claim_successful', 'Claim Successful', 'You have successfully claimed "Restaurant Dinner Buffet Leftover". Please coordinate pickup.', false, 'd0000000-0000-0000-0000-000000000005'),
('a0000000-0000-0000-0000-000000000004', 'pickup_completed', 'Pickup Completed', 'You have successfully picked up "Conference Lunch Boxes".', true, 'd0000000-0000-0000-0000-000000000007'),
('a0000000-0000-0000-0000-000000000006', 'claim_successful', 'Claim Successful', 'You have successfully claimed "Festival Sweets and Snacks". Please coordinate pickup.', false, 'd0000000-0000-0000-0000-000000000006'),
('a0000000-0000-0000-0000-000000000006', 'pickup_completed', 'Pickup Completed', 'You have successfully picked up "Bakery Day-Old Bread".', true, 'd0000000-0000-0000-0000-000000000008'),
('a0000000-0000-0000-0000-000000000001', 'ngo_verification_pending', 'NGO Verification Pending', 'Care Initiative has submitted registration for verification.', false, 'a0000000-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;
