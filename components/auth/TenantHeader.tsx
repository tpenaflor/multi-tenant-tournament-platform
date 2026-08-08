'use client';

import React, { useState, useRef, useEffect } from 'react';
import LoginForm from './LoginForm';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface TenantHeaderProps {
  tenantName: string;
  tenantSlug: string;
  logoUrl?: string;
  user?: any;
}

export default function TenantHeader({ tenantName, tenantSlug, logoUrl, user }: TenantHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-tenant-bg/90 backdrop-blur-md border-b border-tenant-primary/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-slate-800 flex items-center justify-center">
              <img src={logoUrl} alt={`${tenantName} logo`} className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <h1 className="text-xl font-bold text-tenant-text tracking-tight">{tenantName}</h1>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="px-4 py-2 bg-tenant-primary/10 hover:bg-tenant-primary/20 text-tenant-primary rounded-lg text-sm font-bold transition-colors border border-tenant-primary/30 disabled:opacity-50"
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 bg-tenant-primary hover:bg-tenant-primary/90 text-white rounded-lg text-sm font-bold transition-colors shadow-md shadow-tenant-primary/20"
            >
              Sign In
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-tenant-bg border border-tenant-primary/30 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-tenant-text mb-1">Welcome Back</h3>
                  <p className="text-xs text-tenant-text/70">Sign in to your {tenantName} account</p>
                </div>
                <LoginForm tenantSlug={tenantSlug} />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
