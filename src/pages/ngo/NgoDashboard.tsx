import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Users, Leaf, ArrowRight, AlertCircle, MapPin } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { DonationCard } from '@/components/DonationCard';
import { CardSkeleton, StatCardSkeleton } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { VerificationBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { getAvailableDonations, getClaimedDonations } from '@/services/api';
import type { Donation } from '@/types';
import { calculateDistance } from '@/utils/format';
import { LayoutDashboard, Search, Package as PackageIcon, History, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'Find Food', path: '/ngo/food', icon: Search },
  { label: 'My Claims', path: '/ngo/claims', icon: PackageIcon },
  { label: 'History', path: '/ngo/history', icon: History },
  { label: 'Profile', path: '/ngo/profile', icon: User },
];

export function NgoDashboard() {
  const { profile } = useAuth();
  const [available, setAvailable] = useState<Donation[]>([]);
  const [claimed, setClaimed] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;
    Promise.all([getAvailableDonations({}), getClaimedDonations(profile.id)])
      .then(([avail, clm]) => { setAvailable(avail); setClaimed(clm); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [profile]);

  const activeClaims = claimed.filter((d) => d.status === 'CLAIMED');
  const completed = claimed.filter((d) => d.status === 'PICKED_UP');
  const totalMeals = completed.reduce((sum, d) => sum + d.servings, 0);
  const totalFood = completed.reduce((sum, d) => sum + d.quantity, 0);

  const nearby = available
    .filter((d) => d.latitude && d.longitude && profile?.latitude && profile?.longitude)
    .map((d) => ({ d, dist: calculateDistance(profile.latitude!, profile.longitude!, d.latitude!, d.longitude!) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4)
    .map((x) => x.d);

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }

  const isUnverified = profile?.role === 'ngo' && !profile?.is_verified;

  return (
    <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.organization_name || profile?.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Find available food and manage your pickups</p>
      </div>

      {isUnverified && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Verification Pending</p>
            <p className="mt-1 text-sm text-amber-700">Your NGO account is awaiting admin verification. You can browse available food, but claiming is disabled until approved.</p>
            <div className="mt-2"><VerificationBadge status={profile?.verification_status || 'pending'} /></div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Available Nearby" value={available.length} color="green" />
        <StatCard icon={Clock} label="Active Claims" value={activeClaims.length} color="blue" />
        <StatCard icon={CheckCircle2} label="Completed Pickups" value={completed.length} color="emerald" />
        <StatCard icon={Users} label="Meals Rescued" value={totalMeals} color="teal" />
      </div>

      <div className="mt-6 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalFood} units</p>
            <p className="text-sm text-gray-600">Total food collected and redistributed</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Available Food Near You</h2>
          <Link to="/ngo/food" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {nearby.length === 0 && available.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
            <MapPin className="h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No food available nearby right now. Check back soon!</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(nearby.length > 0 ? nearby : available.slice(0, 4)).map((d) => (
              <DonationCard key={d.id} donation={d} linkTo={`/ngo/food/${d.id}`} showDistance userLat={profile?.latitude} userLng={profile?.longitude} />
            ))}
          </div>
        )}
      </div>

      {activeClaims.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Your Active Claims</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {activeClaims.map((d) => (
              <DonationCard key={d.id} donation={d} linkTo={`/ngo/food/${d.id}`} />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
