// src/lib/services/permissionService.ts

import { supabase } from '@/lib/client';
import { SecurityService } from '@/lib/services/securityService';

export const PermissionService = {
  async grantTemporaryAccess(payload: {
    user_id: string;
    repo_id: string;
    expires_at: string;
  }) {
    const { data, error } = await supabase
      .from('repository_permissions') // Adjust to your table name
      .insert([
        {
          user_id: payload.user_id,
          repository_id: payload.repo_id,
          authorized_by: (await supabase.auth.getUser()).data.user?.id,
          expires_at: payload.expires_at,
        }
      ]);

    if (error) {
      if (error.code === '42501') {
        throw new Error("Security Violation: You do not have permission to grant access in this unit.");
      }
      throw error;
    }
    
    // Also log to history after successful grant
    await SecurityService.logAction('GRANT_TEMP_ACCESS', payload.user_id);
    
    return data;
  }
};