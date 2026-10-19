import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { Search } from 'lucide-react';

interface PropertySearchProps {
  placeholder?: string;
  className?: string;
}

export function PropertySearch({
  placeholder = 'Search by locality (e.g. Vesu, Adajan) or property title...',
  className = '',
}: PropertySearchProps) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/properties?keyword=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-slate-300 bg-white hover:border-[#2698E8] focus:border-[#2698E8] focus:ring-1 focus:ring-[#2698E8] text-xs text-[#243B53] outline-none transition-colors"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#2698E8] hover:bg-[#1d82c9] transition-colors"
      >
        Search
      </button>
    </form>
  );
}
