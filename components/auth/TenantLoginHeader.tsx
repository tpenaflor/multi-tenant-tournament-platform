'use client';

import React, { useState, useRef, useEffect } from 'react';
import LoginForm from './LoginForm';

interface TenantLoginHeaderProps {
  tenantName: string;
  tenantSlug: string;
}

export default function TenantLoginHeader({ tenantName, tenantSlug }: TenantLoginHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white tracking-tight">{tenantName}</h1>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
          >
            Sign In
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Welcome Back</h3>
                <p className="text-xs text-slate-400">Sign in to your {tenantName} account</p>
              </div>
              <LoginForm tenantSlug={tenantSlug} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
