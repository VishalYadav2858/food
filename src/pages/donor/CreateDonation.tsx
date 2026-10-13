import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { createDonation } from '@/services/api';
import { FOOD_CATEGORIES, UNITS } from '@/types';
import type { DonationFormData } from '@/types';
import { LayoutDashboard, Package, History, User, Plus } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
  { label: 'My Donations', path: '/donor/donations', icon: Package },
  { label: 'Create Donation', path: '/donor/donations/new', icon: Plus },
  { label: 'Donation History', path: '/donor/history', icon: History },
  { label: 'Profile', path: '/donor/profile', icon: User },
];

export function CreateDonation() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<DonationFormData>({
    title: '', category: 'Cooked Meals', description: '', quantity: 1, unit: 'plates',
    servings: 1, food_type: '', is_vegetarian: true, preparation_date: '', expiry_date: '',
    pickup_start: '', pickup_end: '', address: '', city: profile?.city || '', state: profile?.state || '',
    pincode: profile?.pincode || '', latitude: profile?.latitude || 0, longitude: profile?.longitude || 0,
    contact_name: profile?.name || '', contact_phone: profile?.phone || '', instructions: '',
  });

  const update = (key: keyof DonationFormData, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Food title is required';
    if (!form.description.trim()) return 'Description is required';
    if (form.quantity <= 0) return 'Quantity must be positive';
    if (form.servings <= 0) return 'Servings must be positive';
    if (!form.expiry_date) return 'Best before date is required';
    if (!form.pickup_start) return 'Pickup start time is required';
    if (!form.pickup_end) return 'Pickup end time is required';
    if (form.pickup_end && form.pickup_start && new Date(form.pickup_end) <= new Date(form.pickup_start))
      return 'Pickup end time must be after pickup start time';
    if (form.expiry_date && new Date(form.expiry_date) < new Date())
      return 'Food has already expired and cannot be listed';
    if (!form.address.trim()) return 'Pickup address is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.contact_name.trim()) return 'Contact person is required';
    if (!form.contact_phone.trim()) return 'Contact phone is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    if (!profile) return;

    setLoading(true);
    try {
      const donation = await createDonation(form, profile.id);
      setSuccess(true);
      setTimeout(() => navigate(`/donor/donations/${donation?.id || ''}`), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Donation Created Successfully!</h2>
          <p className="mt-2 text-sm text-gray-500">Your food donation is now available for NGOs to claim.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
      <button onClick={() => navigate('/donor/donations')} className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Donations
      </button>

      <h1 className="text-2xl font-bold text-gray-900">Create Food Donation</h1>
      <p className="mt-1 text-sm text-gray-500">Fill in the details below to list your surplus food for NGOs to claim.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Food Details */}
        <FormSection title="Food Details">
          <FormField label="Food Title" required>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className={inputClass} placeholder="e.g. Wedding Reception Surplus Meals" />
          </FormField>
          <FormField label="Category" required>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass}>
              {FOOD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Description" required>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className={inputClass} placeholder="Describe the food items, preparation method, etc." />
            </FormField>
          </div>
          <FormField label="Quantity" required>
            <input type="number" min={1} value={form.quantity} onChange={(e) => update('quantity', Number(e.target.value))} className={inputClass} />
          </FormField>
          <FormField label="Unit" required>
            <select value={form.unit} onChange={(e) => update('unit', e.target.value)} className={inputClass}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </FormField>
          <FormField label="Number of Servings" required>
            <input type="number" min={1} value={form.servings} onChange={(e) => update('servings', Number(e.target.value))} className={inputClass} />
          </FormField>
          <FormField label="Food Type">
            <input type="text" value={form.food_type} onChange={(e) => update('food_type', e.target.value)} className={inputClass} placeholder="e.g. Indian, Continental" />
          </FormField>
          <FormField label="Vegetarian / Non-Vegetarian" required>
            <div className="flex gap-3">
              <label className={`flex-1 cursor-pointer rounded-lg border-2 p-2.5 text-center text-sm transition ${form.is_vegetarian ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'}`}>
                <input type="radio" checked={form.is_vegetarian} onChange={() => update('is_vegetarian', true)} className="hidden" /> Vegetarian
              </label>
              <label className={`flex-1 cursor-pointer rounded-lg border-2 p-2.5 text-center text-sm transition ${!form.is_vegetarian ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200'}`}>
                <input type="radio" checked={!form.is_vegetarian} onChange={() => update('is_vegetarian', false)} className="hidden" /> Non-Veg
              </label>
            </div>
          </FormField>
        </FormSection>

        {/* Timing */}
        <FormSection title="Timing & Freshness">
          <FormField label="Preparation Date & Time">
            <input type="datetime-local" value={form.preparation_date} onChange={(e) => update('preparation_date', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Best Before Date & Time" required>
            <input type="datetime-local" value={form.expiry_date} onChange={(e) => update('expiry_date', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Pickup Start Time" required>
            <input type="datetime-local" value={form.pickup_start} onChange={(e) => update('pickup_start', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Pickup End Time" required>
            <input type="datetime-local" value={form.pickup_end} onChange={(e) => update('pickup_end', e.target.value)} className={inputClass} />
          </FormField>
        </FormSection>

        {/* Location */}
        <FormSection title="Pickup Location">
          <div className="sm:col-span-2">
            <FormField label="Pickup Address" required>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className={inputClass} placeholder="Full pickup address" />
            </FormField>
          </div>
          <FormField label="City" required>
            <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="State" required>
            <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Pincode" required>
            <input type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Latitude">
              <input type="number" step="any" value={form.latitude || ''} onChange={(e) => update('latitude', Number(e.target.value))} className={inputClass} placeholder="18.9433" />
            </FormField>
            <FormField label="Longitude">
              <input type="number" step="any" value={form.longitude || ''} onChange={(e) => update('longitude', Number(e.target.value))} className={inputClass} placeholder="72.8234" />
            </FormField>
          </div>
        </FormSection>

        {/* Contact */}
        <FormSection title="Contact Information">
          <FormField label="Contact Person" required>
            <input type="text" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Contact Phone" required>
            <input type="tel" value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} className={inputClass} placeholder="+91..." />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Additional Instructions">
              <textarea value={form.instructions} onChange={(e) => update('instructions', e.target.value)} rows={2} className={inputClass} placeholder="Any special instructions for pickup (e.g. use back entrance, bring containers)" />
            </FormField>
          </div>
        </FormSection>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
            {loading ? 'Creating...' : 'Create Donation'}
          </button>
          <button type="button" onClick={() => navigate('/donor/donations')} className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

const inputClass = 'w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100';

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
