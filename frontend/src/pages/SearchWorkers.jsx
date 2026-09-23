import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  IndianRupee,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import api from '../services/api';
import WorkerCard from '../components/WorkerCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['All', 'Electrician', 'Plumber', 'Painter', 'Carpenter', 'Mason', 'AC Repair'];

export default function SearchWorkers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minRating, setMinRating] = useState('');
  const [maxPrice, setMaxPrice] = useState('1000');
  const [availability, setAvailability] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (location) params.append('location', location);
      if (minRating) params.append('minRating', minRating);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (availability) params.append('availability', availability);
      if (verifiedOnly) params.append('verified', 'true');

      const res = await api.get(`/workers?${params.toString()}`);
      if (res.data.success) {
        setWorkers(res.data.workers);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [selectedCategory, minRating, maxPrice, availability, verifiedOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setLocation('');
    setMinRating('');
    setMaxPrice('1000');
    setAvailability('');
    setVerifiedOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Find Skilled Workers &amp; Technicians
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing {workers.length} verified service professionals ready for hire.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl border border-blue-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {mobileFilterOpen ? 'Close Filters' : 'Filter Workers'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* SIDEBAR FILTERS (Desktop & Mobile Drawer) */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } md:block bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 sticky top-24`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filter By
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* 1. Category Pill / Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Service Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Location Search */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Location / City
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchWorkers()}
                placeholder="Salem, Coimbatore..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Maximum Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Max Visiting Fee
              </label>
              <span className="text-xs font-extrabold text-blue-600">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>₹300</span>
              <span>₹1500</span>
            </div>
          </div>

          {/* 4. Minimum Rating */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              {[
                { label: 'Any', val: '' },
                { label: '★ 4.5+', val: '4.5' },
                { label: '★ 4.8+', val: '4.8' },
              ].map((r) => (
                <button
                  key={r.label}
                  onClick={() => setMinRating(r.val)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    minRating === r.val
                      ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Verified Only Checkbox */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-700 select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Verified Workers Only
              </span>
            </label>
          </div>
        </aside>

        {/* WORKER CARDS GRID */}
        <main className="md:col-span-3">
          {loading ? (
            <LoadingSpinner text="Searching skilled workers..." fullScreen={false} />
          ) : workers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Workers Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No technicians matched your current search filters. Try clearing some filters or changing your city location.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <WorkerCard key={worker._id} worker={worker} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
