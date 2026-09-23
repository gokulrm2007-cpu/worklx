import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, User, Wrench } from 'lucide-react';

export default function InteractiveMap({
  workerLocation = { lat: 11.6643, lng: 78.1460 },
  serviceAddress = '14/B Fairlands Main Road, Salem, Tamil Nadu',
  workerName = 'Ravi Kumar',
  status = 'ON_THE_WAY',
}) {
  const [currentPos, setCurrentPos] = useState(workerLocation);
  const [eta, setEta] = useState(12); // minutes

  // Simulate smooth GPS movement towards service location
  useEffect(() => {
    if (status === 'ON_THE_WAY') {
      const interval = setInterval(() => {
        setCurrentPos((prev) => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.0005,
          lng: prev.lng + (Math.random() - 0.5) * 0.0005,
        }));
        setEta((prev) => (prev > 2 ? prev - 1 : 2));
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="relative w-full h-[380px] bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex flex-col justify-between p-4">
      {/* Map Vector Grid Simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Street Roads Simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%" className="w-full h-full">
          <path d="M 50 180 Q 200 120 400 200 T 800 160" fill="none" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" />
          <path d="M 220 50 L 220 350" fill="none" stroke="#93c5fd" strokeWidth="6" strokeDasharray="6,6" />
          <path d="M 500 50 L 500 350" fill="none" stroke="#93c5fd" strokeWidth="6" strokeDasharray="6,6" />
        </svg>
      </div>

      {/* Top Map HUD Status Overlay */}
      <div className="relative z-10 flex items-center justify-between bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            Live GPS Satellite Radar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-xs font-bold text-blue-600">
            ETA: ~{eta} Mins (3.2 km away)
          </span>
        </div>
      </div>

      {/* Animated Markers in Canvas space */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-around py-8">
        {/* Worker Live Location Marker */}
        <div className="flex flex-col items-center animate-bounce">
          <div className="relative px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-lg shadow-lg shadow-blue-500/30 flex items-center gap-1.5">
            <Wrench className="w-3 h-3" />
            {workerName}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45" />
          </div>
          <div className="w-9 h-9 bg-blue-600/30 rounded-full flex items-center justify-center mt-1 animate-pulse">
            <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow" />
          </div>
        </div>

        {/* Route Pulsing Dotted Line */}
        <div className="flex-1 max-w-[200px] border-b-2 border-dashed border-blue-400/80 mx-2 animate-pulse" />

        {/* Customer Destination Marker */}
        <div className="flex flex-col items-center">
          <div className="relative px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg shadow-lg shadow-emerald-500/30 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Your Address
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-600 rotate-45" />
          </div>
          <div className="w-9 h-9 bg-emerald-600/30 rounded-full flex items-center justify-center mt-1">
            <div className="w-5 h-5 bg-emerald-600 rounded-full border-2 border-white shadow" />
          </div>
        </div>
      </div>

      {/* Bottom Address Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-100 flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="truncate font-medium">{serviceAddress}</span>
        </div>
        <span className="text-[10px] text-gray-400 font-semibold uppercase shrink-0">
          GPS Coordinates: {currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
