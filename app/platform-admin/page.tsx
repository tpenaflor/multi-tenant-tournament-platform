import { getOrganizations } from './actions';
import TenantList from './TenantList';

export default async function PlatformAdminPage() {
  const organizations = await getOrganizations();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Tenants</h2>
        <p className="text-slate-500 mt-1">Manage all organizations (tenants) on the platform.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <TenantList initialOrganizations={organizations} />
      </div>
    </div>
  );
}
