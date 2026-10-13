import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { VerificationBadge, RoleBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/api';
import type { LucideIcon } from 'lucide-react';

interface ProfilePageProps {
  role: 'donor' | 'ngo' | 'admin';
  navItems: { label: string; path: string; icon: LucideIcon }[];
  roleLabel: string;
}

export function ProfilePage({ role, navItems, roleLabel }: ProfilePageProps) {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    name: profile?.name || '', phone: profile?.phone || '', address: profile?.address || '',
    city: profile?.city || '', state: profile?.state || '', pincode: profile?.pincode || '',
    service_area: profile?.service_area || '',
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateProfile(profile.id, {
        name: form.name, phone: form.phone, address: form.address,
        city: form.city, state: form.state, pincode: form.pincode,
        service_area: form.service_area,
      } as any);
      await refreshProfile();
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  const inputClass = 'w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100';

  return (
    <DashboardLayout navItems={navItems} role={role} roleLabel={roleLabel}>
      <h1 className="text-2xl font-bold text-gray-900">{role === 'ngo' ? 'Organization Profile' : 'My Profile'}</h1>
      <p className="mt-1 text-sm text-gray-500">View and update your personal information</p>

      {message && (
        <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Profile Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-2xl font-bold text-white">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <RoleBadge role={profile.role} />
            {role === 'ngo' && <VerificationBadge status={profile.verification_status} />}
          </div>
          {role === 'ngo' && profile.organization_name && (
            <div className="mt-4 border-t border-gray-50 pt-4 text-left">
              <p className="text-xs text-gray-400">Organization</p>
              <p className="text-sm font-medium text-gray-900">{profile.organization_name}</p>
              <p className="mt-2 text-xs text-gray-400">Registration No.</p>
              <p className="text-sm font-medium text-gray-900">{profile.registration_number}</p>
              <p className="mt-2 text-xs text-gray-400">Type</p>
              <p className="text-sm font-medium text-gray-900">{profile.organization_type}</p>
            </div>
          )}
        </div>

        {/* Editable Info */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ProfileField icon={User} label="Full Name" value={form.name} editing={editing} onChange={(v) => update('name', v)} />
            <ProfileField icon={Mail} label="Email" value={profile.email} editing={false} />
            <ProfileField icon={Phone} label="Phone" value={form.phone} editing={editing} onChange={(v) => update('phone', v)} />
            <ProfileField icon={MapPin} label="City" value={form.city} editing={editing} onChange={(v) => update('city', v)} />
            <ProfileField icon={MapPin} label="State" value={form.state} editing={editing} onChange={(v) => update('state', v)} />
            <ProfileField icon={MapPin} label="Pincode" value={form.pincode} editing={editing} onChange={(v) => update('pincode', v)} />
            <div className="sm:col-span-2">
              <ProfileField icon={MapPin} label="Address" value={form.address} editing={editing} onChange={(v) => update('address', v)} />
            </div>
            {role === 'ngo' && (
              <div className="sm:col-span-2">
                <ProfileField icon={Building2} label="Service Area" value={form.service_area} editing={editing} onChange={(v) => update('service_area', v)} />
              </div>
            )}
          </div>

          {role === 'ngo' && profile.verification_status === 'rejected' && profile.rejection_reason && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-medium">Verification Rejected</p>
              <p className="mt-1">{profile.rejection_reason}</p>
            </div>
          )}
          {role === 'ngo' && profile.verification_status === 'pending' && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Your organization is pending verification. You'll be notified once approved.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ProfileField({ icon: Icon, label, value, editing, onChange }: { icon: React.ElementType; label: string; value: string; editing: boolean; onChange?: (v: string) => void }) {
  const inputClass = 'w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100';
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      {editing && onChange ? (
        <div className="mt-1 relative">
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        </div>
      ) : (
        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
          <Icon className="h-4 w-4 text-gray-400" /> {value || 'N/A'}
        </p>
      )}
    </div>
  );
}
