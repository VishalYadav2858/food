import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Package, Leaf, Drumstick } from 'lucide-react';
import type { Donation } from '@/types';
import { DonationStatusBadge } from '@/components/ui/StatusBadge';
import { formatDateTime, formatDistance, calculateDistance } from '@/utils/format';

interface DonationCardProps {
  donation: Donation;
  linkTo: string;
  showDistance?: boolean;
  userLat?: number;
  userLng?: number;
  action?: React.ReactNode;
}

export function DonationCard({ donation, linkTo, showDistance, userLat, userLng, action }: DonationCardProps) {
  const distance = showDistance && userLat && userLng && donation.latitude && donation.longitude
    ? calculateDistance(userLat, userLng, donation.latitude, donation.longitude)
    : null;

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link to={linkTo} className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {donation.is_vegetarian ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                <Leaf className="h-3 w-3" /> Veg
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                <Drumstick className="h-3 w-3" /> Non-Veg
              </span>
            )}
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {donation.category}
            </span>
          </div>
          <h3 className="mt-2 truncate text-base font-semibold text-gray-900 group-hover:text-green-600">
            {donation.title}
          </h3>
        </Link>
        <DonationStatusBadge status={donation.status} />
      </div>

      {donation.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{donation.description}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Package className="h-4 w-4 text-gray-400" />
          <span>{donation.quantity} {donation.unit}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Users className="h-4 w-4 text-gray-400" />
          <span>{donation.servings} servings</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="truncate">{formatDateTime(donation.pickup_start)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            {donation.city}
            {distance !== null && ` · ${formatDistance(distance)}`}
          </span>
        </div>
      </div>

      {(donation.claimer || donation.donor) && (
        <div className="mt-4 border-t border-gray-50 pt-3">
          {donation.claimer && (
            <p className="text-xs text-gray-500">
              Claimed by: <span className="font-medium text-gray-700">{donation.claimer.organization_name || donation.claimer.name}</span>
            </p>
          )}
          {donation.donor && !donation.claimer && (
            <p className="text-xs text-gray-500">
              Donor: <span className="font-medium text-gray-700">{donation.donor.name}</span>
            </p>
          )}
        </div>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
