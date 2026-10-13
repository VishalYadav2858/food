import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, TrendingUp, Users, Package } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationCard } from '@/components/DonationCard';
import { StatCard } from '@/components/StatCard';
import { CardSkeleton, StatCardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getDonorDonations } from '@/services/api';
import type { Donation } from '@/types';
import { LayoutDashboard, Package as PackageIcon, History as HistoryIcon, User, Plus } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
  { label: 'My Donations', path: '/donor/donations', icon: PackageIcon },
  { label: 'Create Donation', path: '/donor/donations/new', icon: Plus },
  { label: 'Donation History', path: '/donor/history', icon: HistoryIcon },
  { label: 'Profile', path: '/donor/profile', icon: User },
];

export function DonorHistory() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;
    getDonorDonations(profile.id)
      .then((data) => { setDonations(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [profile]);

  const completed = donations.filter((d) => d.status === 'PICKED_UP');
  const cancelled = donations.filter((d) => d.status === 'CANCELLED');
  const totalMeals = completed.reduce((sum, d) => sum + d.servings, 0);
  const totalFood = completed.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
      <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
      <p className="mt-1 text-sm text-gray-500">Your complete donation journey and impact</p>

      {loading ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">{[...Array(3)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
        </>
      ) : error ? (
        <div className="mt-6"><ErrorState message={error} /></div>
      ) : donations.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={History} title="No donation history" message="Your completed and past donations will appear here." action={{ label: "Create Donation", onClick: () => window.location.href = '/donor/donations/new' }} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard icon={Package} label="Completed Pickups" value={completed.length} color="emerald" />
            <StatCard icon={Users} label="Total Meals Donated" value={totalMeals} color="green" />
            <StatCard icon={TrendingUp} label="Total Food Rescued" value={`${totalFood} units`} color="teal" />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Completed Donations</h2>
            {completed.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No completed donations yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {completed.map((d) => <DonationCard key={d.id} donation={d} linkTo={`/donor/donations/${d.id}`} />)}
              </div>
            )}
          </div>

          {cancelled.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Cancelled Donations</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {cancelled.map((d) => <DonationCard key={d.id} donation={d} linkTo={`/donor/donations/${d.id}`} />)}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
