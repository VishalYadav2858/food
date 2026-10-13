import { useEffect, useState } from 'react';
import { Search, Users, Phone, Mail, MapPin, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { RoleBadge, VerificationBadge } from '@/components/ui/StatusBadge';
import { CardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { getAllProfiles, toggleUserActive } from '@/services/api';
import type { Profile } from '@/types';
import { formatDate } from '@/utils/format';
import { LayoutDashboard, Building2, Users as UsersIcon, Package as PackageIcon, BarChart3, FileText, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'NGO Verification', path: '/admin/ngos', icon: Building2 },
  { label: 'Users', path: '/admin/users', icon: UsersIcon },
  { label: 'Donations', path: '/admin/donations', icon: PackageIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verFilter, setVerFilter] = useState('all');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllProfiles({ search, role: roleFilter, verificationStatus: verFilter });
      setUsers(data); setLoading(false);
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [search, roleFilter, verFilter]);

  const handleToggleActive = async (id: string, currentActive: boolean, isAdmin: boolean) => {
    if (isAdmin) return; // Prevent toggling admin accounts
    try {
      await toggleUserActive(id, !currentActive);
      setUsers(users.map((u) => u.id === id ? { ...u, is_active: !currentActive } : u));
    } catch (err: any) { setError(err.message); }
  };

  return (
    <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      <p className="mt-1 text-sm text-gray-500">View and manage all platform users</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
          <option value="all">All Roles</option>
          <option value="donor">Donors</option>
          <option value="ngo">NGOs</option>
          <option value="admin">Admins</option>
        </select>
        <select value={verFilter} onChange={(e) => setVerFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
          <option value="all">All Verification</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-4 grid gap-3">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : error ? (
        <div className="mt-4"><ErrorState message={error} onRetry={fetchUsers} /></div>
      ) : users.length === 0 ? (
        <div className="mt-4"><EmptyState icon={Users} title="No users found" message="Try adjusting your search filters." /></div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full md:table">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">City</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Verification</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="transition hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.city || 'N/A'}</td>
                  <td className="px-4 py-3">
                    {u.role === 'ngo' ? <VerificationBadge status={u.verification_status} /> : <span className="text-xs text-gray-400">N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(u.id, u.is_active, u.role === 'admin')}
                      disabled={u.role === 'admin'}
                      className={`flex items-center gap-1.5 text-sm font-medium transition ${u.role === 'admin' ? 'cursor-not-allowed text-gray-300' : u.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                      title={u.role === 'admin' ? 'Admin accounts cannot be deactivated' : ''}
                    >
                      {u.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      {u.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-50 md:hidden">
            {users.map((u) => (
              <div key={u.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="truncate text-xs text-gray-500">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {u.role === 'ngo' && <VerificationBadge status={u.verification_status} />}
                    <span className="text-xs text-gray-500">{u.city}</span>
                  </div>
                  <button
                    onClick={() => handleToggleActive(u.id, u.is_active, u.role === 'admin')}
                    disabled={u.role === 'admin'}
                    className={`flex items-center gap-1 text-xs font-medium ${u.role === 'admin' ? 'cursor-not-allowed text-gray-300' : u.is_active ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {u.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    {u.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
