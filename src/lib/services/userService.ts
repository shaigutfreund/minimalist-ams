// src/lib/services/userService.ts
import { supabase } from '@/lib/client';

// 1. Ensure the 'export' keyword is present here!
export interface Profile {
  userId: string;
  displayName: string;
  role: string;
  unitName: string;
  unitId: string;
  joinedAt: string;
}

export const UserService = {
  /**
   * Fetches all users within the current user's jurisdiction
   */
  async getJurisdictionUsers(): Promise<Profile[]> {
    const { data, error } = await supabase.rpc('get_jurisdiction_profiles');
    
    if (error) {
      console.error('Error fetching jurisdiction users:', error.message);
      throw error;
    }

    // Map database snake_case to our camelCase interface
    return data.map((row: any) => ({
      userId: row.p_user_id,
      displayName: row.p_display_name,
      role: row.p_role,
      unitName: row.p_unit_name,
      unitId: row.p_unit_id,
      joinedAt: row.p_joined_at,
    }));
  },

  /**
   * Updates a user's role and triggers a metadata sync
   */
  async updateUserRole(targetUserId: string, newRole: string): Promise<void> {
    const { error } = await supabase.rpc('update_user_role_v3', {
      target_user_id: targetUserId,
      new_role: newRole,
    });

    if (error) {
      console.error('Failed to update role:', error.message);
      throw error;
    }
  }
};