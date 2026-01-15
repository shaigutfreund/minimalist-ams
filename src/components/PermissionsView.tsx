'use client';

import { usePermissionsController } from '@/hooks/usePermissionsController';
import TempAccessManager from '@/components/TempAccessManager';
import GrantAccessModal from '@/components/GrantAccessModal';
import { PermissionRepo, PermissionUser } from '@/types/permissions';

interface PermissionsViewProps {
  repos: PermissionRepo[];
  users: PermissionUser[];
}

export default function PermissionsView({ repos, users }: PermissionsViewProps) {
  const controller = usePermissionsController();

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <header className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Temporary Grants</h1>
          <p className="text-sm text-slate-500 font-medium">Field-level authorizations</p>
        </div>
        
        <GrantAccessModal 
          open={controller.isModalOpen}
          onOpenChange={controller.setIsModalOpen}
          repos={repos} 
          users={users}
          onConfirm={controller.handleGrant}
        />
      </header>

      <TempAccessManager 
        permissions={controller.permissions}
        isLoading={controller.loading}
        onRevoke={controller.handleRevoke}
      />
    </main>
  );
}