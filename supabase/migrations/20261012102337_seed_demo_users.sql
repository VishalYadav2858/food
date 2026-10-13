/*
# Seed Demo Users for FoodLink

Creates demo auth users with hashed passwords and their corresponding profiles.
This allows immediate testing with pre-configured accounts.

Demo credentials:
- admin@foodlink.com / Admin@123 (admin role)
- donor@foodlink.com / Donor@123 (donor role)
- ngo@foodlink.com / Ngo@123 (verified NGO)

Note: Passwords are bcrypt-hashed and inserted directly into auth.users.
The handle_new_user trigger will create profile rows, then we update them
with the correct role and NGO-specific fields.
*/

-- Insert admin user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated', 'admin@foodlink.com',
  crypt('Admin@123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"System Admin","role":"admin"}',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert donor user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated', 'donor@foodlink.com',
  crypt('Donor@123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Rajesh Sharma","role":"donor","phone":"+919876543210","city":"Mumbai","state":"Maharashtra","pincode":"400001","address":"123 Marine Drive, Nariman Point"}',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert second donor
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000003',
  'authenticated', 'authenticated', 'priya@foodlink.com',
  crypt('Donor@123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Priya Patel","role":"donor","phone":"+919876543211","city":"Pune","state":"Maharashtra","pincode":"411001","address":"45 MG Road, Camp"}',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert verified NGO user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000004',
  'authenticated', 'authenticated', 'ngo@foodlink.com',
  crypt('Ngo@123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Anita Desai","role":"ngo","phone":"+919876543212","city":"Mumbai","state":"Maharashtra","pincode":"400050","address":"78 Bandra West","organizationName":"Hope Foundation","registrationNumber":"MH-2019-00452","organizationType":"Trust","serviceArea":"Mumbai Metropolitan Region"}',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert second NGO (pending verification)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000005',
  'authenticated', 'authenticated', 'care@foodlink.com',
  crypt('Ngo@123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Mohammed Khan","role":"ngo","phone":"+919876543213","city":"Pune","state":"Maharashtra","pincode":"411002","address":"12 FC Road","organizationName":"Care Initiative","registrationNumber":"MH-2021-00789","organizationType":"Society","serviceArea":"Pune City"}',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert third NGO (verified)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000006',
  'authenticated', 'authenticated', 'feed@foodlink.com',
  crypt('Ngo@123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Sunita Rao","role":"ngo","phone":"+919876543214","city":"Mumbai","state":"Maharashtra","pincode":"400070","address":"34 Andheri East","organizationName":"Feed India Trust","registrationNumber":"MH-2018-00231","organizationType":"Trust","serviceArea":"Mumbai and Thane"}',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Wait for trigger to create profiles, then update them
-- Update admin profile
UPDATE public.profiles SET
  role = 'admin',
  is_verified = true,
  is_active = true,
  phone = '+919876500001',
  city = 'Mumbai',
  state = 'Maharashtra'
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- Update donor 1 profile
UPDATE public.profiles SET
  role = 'donor',
  is_verified = true,
  is_active = true,
  phone = '+919876543210',
  city = 'Mumbai',
  state = 'Maharashtra',
  pincode = '400001',
  address = '123 Marine Drive, Nariman Point',
  latitude = 18.9433,
  longitude = 72.8234
WHERE id = 'a0000000-0000-0000-0000-000000000002';

-- Update donor 2 profile
UPDATE public.profiles SET
  role = 'donor',
  is_verified = true,
  is_active = true,
  phone = '+919876543211',
  city = 'Pune',
  state = 'Maharashtra',
  pincode = '411001',
  address = '45 MG Road, Camp',
  latitude = 18.5195,
  longitude = 73.8553
WHERE id = 'a0000000-0000-0000-0000-000000000003';

-- Update NGO 1 profile (verified)
UPDATE public.profiles SET
  role = 'ngo',
  is_verified = true,
  is_active = true,
  verification_status = 'approved',
  phone = '+919876543212',
  city = 'Mumbai',
  state = 'Maharashtra',
  pincode = '400050',
  address = '78 Bandra West',
  organization_name = 'Hope Foundation',
  registration_number = 'MH-2019-00452',
  organization_type = 'Trust',
  service_area = 'Mumbai Metropolitan Region',
  latitude = 19.0596,
  longitude = 72.8295
WHERE id = 'a0000000-0000-0000-0000-000000000004';

-- Update NGO 2 profile (pending)
UPDATE public.profiles SET
  role = 'ngo',
  is_verified = false,
  is_active = true,
  verification_status = 'pending',
  phone = '+919876543213',
  city = 'Pune',
  state = 'Maharashtra',
  pincode = '411002',
  address = '12 FC Road',
  organization_name = 'Care Initiative',
  registration_number = 'MH-2021-00789',
  organization_type = 'Society',
  service_area = 'Pune City',
  latitude = 18.5195,
  longitude = 73.8553
WHERE id = 'a0000000-0000-0000-0000-000000000005';

-- Update NGO 3 profile (verified)
UPDATE public.profiles SET
  role = 'ngo',
  is_verified = true,
  is_active = true,
  verification_status = 'approved',
  phone = '+919876543214',
  city = 'Mumbai',
  state = 'Maharashtra',
  pincode = '400070',
  address = '34 Andheri East',
  organization_name = 'Feed India Trust',
  registration_number = 'MH-2018-00231',
  organization_type = 'Trust',
  service_area = 'Mumbai and Thane',
  latitude = 19.1197,
  longitude = 72.8468
WHERE id = 'a0000000-0000-0000-0000-000000000006';
