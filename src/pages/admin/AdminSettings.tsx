import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Shield, Globe, Mail, Bell, MapPin } from 'lucide-react';
import { LayoutDashboard, Building2, Users, Package as PackageIcon, BarChart3, FileText, Settings as SettingsIcon } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'NGO Verification', path: '/admin/ngos', icon: Building2 },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Donations', path: '/admin/donations', icon: PackageIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: SettingsIcon },
];

export function AdminSettings() {
  return (
    <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Platform configuration and preferences</p>

      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50"><Shield className="h-5 w-5 text-green-600" /></div>
            <h2 className="text-base font-semibold text-gray-900">Security</h2>
          </div>
          <div className="mt-4 space-y-3">
            <SettingRow label="Password hashing" value="bcrypt (Supabase Auth)" enabled />
            <SettingRow label="JWT authentication" value="Active" enabled />
            <SettingRow label="Row Level Security" value="Enabled on all tables" enabled />
            <SettingRow label="Role-based access control" value="donor / ngo / admin" enabled />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50"><Globe className="h-5 w-5 text-blue-600" /></div>
            <h2 className="text-base font-semibold text-gray-900">Platform</h2>
          </div>
          <div className="mt-4 space-y-3">
            <SettingRow label="Public registration" value="Donors and NGOs can register" enabled />
            <SettingRow label="NGO verification required" value="Admin must approve before claiming" enabled />
            <SettingRow label="Admin registration" value="Disabled (admin accounts created internally)" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50"><Bell className="h-5 w-5 text-amber-600" /></div>
            <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="mt-4 space-y-3">
            <SettingRow label="In-app notifications" value="Real-time via Supabase Realtime" enabled />
            <SettingRow label="Donor notifications" value="Claim, pickup, expiry alerts" enabled />
            <SettingRow label="NGO notifications" value="Claim success, pickup reminders" enabled />
            <SettingRow label="Admin notifications" value="New NGO registrations, alerts" enabled />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50"><MapPin className="h-5 w-5 text-teal-600" /></div>
            <h2 className="text-base font-semibold text-gray-900">Integrations</h2>
          </div>
          <div className="mt-4 space-y-3">
            <SettingRow label="Maps" value="OpenStreetMap (embedded, no API key required)" enabled />
            <SettingRow label="Directions" value="OpenStreetMap directions links" enabled />
            <SettingRow label="Email notifications" value="Not configured (in-app only)" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingRow({ label, value, enabled }: { label: string; value: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{value}</p>
      </div>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
        {enabled && <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
      </span>
    </div>
  );
}
