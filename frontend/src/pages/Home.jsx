import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Zap,
  Droplet,
  Paintbrush,
  Hammer,
  BrickWall,
  Wind,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import api from '../services/api';
import WorkerCard from '../components/WorkerCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryIcons = {
  Electrician: Zap,
  Plumber: Droplet,
  Painter: Paintbrush,
  Carpenter: Hammer,
  Mason: BrickWall,
  'AC Repair': Wind,
};

export default function Home() {
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Salem');
  const [categories, setCategories] = useState([]);
  const [topWorkers, setTopWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, workerRes] = await Promise.all([
          api.get('/workers/categories/all'),
          api.get('/workers?minRating=4.8'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (workerRes.data.success) setTopWorkers(workerRes.data.workers.slice(0, 3));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?category=${encodeURIComponent(serviceQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-gray-50 pt-16 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            India's #1 Worker Marketplace
          </div>

          {/* Hero Headline & Subtext */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Hire Trusted <span className="text-blue-600">Skilled Workers</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-4 font-normal">
            Find reliable professionals for your everyday service needs. Background verified, upfront transparent pricing, and guaranteed on-time service.
          </p>

          {/* Search Bar Container */}
          <div className="max-w-3xl mx-auto mt-8 bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              {/* Service Input */}
              <div className="flex-1 w-full relative flex items-center">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  placeholder="What service do you need? (e.g. Electrician, Plumber)"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Location Input */}
              <div className="w-full sm:w-56 relative flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Salem, Tamil Nadu"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Verified Workers</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> Under 30 Mins Arrival</span>
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-purple-500" /> Secure Escrow Payments</span>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Explore Services</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Popular Service Categories
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            Browse All Categories <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const IconComp = categoryIcons[cat.name] || Zap;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
                className="group bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-blue-500 cursor-pointer transition-all text-center flex flex-col items-center justify-between"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm mb-3">
                  <IconComp className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    From ₹{cat.averagePrice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TOP RATED / POPULAR WORKERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Verified Pros</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Top-Rated Skilled Workers Near You
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            View All Verified Workers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching verified workers..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topWorkers.map((worker, idx) => (
              <WorkerCard key={idx} worker={worker} />
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW WORKLX WORKS */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Simple &amp; Transparent</span>
            <h2 className="text-3xl font-black tracking-tight mt-1 text-white">
              How WORKLX Works
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Book a certified technician in 4 easy steps from your phone or laptop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Find &amp; Compare</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Search electricians, plumbers, or AC technicians by skill, visiting price, distance, and customer reviews.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Book Schedule</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your preferred date, time slot, and location. Add description or upload photos of the repair needed.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Track &amp; Chat</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Communicate directly via real-time Socket.io chat and track the worker’s live GPS arrival on the interactive map.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Pay &amp; Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay safely via Razorpay upon completion and rate your technician to help your local community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST & SECURITY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">The WORKLX Guarantee</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Are you a skilled technician or contractor?
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Join WORKLX as a verified service partner. Get daily customer jobs, set your own visiting prices, and build your digital reputation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/role-selection"
              className="px-6 py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-2xl shadow-lg transition-all text-center"
            >
              Join as Worker Partner
            </Link>
            <Link
              to="/search"
              className="px-6 py-3.5 bg-blue-800/50 hover:bg-blue-800 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all text-center"
            >
              Hire a Worker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
