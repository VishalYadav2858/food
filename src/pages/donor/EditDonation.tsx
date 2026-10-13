import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Spinner } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getDonationById, updateDonation } from '@/services/api';
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

const inputClass = 'w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100';

function toLocalInput(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60 * 1000).toISOString().slice(0, 16);
}

export function EditDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<DonationFormData>({
    title: '', category: 'Cooked Meals', description: '', quantity: 1, unit: 'plates',
    servings: 1, food_type: '', is_vegetarian: true, preparation_date: '', expiry_date: '',
    pickup_start: '', pickup_end: '', address: '', city: '', state: '', pincode: '',
    latitude: 0, longitude: 0, contact_name: '', contact_phone: '', instructions: '',
  });

  useEffect(() => {
    if (!id) return;
    getDonationById(id)
      .then((data) => {
        if (!data) { setError('Donation not found'); setLoading(false); return; }
        if (data.donor_id !== profile?.id) { setError('You can only edit your own donations'); setLoading(false); return; }
        if (data.status !== 'AVAILABLE') { setError('Only available donations can be edited'); setLoading(false); return; }
        setForm({
          title: data.title, category: data.category, description: data.description || '',
          quantity: data.quantity, unit: data.unit, servings: data.servings,
          food_type: data.food_type || '', is_vegetarian: data.is_vegetarian,
          preparation_date: toLocalInput(data.preparation_date), expiry_date: toLocalInput(data.expiry_date),
          pickup_start: toLocalInput(data.pickup_start), pickup_end: toLocalInput(data.pickup_end),
          address: data.address, city: data.city, state: data.state, pincode: data.pincode,
          latitude: data.latitude || 0, longitude: data.longitude || 0,
          contact_name: data.contact_name, contact_phone: data.contact_phone,
          instructions: data.instructions || '',
        });
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id, profile]);

  const update = (key: keyof DonationFormData, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Food title is required'); return; }
    if (form.quantity <= 0) { setError('Quantity must be positive'); return; }
    if (form.servings <= 0) { setError('Servings must be positive'); return; }
    if (form.pickup_end && form.pickup_start && new Date(form.pickup_end) <= new Date(form.pickup_start)) {
      setError('Pickup end time must be after pickup start time'); return;
    }
    if (!id) return;
    setSaving(true);
    try {
      await updateDonation(id, form);
      setSuccess(true);
      setTimeout(() => navigate(`/donor/donations/${id}`), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update donation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </DashboardLayout>
    );
  }

  if (error && !form.title) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <ErrorState message={error} onRetry={() => navigate('/donor/donations')} />
      </DashboardLayout>
    );
  }

  if (success) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Donation Updated!</h2>
          <p className="mt-2 text-sm text-gray-500">Redirecting to donation details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
      <button onClick={() => navigate(`/donor/donations/${id}`)} className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Donation
      </button>

      <h1 className="text-2xl font-bold text-gray-900">Edit Donation</h1>
      <p className="mt-1 text-sm text-gray-500">Update your food donation details</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Food Details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Food Title *</label>
              <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className={`${inputClass} mt-1.5`}>
                {FOOD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity *</label>
              <input type="number" min={1} value={form.quantity} onChange={(e) => update('quantity', Number(e.target.value))} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit *</label>
              <select value={form.unit} onChange={(e) => update('unit', e.target.value)} className={`${inputClass} mt-1.5`}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Servings *</label>
              <input type="number" min={1} value={form.servings} onChange={(e) => update('servings', Number(e.target.value))} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Food Type</label>
              <input type="text" value={form.food_type} onChange={(e) => update('food_type', e.target.value)} className={`${inputClass} mt-1.5`} placeholder="Indian, Continental..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vegetarian / Non-Veg *</label>
              <div className="mt-1.5 flex gap-3">
                <label className={`flex-1 cursor-pointer rounded-lg border-2 p-2.5 text-center text-sm ${form.is_vegetarian ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'}`}>
                  <input type="radio" checked={form.is_vegetarian} onChange={() => update('is_vegetarian', true)} className="hidden" /> Veg
                </label>
                <label className={`flex-1 cursor-pointer rounded-lg border-2 p-2.5 text-center text-sm ${!form.is_vegetarian ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200'}`}>
                  <input type="radio" checked={!form.is_vegetarian} onChange={() => update('is_vegetarian', false)} className="hidden" /> Non-Veg
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Timing & Freshness</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preparation Date</label>
              <input type="datetime-local" value={form.preparation_date} onChange={(e) => update('preparation_date', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Best Before *</label>
              <input type="datetime-local" value={form.expiry_date} onChange={(e) => update('expiry_date', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Start *</label>
              <input type="datetime-local" value={form.pickup_start} onChange={(e) => update('pickup_start', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup End *</label>
              <input type="datetime-local" value={form.pickup_end} onChange={(e) => update('pickup_end', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Pickup Location & Contact</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address *</label>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City *</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State *</label>
              <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person *</label>
              <input type="text" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone *</label>
              <input type="tel" value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} className={`${inputClass} mt-1.5`} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate(`/donor/donations/${id}`)} className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
