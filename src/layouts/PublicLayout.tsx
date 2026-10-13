import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

export function PublicLayout({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardLink = profile
    ? `/${profile.role}/dashboard`
    : '/login';

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">Home</Link>
            <Link to="/about" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">About</Link>
            <Link to="/how-it-works" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">How It Works</Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {profile ? (
              <button
                onClick={() => navigate(dashboardLink)}
                className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">
                  Sign In
                </Link>
                <Link to="/register" className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                  Get Started
                </Link>
              </>
            )}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
            {mobileOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-600">Home</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-600">About</Link>
              <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-600">How It Works</Link>
              {profile ? (
                <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="rounded-lg bg-green-600 px-5 py-2 text-center text-sm font-semibold text-white">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg border border-gray-200 px-5 py-2 text-center text-sm font-semibold text-gray-700">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-lg bg-green-600 px-5 py-2 text-center text-sm font-semibold text-white">Get Started</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-3 text-sm text-gray-500">Rescue Food. Reduce Waste. Feed Communities.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Platform</h4>
              <ul className="mt-3 space-y-2">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Home</Link></li>
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link></li>
                <li><Link to="/how-it-works" className="text-sm text-gray-500 hover:text-gray-900">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Get Started</h4>
              <ul className="mt-3 space-y-2">
                <li><Link to="/register" className="text-sm text-gray-500 hover:text-gray-900">Register as Donor</Link></li>
                <li><Link to="/register" className="text-sm text-gray-500 hover:text-gray-900">Register as NGO</Link></li>
                <li><Link to="/login" className="text-sm text-gray-500 hover:text-gray-900">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Mission</h4>
              <p className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                <Heart className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                Connecting surplus food with those who need it most.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-400">© 2026 FoodLink. Built for social impact.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
