import { Link } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed, Truck, HeartHandshake, ShieldCheck, Clock, MapPin, Users, Leaf, ArrowDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50/60 to-white">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
              <Leaf className="h-4 w-4" />
              Join the food rescue movement
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Rescue Food.<br />
              <span className="text-green-600">Reduce Waste.</span><br />
              Feed Communities.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              FoodLink connects people and organizations with surplus food to verified NGOs
              that redistribute it to people in need. Together, we can bridge the gap between
              food waste and food insecurity.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate(profile ? `/${profile.role}/dashboard` : '/register')}
                className="group inline-flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                {profile ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '1.3B', label: 'Tonnes wasted yearly' },
              { value: '828M', label: 'People undernourished' },
              { value: '33%', label: 'Of food is wasted' },
              { value: '1/3', label: 'Of all food produced' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How FoodLink Works</h2>
            <p className="mt-3 text-lg text-gray-600">Three simple steps to reduce food waste and feed communities</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: UtensilsCrossed, title: '1. Share Surplus Food', desc: 'Donors list surplus food with pickup details, quantity, and freshness information in minutes.', color: 'from-green-500 to-emerald-600' },
              { icon: HeartHandshake, title: '2. NGO Claims Food', desc: 'Verified NGOs browse available donations nearby and claim the food they can collect and redistribute.', color: 'from-blue-500 to-indigo-600' },
              { icon: Truck, title: '3. Pickup & Redistribute', desc: 'NGOs collect the food and distribute it to people in need, completing the rescue cycle.', color: 'from-teal-500 to-cyan-600' },
            ].map((step) => (
              <div key={step.title} className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color}`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor Section */}
      <section className="bg-green-50/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">For Donors</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Turn your surplus into social impact</h2>
              <p className="mt-4 text-lg text-gray-600">
                Restaurants, event organizers, corporate cafeterias, and households can list
                surplus food in minutes. Track your donations, see your impact, and help feed
                those who need it most.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: Clock, text: 'List donations in under 2 minutes' },
                  { icon: MapPin, text: 'Set pickup windows and location' },
                  { icon: HeartHandshake, text: 'Track real-time claim and pickup status' },
                  { icon: Users, text: 'See your total meals donated and impact' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                      <item.icon className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
                Register as Donor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Wedding Reception Surplus</span>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Available</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">200 plates · Cooked Meals · Mumbai</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Conference Lunch Boxes</span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Claimed</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">120 boxes · Cooked Meals · Claimed by Hope Foundation</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Bakery Day-Old Bread</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Picked Up</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">60 loaves · Bakery · 120 meals rescued</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NGO Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 rounded-2xl bg-gradient-to-br from-gray-50 to-green-50/30 p-6 shadow-lg lg:order-1">
              <div className="space-y-3">
                {[
                  { name: 'Wedding Reception Surplus Meals', servings: '200 servings', city: 'Mumbai', dist: '2.3 km' },
                  { name: 'Corporate Event Sandwiches', servings: '150 servings', city: 'Mumbai', dist: '4.1 km' },
                  { name: 'Fresh Vegetables - Surplus Stock', servings: '60 servings', city: 'Pune', dist: '1.5 km' },
                ].map((d) => (
                  <div key={d.name} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4">
                    <div>
                      <p className="font-semibold text-gray-900">{d.name}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{d.servings} · {d.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{d.dist}</p>
                      <button className="mt-1 rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white">Claim</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">For NGOs</span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Find and collect food near you</h2>
              <p className="mt-4 text-lg text-gray-600">
                Verified NGOs can browse available food donations, filter by category and distance,
                and claim food for pickup. Coordinate directly with donors and track your collection
                history.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: MapPin, text: 'Search food by distance, category, and city' },
                  { icon: ShieldCheck, text: 'Verified organizations only — building trust' },
                  { icon: Truck, text: 'Get donor contact and pickup directions' },
                  { icon: Users, text: 'Track meals rescued and community impact' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 shadow-sm">
                      <item.icon className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
                Register as NGO <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Our Impact Together</h2>
            <p className="mt-3 text-lg text-gray-400">Every donation creates a ripple of change</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '10,000+', label: 'Meals Redistributed' },
              { value: '500+', label: 'Active Donors' },
              { value: '120+', label: 'Verified NGOs' },
              { value: '2.5T', label: 'Food Rescued' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-green-500">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 px-8 py-14 shadow-xl">
            <h2 className="text-3xl font-bold text-white">Ready to make a difference?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-green-50">
              Join FoodLink today and become part of a community dedicated to reducing food waste
              and feeding those in need.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register" className="rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-green-700 transition hover:bg-green-50">
                Sign Up Now
              </Link>
              <Link to="/login" className="rounded-xl border border-white/30 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-8">
        <ArrowDown className="h-5 w-5 animate-bounce text-gray-300" />
      </div>
    </div>
  );
}
