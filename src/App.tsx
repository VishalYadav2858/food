import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

// Public pages
import { PublicLayout } from '@/layouts/PublicLayout';
import { LandingPage } from '@/pages/LandingPage';
import { AboutPage } from '@/pages/AboutPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Donor pages
import { DonorDashboard } from '@/pages/donor/DonorDashboard';
import { DonorDonations } from '@/pages/donor/DonorDonations';
import { CreateDonation } from '@/pages/donor/CreateDonation';
import { DonationDetail } from '@/pages/donor/DonationDetail';
import { EditDonation } from '@/pages/donor/EditDonation';
import { DonorHistory } from '@/pages/donor/DonorHistory';

// NGO pages
import { NgoDashboard } from '@/pages/ngo/NgoDashboard';
import { FindFood } from '@/pages/ngo/FindFood';
import { FoodDetail } from '@/pages/ngo/FoodDetail';
import { NgoClaims } from '@/pages/ngo/NgoClaims';
import { NgoHistory } from '@/pages/ngo/NgoHistory';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminNgos } from '@/pages/admin/AdminNgos';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminDonations } from '@/pages/admin/AdminDonations';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminReports } from '@/pages/admin/AdminReports';
import { AdminSettings } from '@/pages/admin/AdminSettings';

// Shared pages
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { LayoutDashboard, Package, Plus, History, User, Search } from 'lucide-react';

const donorNav = [
  { label: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
  { label: 'My Donations', path: '/donor/donations', icon: Package },
  { label: 'Create Donation', path: '/donor/donations/new', icon: Plus },
  { label: 'Donation History', path: '/donor/history', icon: History },
  { label: 'Profile', path: '/donor/profile', icon: User },
];

const ngoNav = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'Find Food', path: '/ngo/food', icon: Search },
  { label: 'My Claims', path: '/ngo/claims', icon: Package },
  { label: 'History', path: '/ngo/history', icon: History },
  { label: 'Profile', path: '/ngo/profile', icon: User },
];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Donor routes */}
          <Route path="/donor/dashboard" element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/donations" element={<ProtectedRoute allowedRoles={['donor']}><DonorDonations /></ProtectedRoute>} />
          <Route path="/donor/donations/new" element={<ProtectedRoute allowedRoles={['donor']}><CreateDonation /></ProtectedRoute>} />
          <Route path="/donor/donations/:id" element={<ProtectedRoute allowedRoles={['donor']}><DonationDetail /></ProtectedRoute>} />
          <Route path="/donor/donations/:id/edit" element={<ProtectedRoute allowedRoles={['donor']}><EditDonation /></ProtectedRoute>} />
          <Route path="/donor/history" element={<ProtectedRoute allowedRoles={['donor']}><DonorHistory /></ProtectedRoute>} />
          <Route path="/donor/profile" element={<ProtectedRoute allowedRoles={['donor']}><ProfilePage role="donor" navItems={donorNav} roleLabel="Donor" /></ProtectedRoute>} />

          {/* NGO routes */}
          <Route path="/ngo/dashboard" element={<ProtectedRoute allowedRoles={['ngo']}><NgoDashboard /></ProtectedRoute>} />
          <Route path="/ngo/food" element={<ProtectedRoute allowedRoles={['ngo']}><FindFood /></ProtectedRoute>} />
          <Route path="/ngo/food/:id" element={<ProtectedRoute allowedRoles={['ngo']}><FoodDetail /></ProtectedRoute>} />
          <Route path="/ngo/claims" element={<ProtectedRoute allowedRoles={['ngo']}><NgoClaims /></ProtectedRoute>} />
          <Route path="/ngo/history" element={<ProtectedRoute allowedRoles={['ngo']}><NgoHistory /></ProtectedRoute>} />
          <Route path="/ngo/profile" element={<ProtectedRoute allowedRoles={['ngo']}><ProfilePage role="ngo" navItems={ngoNav} roleLabel="NGO" /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/ngos" element={<ProtectedRoute allowedRoles={['admin']}><AdminNgos /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/donations" element={<ProtectedRoute allowedRoles={['admin']}><AdminDonations /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
