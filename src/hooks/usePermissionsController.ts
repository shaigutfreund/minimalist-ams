import { useState } from 'react';
import { useTempPermissions } from '@/hooks/useTempPermissions';
import { GrantPermissionInput } from '@/types/permissions';

export function usePermissionsController() {
  const { grantPermission, revokePermission, loading, permissions } = useTempPermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGrant = async (input: GrantPermissionInput) => {
    const { error } = await grantPermission(input);
    if (!error) {
      setIsModalOpen(false);
      return { success: true };
    }
    return { success: false, error };
  };

  const handleRevoke = async (soldierId: string, repoId: string) => {
    return await revokePermission(soldierId, repoId);
  };

  return {
    permissions,
    loading,
    isModalOpen,
    setIsModalOpen,
    handleGrant,
    handleRevoke
  };
}