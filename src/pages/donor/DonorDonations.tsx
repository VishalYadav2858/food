import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationCard } from '@/components/DonationCard';
import { CardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getDonorDonations } from '@/services/api';
import type { Donation } from '@/types';
import { LayoutDashboard, Package as PackageIcon, History, User, Plus as PlusIcon } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
  { label: 'My Donations', path: '/donor/donations', icon: PackageIcon },
  { label: 'Create Donation', path: '/donor/donations/new', icon: PlusIcon },
  { label: 'Donation History', path: '/donor/history', icon: History },
  { label: 'Profile', path: '/donor/profile', icon: User },
];

export function DonorDonations() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!profile) return;
    getDonorDonations(profile.id)
      .then((data) => { setDonations(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [profile]);

  const filtered = donations
    .filter((d) => filter === 'all' || d.status === filter)
    .filter((d) => !search || d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all your food donations</p>
        </div>
        <Link to="/donor/donations/new" className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
          <Plus className="h-4 w-4" /> New Donation
        </Link>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search donations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none transition focus:border-green-500"
        >
          <option value="all">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="CLAIMED">Claimed</option>
          <option value="PICKED_UP">Picked Up</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No donations found"
          message={search || filter !== 'all' ? "Try adjusting your filters" : "Start by creating your first food donation!"}
          action={{ label: "Create Donation", onClick: () => window.location.href = '/donor/donations/new' }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((d) => (
            <DonationCard key={d.id} donation={d} linkTo={`/donor/donations/${d.id}`} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
