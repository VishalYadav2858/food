import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Package, Phone, User, FileText, AlertCircle, CheckCircle2, HandHeart } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationStatusBadge, VerificationBadge } from '@/components/ui/StatusBadge';
import { MapView } from '@/components/MapView';
import { Spinner } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getDonationById, claimDonation, markPickedUp } from '@/services/api';
import type { Donation } from '@/types';
import { formatDateTime } from '@/utils/format';
import { LayoutDashboard, Search, Package as PackageIcon, History, User as UserIcon } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'Find Food', path: '/ngo/food', icon: Search },
  { label: 'My Claims', path: '/ngo/claims', icon: PackageIcon },
  { label: 'History', path: '/ngo/history', icon: History },
  { label: 'Profile', path: '/ngo/profile', icon: UserIcon },
];

export function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    getDonationById(id)
      .then((data) => { setDonation(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleClaim = async () => {
    if (!id) return;
    setActionLoading(true);
    setActionError('');
    const { error } = await claimDonation(id);
    setActionLoading(false);
    if (error) {
      setActionError(error);
      setShowClaimModal(false);
    } else {
      setShowClaimModal(false);
      setSuccess('Donation claimed successfully! You can now coordinate pickup with the donor.');
      const updated = await getDonationById(id);
      setDonation(updated);
    }
  };

  const handlePickup = async () => {
    if (!id) return;
    setActionLoading(true);
    setActionError('');
    const { error } = await markPickedUp(id);
    setActionLoading(false);
    if (error) {
      setActionError(error);
    } else {
      setSuccess('Pickup confirmed! Thank you for collecting this donation.');
      const updated = await getDonationById(id);
      setDonation(updated);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </DashboardLayout>
    );
  }

  if (error || !donation) {
    return (
      <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
        <ErrorState message={error || 'Donation not found'} onRetry={() => navigate('/ngo/food')} />
      </DashboardLayout>
    );
  }

  const isVerified = profile?.is_verified;
  const isClaimedByMe = donation.claimed_by === profile?.id;
  const canClaim = donation.status === 'AVAILABLE' && isVerified;
  const canPickup = donation.status === 'CLAIMED' && isClaimedByMe;

  return (
    <DashboardLayout navItems={navItems} role="ngo" roleLabel="NGO">
      <button onClick={() => navigate('/ngo/food')} className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Find Food
      </button>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </div>
      )}
      {actionError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {actionError}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{donation.title}</h1>
            <DonationStatusBadge status={donation.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">{donation.category} · {donation.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Food Details</h2>
            {donation.description && <p className="mt-2 text-sm text-gray-600">{donation.description}</p>}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <DetailItem icon={Package} label="Quantity" value={`${donation.quantity} ${donation.unit}`} />
              <DetailItem icon={Users} label="Servings" value={`${donation.servings}`} />
              <DetailItem icon={Clock} label="Best Before" value={formatDateTime(donation.expiry_date)} />
              <DetailItem icon={Clock} label="Pickup Start" value={formatDateTime(donation.pickup_start)} />
              <DetailItem icon={Clock} label="Pickup End" value={formatDateTime(donation.pickup_end)} />
            </div>
            {donation.instructions && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="flex items-start gap-2 text-sm text-gray-600"><FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" /> {donation.instructions}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Pickup Location</h2>
            <div className="mt-4"><MapView latitude={donation.latitude} longitude={donation.longitude} address={donation.address} city={donation.city} /></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Donor Contact */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Donor Contact</h2>
            <div className="mt-4 space-y-3">
              <DetailItem icon={User} label="Contact Person" value={donation.contact_name} />
              <DetailItem icon={Phone} label="Phone" value={donation.contact_phone} />
              <DetailItem icon={MapPin} label="Location" value={`${donation.city}, ${donation.state} ${donation.pincode}`} />
            </div>
          </div>

          {/* Claim/Pickup Actions */}
          {canClaim && (
            <button
              onClick={() => setShowClaimModal(true)}
              disabled={actionLoading}
              className="w-full rounded-xl bg-green-600 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-60"
            >
              <HandHeart className="mr-2 inline h-5 w-5" /> Claim This Donation
            </button>
          )}

          {!isVerified && donation.status === 'AVAILABLE' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <AlertCircle className="mx-auto h-6 w-6 text-amber-600" />
              <p className="mt-2 text-sm font-medium text-amber-800">Verification Required</p>
              <p className="mt-1 text-xs text-amber-700">Your NGO must be verified by an admin before you can claim food.</p>
            </div>
          )}

          {isClaimedByMe && donation.status === 'CLAIMED' && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <h2 className="text-base font-semibold text-gray-900">Pickup Status</h2>
              <p className="mt-2 text-sm text-gray-600">You have claimed this donation. Please coordinate with the donor and pick up the food within the pickup window.</p>
              <button
                onClick={handlePickup}
                disabled={actionLoading}
                className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {actionLoading ? 'Updating...' : 'Mark as Picked Up'}
              </button>
            </div>
          )}

          {donation.status === 'PICKED_UP' && isClaimedByMe && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-2 text-sm font-semibold text-emerald-800">Pickup Completed</p>
              {donation.picked_up_at && <p className="mt-1 text-xs text-emerald-600">{formatDateTime(donation.picked_up_at)}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Claim Confirmation Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50"><HandHeart className="h-5 w-5 text-green-600" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Claim This Donation?</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">You are about to claim this donation. The donor will be notified, and the food will be reserved for your organization.</p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4 space-y-2">
              <p className="text-sm"><span className="text-gray-500">Food:</span> <span className="font-medium text-gray-900">{donation.title}</span></p>
              <p className="text-sm"><span className="text-gray-500">Servings:</span> <span className="font-medium text-gray-900">{donation.servings}</span></p>
              <p className="text-sm"><span className="text-gray-500">Pickup Address:</span> <span className="font-medium text-gray-900">{donation.address}, {donation.city}</span></p>
              <p className="text-sm"><span className="text-gray-500">Pickup Window:</span> <span className="font-medium text-gray-900">{formatDateTime(donation.pickup_start)} - {formatDateTime(donation.pickup_end)}</span></p>
              <p className="text-sm"><span className="text-gray-500">Donor Contact:</span> <span className="font-medium text-gray-900">{donation.contact_name} ({donation.contact_phone})</span></p>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={handleClaim} disabled={actionLoading} className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
                {actionLoading ? 'Claiming...' : 'Yes, Claim It'}
              </button>
              <button onClick={() => setShowClaimModal(false)} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-gray-400"><Icon className="h-3.5 w-3.5" /> {label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
