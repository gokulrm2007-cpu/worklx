import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-600 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2.5 py-8 text-gray-500">
      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}
