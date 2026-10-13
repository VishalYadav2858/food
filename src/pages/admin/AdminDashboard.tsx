import { useEffect, useState } from 'react';
import { Users, Building2, Package, Clock, CheckCircle2, TrendingUp, Leaf, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { StatCardSkeleton } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import type { Profile, Donation } from '@/types';
import { LayoutDashboard, Building2 as Building, Users as UsersIcon, Package as PackageIcon, BarChart3, FileText, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'NGO Verification', path: '/admin/ngos', icon: Building },
  { label: 'Users', path: '/admin/users', icon: UsersIcon },
  { label: 'Donations', path: '/admin/donations', icon: PackageIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

interface AdminStats {
  totalUsers: number; totalDonors: number; totalNgos: number; pendingNgos: number;
  totalDonations: number; activeDonations: number; claimedDonations: number; completedPickups: number;
  totalMeals: number; totalFood: number; pickupSuccessRate: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [profilesRes, donationsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('donations').select('*'),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (donationsRes.error) throw donationsRes.error;
      const profiles = profilesRes.data as Profile[];
      const donations = donationsRes.data as Donation[];
      const donors = profiles.filter((p) => p.role === 'donor');
      const ngos = profiles.filter((p) => p.role === 'ngo');
      const pendingNgos = ngos.filter((p) => p.verification_status === 'pending');
      const active = donations.filter((d) => d.status === 'AVAILABLE');
      const claimed = donations.filter((d) => d.status === 'CLAIMED');
      const completed = donations.filter((d) => d.status === 'PICKED_UP');
      const totalMeals = completed.reduce((sum, d) => sum + d.servings, 0);
      const totalFood = completed.reduce((sum, d) => sum + d.quantity, 0);
      const pickupSuccessRate = claimed.length + completed.length > 0
        ? Math.round((completed.length / (claimed.length + completed.length)) * 100) : 0;
      setStats({
        totalUsers: profiles.length, totalDonors: donors.length, totalNgos: ngos.length,
        pendingNgos: pendingNgos.length, totalDonations: donations.length, activeDonations: active.length,
        claimedDonations: claimed.length, completedPickups: completed.length, totalMeals, totalFood, pickupSuccessRate,
      });
      setLoading(false);
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(8)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
      </DashboardLayout>
    );
  }
  if (error) {
    return (<DashboardLayout navItems={navItems} role="admin" roleLabel="Admin"><ErrorState message={error} onRetry={fetchStats} /></DashboardLayout>);
  }
  if (!stats) return null;

  return (
    <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Platform overview and statistics</p>

      {stats.pendingNgos > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800"><strong>{stats.pendingNgos}</strong> NGO{stats.pendingNgos > 1 ? 's' : ''} awaiting verification. <a href="/admin/ngos" className="font-semibold underline">Review now</a></p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="slate" />
        <StatCard icon={Users} label="Total Donors" value={stats.totalDonors} color="green" />
        <StatCard icon={Building2} label="Total NGOs" value={stats.totalNgos} color="blue" />
        <StatCard icon={Clock} label="Pending Verifications" value={stats.pendingNgos} color="amber" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Donations" value={stats.totalDonations} color="teal" />
        <StatCard icon={Package} label="Active Donations" value={stats.activeDonations} color="green" />
        <StatCard icon={Clock} label="Claimed" value={stats.claimedDonations} color="blue" />
        <StatCard icon={CheckCircle2} label="Completed Pickups" value={stats.completedPickups} color="emerald" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6">
          <Leaf className="h-8 w-8 text-green-600" />
          <p className="mt-3 text-3xl font-bold text-gray-900">{stats.totalMeals}</p>
          <p className="text-sm text-gray-600">Total Meals Redistributed</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <p className="mt-3 text-3xl font-bold text-gray-900">{stats.totalFood}</p>
          <p className="text-sm text-gray-600">Total Food Rescued (units)</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <p className="mt-3 text-3xl font-bold text-gray-900">{stats.pickupSuccessRate}%</p>
          <p className="text-sm text-gray-600">Pickup Success Rate</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
