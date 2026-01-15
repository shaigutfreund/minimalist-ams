// src/lib/services/securityService.ts
import { supabase } from '@/lib/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface AuditLog {
  id: string;
  action: string;
  target_user_name: string;
  performed_by_name: string;
  created_at: string;
  unit_id: string;
}

export const SecurityService = {
  async getScopedLogs(limit = 10): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('permission_history')
      .select(`
        id,
        action,
        created_at,
        unit_id,
        target:target_user_id ( display_name ),
        admin:performed_by ( display_name )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Scoped Fetch Error: ${error.message}`);
    return (data || []).map(this.transformRow);
  },

  // ADD THIS METHOD TO FIX THE ERROR
  async exportAuditToCSV(limit = 100): Promise<string> {
    const { data, error } = await supabase
      .from('permission_history')
      .select(`
        created_at,
        action,
        target:target_user_id ( display_name ),
        admin:performed_by ( display_name )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Export Failed: ${error.message}`);

    const headers = ['Timestamp', 'Action', 'Target Personnel', 'Admin Responsible'];
    const rows = (data || []).map(row => {
      const timestamp = new Date(row.created_at).toLocaleString();
      const action = `"${row.action}"`;
      const target = `"${row.target?.display_name || 'N/A'}"`;
      const admin = `"${row.admin?.display_name || 'System'}"`;
      
      return [timestamp, action, target, admin].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  subscribeToLogs(onUpdate: () => void): RealtimeChannel {
    return supabase
      .channel('security-audit-stream')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'permission_history' },
        () => onUpdate()
      )
      .subscribe();
  },

  /**
   * Logs a security event to the permission_history table.
   * This is called when a user is promoted, granted access, or demoted.
   */
  async logAction(
    action: string, 
    targetUserId: string, 
    repoId?: string, 
    duration?: number
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("No authenticated user found for logging.");

    const { error } = await supabase
      .from('permission_history')
      .insert([
        {
          action,
          target_user_id: targetUserId,
          repo_id: repoId || null,
          duration_hours: duration || null,
          performed_by: user.id, // The Admin (Shai)
          unit_id: user.user_metadata.unit_id // Capturing unit context
        }
      ]);

    if (error) {
      console.error("Critical: Failed to write to Audit Log", error.message);
      throw new Error(`Audit Logging Failed: ${error.message}`);
    }
  },

  transformRow(log: any): AuditLog {
    return {
      id: log.id,
      action: log.action,
      created_at: log.created_at,
      unit_id: log.unit_id,
      target_user_name: log.target?.display_name || 'Personnel Deleted',
      performed_by_name: log.admin?.display_name || 'System/Command'
    };
  }
};