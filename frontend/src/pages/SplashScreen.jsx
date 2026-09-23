import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate('/');
        } else {
          navigate('/home');
        }
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-950 flex flex-col items-center justify-between p-6 text-white text-center select-none">
      <div className="w-full" />

      {/* Center Hero Animation */}
      <div className="flex flex-col items-center max-w-sm space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-bounce">
            <Wrench className="w-12 h-12 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center ring-4 ring-blue-700">
            <Shield className="w-3.5 h-3.5 text-blue-900 fill-blue-900" />
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            WORK<span className="text-blue-300">LX</span>
          </h1>
          <p className="text-sm font-semibold tracking-widest text-blue-200 uppercase mt-1">
            Hire Trusted Skilled Workers
          </p>
        </div>

        <p className="text-xs text-blue-100/80 leading-relaxed max-w-xs">
          Connect with certified electricians, plumbers, painters, carpenters, masons, and AC technicians in your city.
        </p>

        {/* Loading Spinner Bar */}
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: '80%' }} />
        </div>
      </div>

      {/* Bottom Features */}
      <div className="flex items-center gap-6 text-[11px] font-medium text-blue-200/70 pb-4">
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Insured</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct Chat</span>
      </div>
    </div>
  );
}
