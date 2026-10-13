import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Building2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { ORGANIZATION_TYPES } from '@/types';
import type { UserRole } from '@/types';

export function RegisterPage() {
  const { signUp, profile } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('donor');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', city: '', state: '', pincode: '',
    organizationName: '', registrationNumber: '', organizationType: 'Trust', serviceArea: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) navigate(`/${profile.role}/dashboard`, { replace: true });
  }, [profile, navigate]);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (role === 'ngo' && (!form.organizationName || !form.registrationNumber)) {
      setError('Organization name and registration number are required for NGOs');
      return;
    }

    setLoading(true);
    const { error } = await signUp({
      email: form.email, password: form.password, name: form.name, role,
      phone: form.phone, address: form.address, city: form.city, state: form.state, pincode: form.pincode,
      organizationName: form.organizationName, registrationNumber: form.registrationNumber,
      organizationType: form.organizationType, serviceArea: form.serviceArea,
    });
    setLoading(false);

    if (error) {
      setError(error.includes('already registered') ? 'An account with this email already exists' : error);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join FoodLink and start making a difference">
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">I want to register as</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {[
              { value: 'donor', label: 'Donor', desc: 'I have surplus food' },
              { value: 'ngo', label: 'NGO', desc: 'I collect & distribute' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value as UserRole)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  role === opt.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">{opt.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {role === 'ngo' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
            <CheckCircle2 className="inline h-3.5 w-3.5 mr-1" />
            NGO accounts require admin verification before claiming food. You'll be notified once approved.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={User} label="Full Name" value={form.name} onChange={(v) => update('name', v)} required />
          <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={Lock} label="Password" type="password" value={form.password} onChange={(v) => update('password', v)} required />
          <Field icon={Lock} label="Confirm Password" type="password" value={form.confirmPassword} onChange={(v) => update('confirmPassword', v)} required />
        </div>

        <Field icon={Phone} label="Phone" value={form.phone} onChange={(v) => update('phone', v)} required />

        {role === 'ngo' && (
          <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Organization Details</h3>
            <Field icon={Building2} label="Organization Name" value={form.organizationName} onChange={(v) => update('organizationName', v)} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={FileText} label="Registration Number" value={form.registrationNumber} onChange={(v) => update('registrationNumber', v)} required />
              <div>
                <label className="block text-sm font-medium text-gray-700">Organization Type</label>
                <select
                  value={form.organizationType}
                  onChange={(e) => update('organizationType', e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  {ORGANIZATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <Field icon={MapPin} label="Service Area" value={form.serviceArea} onChange={(v) => update('serviceArea', v)} />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <Field icon={MapPin} label="City" value={form.city} onChange={(v) => update('city', v)} required />
          <Field icon={MapPin} label="State" value={form.state} onChange={(v) => update('state', v)} required />
          <Field icon={MapPin} label="Pincode" value={form.pincode} onChange={(v) => update('pincode', v)} required />
        </div>

        <Field icon={MapPin} label="Address" value={form.address} onChange={(v) => update('address', v)} />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function Field({ icon: Icon, label, value, onChange, type = 'text', required }: {
  icon: React.ElementType; label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</label>
      <div className="mt-1.5 relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
      </div>
    </div>
  );
}
