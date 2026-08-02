'use client';

import React, { useState } from 'react';
import { MenuIcon, XIcon } from '@/components/ui/icons';
import { logout } from '@/app/login/actions';

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold tracking-tight text-white">Tenant Dashboard</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <a href="/builder" className="text-sky-400 hover:text-sky-300 transition-colors">Home Page Builder</a>
          <span className="text-slate-500">|</span>
          <a href="/settings" className="text-slate-300 hover:text-white transition-colors">Settings</a>
          <form action={logout}>
             <button type="submit" className="text-rose-400 hover:text-rose-300 transition-colors ml-4">
                Logout
             </button>
          </form>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-2 shadow-xl absolute w-full z-40 top-[73px]">
          <a
            href="/builder"
            className="block p-3 rounded-lg hover:bg-slate-800 text-sky-400 text-sm font-medium transition-colors"
          >
            Home Page Builder
          </a>
          <a
            href="/settings"
            className="block p-3 rounded-lg hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
          >
            Settings
          </a>
          <form action={logout}>
             <button type="submit" className="w-full text-left p-3 rounded-lg hover:bg-slate-800 text-rose-400 text-sm font-medium transition-colors">
                Logout
             </button>
          </form>
        </div>
      )}
    </>
  );
}
