import type { DonationStatus, VerificationStatus } from '@/types';

const donationStatusConfig: Record<DonationStatus, { label: string; classes: string; dot: string }> = {
  AVAILABLE: { label: 'Available', classes: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  CLAIMED: { label: 'Claimed', classes: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  PICKED_UP: { label: 'Picked Up', classes: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-600' },
  EXPIRED: { label: 'Expired', classes: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const verificationStatusConfig: Record<VerificationStatus, { label: string; classes: string }> = {
  pending: { label: 'Pending', classes: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Approved', classes: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', classes: 'bg-red-100 text-red-700' },
};

export function DonationStatusBadge({ status }: { status: DonationStatus }) {
  const config = donationStatusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const config = verificationStatusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}>
      {config.label}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const config: Record<string, string> = {
    donor: 'bg-teal-100 text-teal-700',
    ngo: 'bg-indigo-100 text-indigo-700',
    admin: 'bg-slate-200 text-slate-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${config[role] || config.donor}`}>
      {role}
    </span>
  );
}
