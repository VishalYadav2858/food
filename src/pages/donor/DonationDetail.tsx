import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Package, Phone, User, FileText, AlertCircle, Edit, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DonationStatusBadge, VerificationBadge } from '@/components/ui/StatusBadge';
import { MapView } from '@/components/MapView';
import { Spinner } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { getDonationById, cancelDonation } from '@/services/api';
import type { Donation } from '@/types';
import { formatDateTime } from '@/utils/format';
import { LayoutDashboard, Package as PackageIcon, History, User as UserIcon, Plus } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
  { label: 'My Donations', path: '/donor/donations', icon: PackageIcon },
  { label: 'Create Donation', path: '/donor/donations/new', icon: Plus },
  { label: 'Donation History', path: '/donor/history', icon: History },
  { label: 'Profile', path: '/donor/profile', icon: UserIcon },
];

export function DonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDonationById(id)
      .then((data) => { setDonation(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleCancel = async () => {
    if (!id) return;
    setCancelling(true);
    try {
      await cancelDonation(id);
      setShowCancel(false);
      navigate('/donor/donations');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </DashboardLayout>
    );
  }

  if (error || !donation) {
    return (
      <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
        <ErrorState message={error || 'Donation not found'} onRetry={() => navigate('/donor/donations')} />
      </DashboardLayout>
    );
  }

  const canEdit = donation.status === 'AVAILABLE' && donation.donor_id === profile?.id;
  const canCancel = (donation.status === 'AVAILABLE' || donation.status === 'CLAIMED') && donation.donor_id === profile?.id;

  return (
    <DashboardLayout navItems={navItems} role="donor" roleLabel="Donor">
      <button onClick={() => navigate('/donor/donations')} className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Donations
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{donation.title}</h1>
            <DonationStatusBadge status={donation.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">{donation.category} · {donation.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</p>
        </div>
        <div className="flex gap-2">
          {canEdit && <Link to={`/donor/donations/${donation.id}/edit`} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"><Edit className="h-4 w-4" /> Edit</Link>}
          {canCancel && (
            <button onClick={() => setShowCancel(true)} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
              <XCircle className="h-4 w-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50"><AlertCircle className="h-5 w-5 text-red-600" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Donation?</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">This will cancel your donation "{donation.title}". {donation.status === 'CLAIMED' && 'An NGO has already claimed this donation. They will be notified.'}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleCancel} disabled={cancelling} className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Donation'}
              </button>
              <button onClick={() => setShowCancel(false)} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Keep</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Food Details</h2>
            {donation.description && <p className="mt-2 text-sm text-gray-600">{donation.description}</p>}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <DetailItem icon={Package} label="Quantity" value={`${donation.quantity} ${donation.unit}`} />
              <DetailItem icon={Users} label="Servings" value={`${donation.servings}`} />
              <DetailItem icon={Clock} label="Preparation" value={donation.preparation_date ? formatDateTime(donation.preparation_date) : 'N/A'} />
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
            <div className="mt-4">
              <MapView latitude={donation.latitude} longitude={donation.longitude} address={donation.address} city={donation.city} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>
            <div className="mt-4 space-y-3">
              <DetailItem icon={User} label="Contact Person" value={donation.contact_name} />
              <DetailItem icon={Phone} label="Phone" value={donation.contact_phone} />
              <DetailItem icon={MapPin} label="Location" value={`${donation.city}, ${donation.state} ${donation.pincode}`} />
            </div>
          </div>

          {donation.claimer && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <h2 className="text-base font-semibold text-gray-900">Claimed By NGO</h2>
              <div className="mt-4 space-y-3">
                <DetailItem icon={User} label="Organization" value={donation.claimer.organization_name || donation.claimer.name} />
                <DetailItem icon={Phone} label="Phone" value={donation.claimer.phone || 'N/A'} />
                <DetailItem icon={MapPin} label="City" value={donation.claimer.city || 'N/A'} />
                <div className="pt-2"><VerificationBadge status={donation.claimer.verification_status} /></div>
              </div>
              {donation.claimed_at && <p className="mt-3 text-xs text-gray-500">Claimed at: {formatDateTime(donation.claimed_at)}</p>}
              {donation.picked_up_at && <p className="text-xs text-emerald-600">Picked up at: {formatDateTime(donation.picked_up_at)}</p>}
            </div>
          )}
        </div>
      </div>
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
