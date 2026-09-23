import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, CheckCircle2, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                WORK<span className="text-blue-500">LX</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's premier worker hiring marketplace. Find, compare, book, and hire trusted skilled technicians for all home &amp; commercial needs.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              100% Background Verified Workers
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Popular Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search?category=Electrician" className="hover:text-blue-400 transition-colors">
                  Electrician &amp; Wiring
                </Link>
              </li>
              <li>
                <Link to="/search?category=Plumber" className="hover:text-blue-400 transition-colors">
                  Plumbing &amp; Leakage
                </Link>
              </li>
              <li>
                <Link to="/search?category=AC Repair" className="hover:text-blue-400 transition-colors">
                  AC Servicing &amp; Repair
                </Link>
              </li>
              <li>
                <Link to="/search?category=Painter" className="hover:text-blue-400 transition-colors">
                  House Painting &amp; Textures
                </Link>
              </li>
              <li>
                <Link to="/search?category=Carpenter" className="hover:text-blue-400 transition-colors">
                  Carpentry &amp; Furniture
                </Link>
              </li>
              <li>
                <Link to="/search?category=Mason" className="hover:text-blue-400 transition-colors">
                  Masonry &amp; Tiling
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search" className="hover:text-blue-400 transition-colors">
                  Find Workers
                </Link>
              </li>
              <li>
                <Link to="/role-selection" className="hover:text-blue-400 transition-colors">
                  Join as a Service Partner
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-blue-400 transition-colors">
                  Track Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Customer &amp; Worker Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Coverage */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Support &amp; Location</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Salem, Coimbatore, Chennai &amp; Tamil Nadu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98401 12233 / 1800-WORKLX</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@worklx.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WORKLX Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
