import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle2, Clock, Users, Leaf, TrendingUp, Plus, ArrowRight, LayoutDashboard, History, User } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { DonationCard } from '@/components/DonationCard';
import { CardSkeleton, StatCardSkeleton } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getDonorDonations } from '@/services/api';
import type { Donation } from '@/types';

const navItems = [
  { label: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
  { label: 'My Donations', path: '/donor/donations', icon: Package },
  { label: 'Create Donation', path: '/donor/donations/new', icon: Plus },
  { label: 'Donation History', path: '/donor/history', icon: History },
  { label: 'Profile', path: '/donor/profile', icon: User },
];

export function DonorDashboard() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;
    getDonorDonations(profile.id)
      .then((data) => { setDonations(data); setLoading(false); })
      .catch((err) => { setError(err.message || 'Failed to load donations'); setLoading(false); });
  }, [profile]);

  const active = donations.filter((d) => d.status === 'AVAILABLE');
  const claimed = donations.filter((d) => d.status === 'CLAIMED');
  const completed = donations.filter((d) => d.status === 'PICKED_UP');
  const totalMeals = completed.reduce((sum, d) => sum + d.servings, 0);
  const totalFood = completed.reduce((sum, d) => sum + d.quantity, 0);
  const recent = donations.slice(0, 4);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-gray-500">Here's your food rescue impact overview</p>
        </div>
        <Link to="/donor/donations/new" className="hidden items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 sm:flex">
          <Plus className="h-4 w-4" /> New Donation
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Active Donations" value={active.length} color="green" />
        <StatCard icon={Clock} label="Claimed" value={claimed.length} color="blue" />
        <StatCard icon={CheckCircle2} label="Completed Pickups" value={completed.length} color="emerald" />
        <StatCard icon={Users} label="Total Meals Donated" value={totalMeals} color="teal" />
      </div>

      <div className="mt-6 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalFood} kg</p>
            <p className="text-sm text-gray-600">Total food rescued from waste</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
          <Link to="/donor/donations" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
            <Leaf className="h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No donations yet. Start by creating your first donation!</p>
            <Link to="/donor/donations/new" className="mt-4 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
              Create Donation
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {recent.map((d) => (
              <DonationCard key={d.id} donation={d} linkTo={`/donor/donations/${d.id}`} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
