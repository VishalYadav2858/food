import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      {/* Left panel - branding */}
      <div className="relative hidden flex-1 flex-col justify-between bg-gradient-to-br from-green-600 to-emerald-800 p-12 text-white lg:flex">
        <Logo size="lg" light />
        <div>
          <h2 className="text-3xl font-bold leading-tight">Rescue Food.<br />Reduce Waste.<br />Feed Communities.</h2>
          <p className="mt-4 max-w-md text-green-100">
            Join the FoodLink platform to connect surplus food with verified NGOs
            and make a real difference in your community.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '10K+', label: 'Meals saved' },
              { value: '500+', label: 'Donors' },
              { value: '120+', label: 'NGOs' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-green-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-green-200">© 2026 FoodLink. Built for social impact.</p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
