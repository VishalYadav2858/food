import { Navigation } from 'lucide-react';

interface MapViewProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
  city?: string;
}

export function MapView({ latitude, longitude, address, city }: MapViewProps) {
  const hasCoords = latitude !== null && longitude !== null;
  const directionsUrl = hasCoords
    ? `https://www.openstreetmap.org/directions?from=&to=${latitude}%2C${longitude}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${address}, ${city || ''}`)}`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      {hasCoords ? (
        <iframe
          title="Pickup Location Map"
          width="100%"
          height="300"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude! - 0.01}%2C${latitude! - 0.01}%2C${longitude! + 0.01}%2C${latitude! + 0.01}&marker=${latitude}%2C${longitude}`}
          className="border-0"
        />
      ) : (
        <div className="flex h-[300px] items-center justify-center bg-gray-50 text-center">
          <div>
            <p className="text-sm text-gray-500">Map coordinates not available</p>
            <p className="mt-1 text-xs text-gray-400">{address}{city && `, ${city}`}</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{address}</p>
          {city && <p className="text-xs text-gray-500">{city}</p>}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
        >
          <Navigation className="h-3.5 w-3.5" />
          Get Directions
        </a>
      </div>
    </div>
  );
}
