// app/admin/dashboard/page.tsx
import SecurityWidget from '@/components/dashboard/SecurityWidget';
import JurisdictionUsersTable from '@/components/dashboard/JurisdictionUsersTable';

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-slate-900">Command Dashboard</h1>
          <p className="text-slate-500">Managing unit jurisdiction and active repository permissions.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: User Management */}
          <div className="lg:col-span-2 space-y-6">
             <JurisdictionUsersTable />
          </div>

          {/* Sidebar: Security Audit */}
          <div className="lg:col-span-1">
            <SecurityWidget />
          </div>
        </div>
      </div>
    </main>
  );
}