import React from 'react';
import { useRouter } from '../context/RouterContext';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { navigate } = useRouter();

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1 text-xs text-[#627D98]">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li className="flex items-center gap-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 hover:text-[#102A43] transition-colors focus:outline-none focus:underline"
          >
            <Home className="w-3.5 h-3.5 text-[#2698E8]" />
            <span>Home</span>
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              {isLast || !item.path ? (
                <span className="font-semibold text-[#243B53] line-clamp-1 max-w-[240px] sm:max-w-md" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => navigate(item.path!)}
                  className="hover:text-[#102A43] transition-colors focus:outline-none focus:underline whitespace-nowrap"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
