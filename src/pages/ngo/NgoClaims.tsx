import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationCard } from '@/components/DonationCard';
import { CardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getClaimedDonations } from '@/services/api';
import type { Donation } from '@/types';
import { LayoutDashboard, Search, Package as PackageIcon, History, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'Find Food', path: '/ngo/food', icon: Search },
  { label: 'My Claims', path: '/ngo/claims', icon: PackageIcon },
  { label: 'History', path: '/ngo/history', icon: History },
  { label: 'Profile', path: '/ngo/profile', icon: User },
];

export function NgoClaims() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!profile) return;
    getClaimedDonations(profile.id)
      .then((data) => { setDonations(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [profile]);

  const filtered = donations.filter((d) => filter === 'all' || d.status === filter);
  const active = donations.filter((d) => d.status === 'CLAIMED');
  const completed = donations.filter((d) => d.status === 'PICKED_UP');

  return (
    <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
      <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your claimed donations and pickups</p>

      <div className="mt-6 flex gap-2">
        {[
          { value: 'all', label: `All (${donations.length})` },
          { value: 'CLAIMED', label: `Active (${active.length})` },
          { value: 'PICKED_UP', label: `Completed (${completed.length})` },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${filter === tab.value ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : error ? (
        <div className="mt-4"><ErrorState message={error} /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={Package}
            title="No claims yet"
            message="Browse available food and claim donations to see them here."
            action={{ label: "Find Food", onClick: () => window.location.href = '/ngo/food' }}
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filtered.map((d) => (
            <DonationCard key={d.id} donation={d} linkTo={`/ngo/food/${d.id}`} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
