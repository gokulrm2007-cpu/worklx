import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wrench, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Get Started with WORKLX
          </span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-3">
            Choose How You Want to Use WORKLX
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Select your account type to access tailored services, dashboard controls, and real-time features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Card 1: Customer / Seeker */}
          <div
            onClick={() => navigate('/register?role=SEEKER')}
            className="group bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-blue-600 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shadow-sm transition-colors mb-6">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                I Need a Service (Customer)
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Find certified electricians, plumbers, painters, and carpenters near you with verified reviews and instant booking.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Compare verified technicians</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Secure Razorpay escrow payments</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Live GPS on-the-way tracking</li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-blue-600">
              <span>Sign up as Customer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Skilled Worker */}
          <div
            onClick={() => navigate('/register?role=WORKER')}
            className="group bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-blue-600 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center shadow-sm transition-colors mb-6">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                I am a Skilled Worker
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                List your technical skills, set your visit charges, receive booking requests, and grow your local customer base.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Set your own visiting fees</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Direct booking notifications</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Weekly &amp; monthly earnings analytics</li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-emerald-600">
              <span>Join as Service Partner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
