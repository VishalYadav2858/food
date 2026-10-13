import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Logo size="lg" />
      <h1 className="mt-12 text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-600">Oops! The page you're looking for doesn't exist.</p>
      <p className="mt-2 text-sm text-gray-500">It may have been moved or deleted.</p>
      <Link to="/" className="mt-8 flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
