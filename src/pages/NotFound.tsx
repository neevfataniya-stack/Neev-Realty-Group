import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Home, Search, ArrowRight, Building2 } from 'lucide-react';

export function NotFound() {
  const { navigate, route } = useRouter();

  return (
    <div className="bg-[#F3F6F9] min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#DFF1FF] text-[#2698E8] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-[#2698E8] tracking-widest uppercase">
          Error 404
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight mt-1 mb-2">
          Page Not Found
        </h1>

        <p className="text-xs text-[#627D98] leading-relaxed mb-6">
          The requested page <code className="text-[#243B53] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px]">{route.pathname}</code> does not exist or has been relocated.
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-lg text-xs font-bold text-white bg-[#102A43] hover:bg-[#243B53] shadow transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="w-full py-3 px-4 rounded-lg text-xs font-bold text-white bg-[#2698E8] hover:bg-[#1d82c9] shadow transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Explore Properties</span>
          </button>
        </div>
      </div>
    </div>
  );
}
