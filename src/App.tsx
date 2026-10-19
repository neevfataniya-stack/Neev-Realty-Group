/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { EnquiryModalProvider } from './context/EnquiryModalContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetails } from './pages/PropertyDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { SiteVisit } from './pages/SiteVisit';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

function AppContent() {
  const { route } = useRouter();

  const renderCurrentPage = () => {
    const { pathname, params } = route;

    if (pathname === '/' || pathname === '') {
      return <Home />;
    }

    if (pathname === '/properties') {
      return <Properties />;
    }

    if (pathname.startsWith('/property/') && params.id) {
      return <PropertyDetails />;
    }

    if (pathname === '/about') {
      return <About />;
    }

    if (pathname === '/contact') {
      return <Contact />;
    }

    if (pathname === '/site-visit') {
      return <SiteVisit />;
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return <AdminDashboard />;
    }

    return <NotFound />;
  };

  const isAdminRoute = route.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B53] font-sans">
      <Header />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <EnquiryModalProvider>
        <AppContent />
      </EnquiryModalProvider>
    </RouterProvider>
  );
}
