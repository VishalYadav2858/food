import { UtensilsCrossed, HeartHandshake, Truck, ShieldCheck, MapPin, Bell, BarChart3, CheckCircle2 } from 'lucide-react';

export function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">How FoodLink Works</h1>
        <p className="mt-4 text-lg text-gray-600">A simple, efficient process to rescue food and feed communities.</p>
      </div>

      {/* Donor Flow */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">For Donors</h2>
        <div className="mt-6 space-y-4">
          {[
            { icon: UtensilsCrossed, title: 'Create a Donation', desc: 'Fill out the donation form with food details, quantity, servings, pickup window, and location. It takes less than 2 minutes.' },
            { icon: Bell, title: 'Get Notified When Claimed', desc: 'When a verified NGO claims your donation, you receive an instant in-app notification with their details.' },
            { icon: Truck, title: 'Coordinate Pickup', desc: 'The claiming NGO will contact you and arrange pickup within your specified time window.' },
            { icon: BarChart3, title: 'Track Your Impact', desc: 'See your total meals donated, food rescued, and the impact you have made over time on your dashboard.' },
          ].map((step, i) => (
            <div key={step.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-50">
                <step.icon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Step {i + 1}: {step.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NGO Flow */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">For NGOs</h2>
        <div className="mt-6 space-y-4">
          {[
            { icon: ShieldCheck, title: 'Get Verified', desc: 'Register your NGO with organization details and registration number. Our admin team verifies your organization before you can claim food.' },
            { icon: MapPin, title: 'Find Food Nearby', desc: 'Browse available donations filtered by distance, category, food type, and pickup deadline. Find the food that suits your needs.' },
            { icon: HeartHandshake, title: 'Claim Food', desc: 'When you find suitable food, claim it with one click. The donation is reserved for you, preventing other NGOs from claiming it.' },
            { icon: Truck, title: 'Pick Up & Distribute', desc: 'Contact the donor, get directions to the pickup location, collect the food, and mark it as picked up. Then distribute it to those in need.' },
          ].map((step, i) => (
            <div key={step.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <step.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Step {i + 1}: {step.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="mt-12 rounded-2xl bg-green-50/50 p-8">
        <h2 className="text-2xl font-semibold text-gray-900">Key Features</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            'Real-time notifications for donations, claims, and pickups',
            'Atomic claim system prevents double-claiming',
            'Role-based access for donors, NGOs, and admins',
            'Location-based food discovery with distance sorting',
            'Impact analytics and dashboard statistics',
            'Admin verification system for NGO trust',
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
