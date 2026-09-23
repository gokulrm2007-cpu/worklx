import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  IndianRupee,
  Calendar,
  CheckCircle,
  Ban,
  TrendingUp,
  UserX,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'];

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTableTab, setActiveTableTab] = useState('USERS');

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/bookings'),
      ]);

      if (statsRes.data.success) setStatsData(statsRes.data);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (bookingsRes.data.success) setBookingsList(bookingsRes.data.bookings);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/block`);
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status');
    }
  };

  const handleVerifyWorker = async (userId) => {
    try {
      const res = await api.patch(`/admin/workers/${userId}/verify`);
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating verification');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Administrative Console..." fullScreen={true} />;
  }

  const stats = statsData?.stats || {};
  const charts = statsData?.charts || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            System Administrator Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
            WORKLX Platform Analytics
          </h1>
          <p className="text-xs text-gray-500">
            Platform health, customer registrations, technician verifications, and marketplace revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-gray-700">Marketplace Online</span>
        </div>
      </div>

      {/* 1. KEY PLATFORM STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Users</span>
          <p className="text-xl font-black text-gray-900">{stats.totalUsers || 9}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Seekers</span>
          <p className="text-xl font-black text-blue-600">{stats.totalSeekers || 3}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Workers</span>
          <p className="text-xl font-black text-emerald-600">{stats.totalWorkers || 6}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Bookings</span>
          <p className="text-xl font-black text-gray-900">{stats.totalBookings || 3}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Completed</span>
          <p className="text-xl font-black text-purple-600">{stats.completedBookings || 1}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Gross Revenue</span>
          <p className="text-xl font-black text-emerald-600">₹{stats.totalRevenue || 12500}</p>
        </div>
      </div>

      {/* 2. RECHARTS PLATFORM CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">User Registrations Growth</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="seekers" stroke="#2563eb" fill="#93c5fd" name="Seekers" />
                <Area type="monotone" dataKey="workers" stroke="#10b981" fill="#a7f3d0" name="Workers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Monthly Revenue Trend (₹)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Services Pie */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Service Categories Distribution</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.popularServices || []}
                  dataKey="bookings"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {(charts.popularServices || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. MANAGEMENT TABLES */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Tabs */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-2">
          <button
            onClick={() => setActiveTableTab('USERS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTableTab === 'USERS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border'
            }`}
          >
            User Management ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTableTab('BOOKINGS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTableTab === 'BOOKINGS' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border'
            }`}
          >
            All Marketplace Bookings ({bookingsList.length})
          </button>
        </div>

        {/* Users Table */}
        {activeTableTab === 'USERS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email / Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-gray-900">{u.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-gray-400">{u.phone}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700'
                            : u.role === 'WORKER'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{u.location || 'Salem'}</td>
                    <td className="p-4">
                      {u.isBlocked ? (
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                            u.isBlocked
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bookings Table */}
        {activeTableTab === 'BOOKINGS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookingsList.map((b) => {
                  const seeker = typeof b.seekerId === 'object' ? b.seekerId : {};
                  const worker = typeof b.workerId === 'object' ? b.workerId : {};
                  return (
                    <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-gray-900">
                        #{b._id?.substring(b._id.length - 6).toUpperCase()}
                      </td>
                      <td className="p-4 font-semibold text-gray-800">{seeker.name || 'Customer'}</td>
                      <td className="p-4 font-semibold text-gray-800">{worker.name || 'Worker'}</td>
                      <td className="p-4">{b.service}</td>
                      <td className="p-4 font-bold text-gray-900">₹{b.amount}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-800'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
