import { useEffect, useState } from 'react';
import { History, TrendingUp, Users, Package } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationCard } from '@/components/DonationCard';
import { StatCard } from '@/components/StatCard';
import { CardSkeleton, StatCardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getClaimedDonations } from '@/services/api';
import type { Donation } from '@/types';
import { LayoutDashboard, Search, Package as PackageIcon, History as HistoryIcon, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'Find Food', path: '/ngo/food', icon: Search },
  { label: 'My Claims', path: '/ngo/claims', icon: PackageIcon },
  { label: 'History', path: '/ngo/history', icon: HistoryIcon },
  { label: 'Profile', path: '/ngo/profile', icon: User },
];

export function NgoHistory() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;
    getClaimedDonations(profile.id)
      .then((data) => { setDonations(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [profile]);

  const completed = donations.filter((d) => d.status === 'PICKED_UP');
  const totalMeals = completed.reduce((sum, d) => sum + d.servings, 0);
  const totalFood = completed.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
      <h1 className="text-2xl font-bold text-gray-900">History</h1>
      <p className="mt-1 text-sm text-gray-500">Your complete pickup history and impact</p>

      {loading ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">{[...Array(3)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
        </>
      ) : error ? (
        <div className="mt-6"><ErrorState message={error} /></div>
      ) : donations.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={History} title="No pickup history" message="Your completed pickups will appear here once you start claiming food." action={{ label: "Find Food", onClick: () => window.location.href = '/ngo/food' }} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard icon={Package} label="Completed Pickups" value={completed.length} color="emerald" />
            <StatCard icon={Users} label="Meals Rescued" value={totalMeals} color="green" />
            <StatCard icon={TrendingUp} label="Food Collected" value={`${totalFood} units`} color="teal" />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Completed Pickups</h2>
            {completed.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">No completed pickups yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {completed.map((d) => <DonationCard key={d.id} donation={d} linkTo={`/ngo/food/${d.id}`} />)}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
