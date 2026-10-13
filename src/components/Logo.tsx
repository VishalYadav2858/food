import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export function Logo({ size = 'md', showText = true, light = false }: LogoProps) {
  const iconSizes = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-12 w-12' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
  const iconInner = { sm: 'h-3.5 w-3.5', md: 'h-4.5 w-4.5', lg: 'h-6 w-6' };

  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className={`${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm`}>
        <UtensilsCrossed className={`${iconInner[size]} text-white`} />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
          Food<span className="text-green-600">Link</span>
        </span>
      )}
    </Link>
  );
}
