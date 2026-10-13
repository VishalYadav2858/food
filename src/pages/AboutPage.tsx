import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, Truck, ShieldCheck } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">About FoodLink</h1>
        <p className="mt-4 text-lg text-gray-600">
          We bridge the gap between food surplus and food insecurity.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
          </div>
          <p className="mt-4 text-gray-600">
            Every day, millions of tonnes of perfectly good food is wasted while millions of people
            go hungry. FoodLink exists to solve this paradox. We provide a simple, technology-driven
            platform that connects those who have surplus food with organizations that can redistribute
            it to people who need it most.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
          </div>
          <p className="mt-4 text-gray-600">
            A world where no edible food goes to waste and no person goes to bed hungry. We envision
            communities where surplus food is viewed as a resource, not waste, and where technology
            enables efficient, real-time food redistribution.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Heart, title: 'Compassion', desc: 'Every meal matters. We approach food rescue with empathy and urgency.' },
            { icon: ShieldCheck, title: 'Trust & Safety', desc: 'Verified NGOs, secure data, and transparent processes build community trust.' },
            { icon: Users, title: 'Community', desc: 'We connect donors, NGOs, and beneficiaries in a shared mission.' },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <v.icon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{v.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-center text-white shadow-lg">
          <Truck className="mx-auto h-10 w-10" />
          <h2 className="mt-4 text-2xl font-bold">Join the movement</h2>
          <p className="mt-2 text-green-50">Be part of the solution. Start rescuing food today.</p>
          <Link to="/register" className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
