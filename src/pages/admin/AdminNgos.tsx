import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, XCircle, Search, AlertCircle, FileText, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { VerificationBadge } from '@/components/ui/StatusBadge';
import { CardSkeleton } from '@/components/ui/Loading';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { getPendingNgos, approveNgo, rejectNgo } from '@/services/api';
import type { Profile } from '@/types';
import { formatDate } from '@/utils/format';
import { LayoutDashboard, Building2 as Building, Users as UsersIcon, Package as PackageIcon, BarChart3, FileText as FileTextIcon, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'NGO Verification', path: '/admin/ngos', icon: Building },
  { label: 'Users', path: '/admin/users', icon: UsersIcon },
  { label: 'Donations', path: '/admin/donations', icon: PackageIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', path: '/admin/reports', icon: FileTextIcon },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminNgos() {
  const [ngos, setNgos] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Profile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchNgos(); }, []);

  const fetchNgos = async () => {
    try {
      const data = await getPendingNgos();
      setNgos(data); setLoading(false);
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await approveNgo(id);
      setNgos(ngos.filter((n) => n.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err: any) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!selected || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await rejectNgo(selected.id, rejectionReason);
      setNgos(ngos.filter((n) => n.id !== selected.id));
      setSelected(null);
      setShowReject(false);
      setRejectionReason('');
    } catch (err: any) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  return (
    <DashboardLayout navItems={navItems} role="admin" roleLabel="Admin">
      <h1 className="text-2xl font-bold text-gray-900">NGO Verification</h1>
      <p className="mt-1 text-sm text-gray-500">Review and verify NGO organizations</p>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">{[...Array(2)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : error ? (
        <div className="mt-6"><ErrorState message={error} onRetry={fetchNgos} /></div>
      ) : ngos.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={CheckCircle2} title="No pending verifications" message="All NGOs have been reviewed. Great work keeping the platform verified!" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{ngo.organization_name}</h3>
                  <p className="text-sm text-gray-500">{ngo.name} · {ngo.email}</p>
                </div>
                <VerificationBadge status={ngo.verification_status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Registration No.</p><p className="font-medium text-gray-900">{ngo.registration_number}</p></div>
                <div><p className="text-xs text-gray-400">Type</p><p className="font-medium text-gray-900">{ngo.organization_type}</p></div>
                <div><p className="text-xs text-gray-400">City</p><p className="font-medium text-gray-900">{ngo.city}, {ngo.state}</p></div>
                <div><p className="text-xs text-gray-400">Registered</p><p className="font-medium text-gray-900">{formatDate(ngo.created_at)}</p></div>
              </div>
              <p className="mt-3 text-sm text-gray-600">Service Area: {ngo.service_area || 'N/A'}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => handleApprove(ngo.id)} disabled={actionLoading} className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
                  <CheckCircle2 className="mr-1 inline h-4 w-4" /> Approve
                </button>
                <button onClick={() => { setSelected(ngo); setShowReject(true); }} className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                  <XCircle className="mr-1 inline h-4 w-4" /> Reject
                </button>
                <button onClick={() => setSelected(ngo)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && !showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900">{selected.organization_name}</h3>
            <div className="mt-4 space-y-3">
              <DetailRow icon={Building2} label="Organization" value={selected.organization_name || 'N/A'} />
              <DetailRow icon={FileText} label="Registration No." value={selected.registration_number || 'N/A'} />
              <DetailRow icon={Building2} label="Type" value={selected.organization_type || 'N/A'} />
              <DetailRow icon={Mail} label="Email" value={selected.email} />
              <DetailRow icon={Phone} label="Phone" value={selected.phone || 'N/A'} />
              <DetailRow icon={MapPin} label="Address" value={`${selected.address || ''}, ${selected.city || ''}, ${selected.state || ''} ${selected.pincode || ''}`} />
              <DetailRow icon={MapPin} label="Service Area" value={selected.service_area || 'N/A'} />
              <DetailRow icon={Calendar} label="Registered" value={formatDate(selected.created_at)} />
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => handleApprove(selected.id)} disabled={actionLoading} className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
                <CheckCircle2 className="mr-1 inline h-4 w-4" /> Approve
              </button>
              <button onClick={() => { setShowReject(true); }} className="flex-1 rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                <XCircle className="mr-1 inline h-4 w-4" /> Reject
              </button>
              <button onClick={() => setSelected(null)} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showReject && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4" onClick={() => setShowReject(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50"><AlertCircle className="h-5 w-5 text-red-600" /></div>
              <h3 className="text-lg font-semibold text-gray-900">Reject {selected.organization_name}?</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">Please provide a reason for rejection. The NGO will be notified.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              placeholder="e.g. Registration number could not be verified..."
              className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={handleReject} disabled={actionLoading || !rejectionReason.trim()} className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button onClick={() => { setShowReject(false); setRejectionReason(''); }} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
      <div><span className="text-xs text-gray-400">{label}: </span><span className="text-sm font-medium text-gray-900">{value}</span></div>
    </div>
  );
}
