'use client';

import { useState, useTransition } from 'react';
import { toggleOrganizationStatus, addOrganization } from './actions';

type Organization = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
};

export default function TenantList({ initialOrganizations }: { initialOrganizations: Organization[] }) {
  const [isPending, startTransition] = useTransition();
  const [organizations, setOrganizations] = useState(initialOrganizations);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      // Optimistic update
      setOrganizations((orgs) => 
        orgs.map((o) => o.id === id ? { ...o, isActive: !currentStatus } : o)
      );
      try {
        await toggleOrganizationStatus(id, !currentStatus);
      } catch (error) {
        // Revert on error
        setOrganizations(initialOrganizations);
      }
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSlug) return;
    
    setIsAdding(true);
    try {
      const newOrg = await addOrganization({ name: newName, slug: newSlug });
      setOrganizations([newOrg, ...organizations]);
      setNewName('');
      setNewSlug('');
    } catch (error) {
      console.error('Failed to add organization', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
            <input 
              type="text" 
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Atlanta Pickleball"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (Subdomain)</label>
            <input 
              type="text" 
              required
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. atlanta"
            />
          </div>
          <button 
            type="submit" 
            disabled={isAdding}
            className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Add Tenant'}
          </button>
        </form>
      </div>

      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Tenant Name</th>
            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Slug</th>
            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Created At</th>
            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
            <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {organizations.map((org) => (
            <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-slate-900 font-medium">{org.name}</td>
              <td className="px-6 py-4 text-slate-500 font-mono text-sm">{org.slug}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{new Date(org.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${org.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {org.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleToggle(org.id, org.isActive)}
                  disabled={isPending}
                  className={`text-sm font-medium ${org.isActive ? 'text-rose-600 hover:text-rose-700' : 'text-emerald-600 hover:text-emerald-700'} disabled:opacity-50`}
                >
                  {org.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
          {organizations.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                No tenants found. Add one above to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
