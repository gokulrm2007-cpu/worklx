import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SearchWorkers from './pages/SearchWorkers';
import WorkerProfile from './pages/WorkerProfile';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Tracking from './pages/Tracking';
import Chat from './pages/Chat';
import Reviews from './pages/Reviews';
import BookingHistory from './pages/BookingHistory';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSettings from './pages/ProfileSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const hideHeaderFooter = ['/splash', '/login', '/register', '/role-selection', '/forgot-password'].includes(location.pathname) ||
    location.pathname.startsWith('/reset-password');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      <ScrollToTop />
      
      {!hideHeaderFooter && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/workers" element={<SearchWorkers />} />
          <Route path="/workers/:id" element={<WorkerProfile />} />

          {/* Protected Routes (All Authenticated Users) */}
          <Route path="/booking/:workerId" element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } />

          <Route path="/payment/:bookingId" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />

          <Route path="/tracking/:bookingId" element={
            <ProtectedRoute>
              <Tracking />
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />

          <Route path="/chat/:bookingId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />

          <Route path="/reviews/:workerId" element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          } />

          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />

          {/* Role-Specific Protected Routes */}
          <Route path="/worker-dashboard" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <WorkerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-3xl mb-4">404</div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
              <p className="text-slate-500 mb-6 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
              <a href="/" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all">Return to Home</a>
            </div>
          } />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
