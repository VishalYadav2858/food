import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Package, MapPin, SortAsc } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationCard } from '@/components/DonationCard';
import { CardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getAvailableDonations } from '@/services/api';
import type { Donation } from '@/types';
import { FOOD_CATEGORIES } from '@/types';
import { calculateDistance, formatDistance } from '@/utils/format';
import { LayoutDashboard, Search as SearchIcon, Package as PackageIcon, History, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'Find Food', path: '/ngo/food', icon: SearchIcon },
  { label: 'My Claims', path: '/ngo/claims', icon: PackageIcon },
  { label: 'History', path: '/ngo/history', icon: History },
  { label: 'Profile', path: '/ngo/profile', icon: User },
];

export function FindFood() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [foodType, setFoodType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getAvailableDonations({})
      .then((data) => { setDonations(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const cities = useMemo(() => [...new Set(donations.map((d) => d.city))], [donations]);
  const [city, setCity] = useState('all');

  const filtered = useMemo(() => {
    let result = donations
      .filter((d) => !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase()))
      .filter((d) => category === 'all' || d.category === category)
      .filter((d) => city === 'all' || d.city === city)
      .filter((d) => foodType === 'all' || (foodType === 'veg' && d.is_vegetarian) || (foodType === 'nonveg' && !d.is_vegetarian));

    if (sortBy === 'nearest' && profile?.latitude && profile?.longitude) {
      result = result
        .map((d) => ({ d, dist: d.latitude && d.longitude ? calculateDistance(profile.latitude!, profile.longitude!, d.latitude, d.longitude) : Infinity }))
        .sort((a, b) => a.dist - b.dist)
        .map((x) => x.d);
    } else if (sortBy === 'deadline') {
      result = [...result].sort((a, b) => new Date(a.pickup_end).getTime() - new Date(b.pickup_end).getTime());
    }
    return result;
  }, [donations, search, category, city, foodType, sortBy, profile]);

  return (
    <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
      <h1 className="text-2xl font-bold text-gray-900">Find Food</h1>
      <p className="mt-1 text-sm text-gray-500">Browse available food donations near you</p>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
            <option value="all">All Categories</option>
            {FOOD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
            <option value="all">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={foodType} onChange={(e) => setFoodType(e.target.value)} className="rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-green-500">
            <option value="all">All Food Types</option>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">Sort by:</span>
          <div className="flex gap-1.5">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'nearest', label: 'Nearest' },
              { value: 'deadline', label: 'Pickup Deadline' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${sortBy === opt.value ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">{filtered.length} donation{filtered.length !== 1 ? 's' : ''} found</p>

      {loading ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No food available" message="No donations match your filters. Try adjusting your search or check back later." />
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filtered.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              linkTo={`/ngo/food/${d.id}`}
              showDistance
              userLat={profile?.latitude}
              userLng={profile?.longitude}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
