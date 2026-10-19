import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface RouteInfo {
  path: string;
  pathname: string;
  params: Record<string, string>;
  query: Record<string, string>;
  state?: any;
}

interface RouterContextType {
  route: RouteInfo;
  navigate: (to: string, state?: any) => void;
  isActive: (path: string) => boolean;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parseUrl(url: string, state?: any): RouteInfo {
  // Support both full path and hash fallback if used
  let rawPath = url;
  if (!rawPath.startsWith('/') && !rawPath.startsWith('http')) {
    rawPath = '/' + rawPath;
  }

  const [pathAndQuery] = rawPath.split('#');
  const [pathname, queryString] = (pathAndQuery || '/').split('?');

  const query: Record<string, string> = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((val, key) => {
      query[key] = val;
    });
  }

  const params: Record<string, string> = {};
  const cleanPath = pathname || '/';

  // Check property details route: /property/:id
  const propMatch = cleanPath.match(/^\/property\/([^\/]+)\/?$/);
  if (propMatch) {
    params.id = propMatch[1];
  }

  return {
    path: rawPath,
    pathname: cleanPath,
    params,
    query,
    state,
  };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<RouteInfo>(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname + window.location.search;
      return parseUrl(initialPath);
    }
    return parseUrl('/');
  });

  const navigate = useCallback((to: string, state?: any) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(state, '', to);
      setRoute(parseUrl(to, state));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const fullPath = window.location.pathname + window.location.search;
      setRoute(parseUrl(fullPath, event.state));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isActive = useCallback(
    (targetPath: string) => {
      if (targetPath === '/' && route.pathname === '/') return true;
      if (targetPath !== '/' && route.pathname.startsWith(targetPath)) return true;
      return false;
    },
    [route.pathname]
  );

  return (
    <RouterContext.Provider value={{ route, navigate, isActive }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
