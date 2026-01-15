import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/client';
import { TempPermission, GrantPermissionInput } from '@/types/permissions';

export function useTempPermissions() {
  const [permissions, setPermissions] = useState<TempPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchPermissions = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    
    const { data, error } = await supabase
      .from('active_permissions_audit')
      .select('*')
      .order('expires_at', { ascending: true });

    if (!error) setPermissions(data as TempPermission[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    // React 19 pattern: Use a flag to ensure initial fetch runs once
    // but avoid synchronous state setters in the main thread of the effect
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPermissions();
    }

    const channel = supabase
      .channel('permissions_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'temporary_permissions' }, 
        () => fetchPermissions(true)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPermissions]);

  const grantPermission = async (input: GrantPermissionInput) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + Math.min(input.hours, 48));

    return await supabase.from('temporary_permissions').insert({
      user: input.userId,
      repo_id: input.repoId,
      expires_at: expiresAt.toISOString(),
      authorized_by: (await supabase.auth.getUser()).data.user?.id
    });
  };

  const revokePermission = async (soldierId: string, repoId: string) => {
    return await supabase
      .from('temporary_permissions')
      .delete()
      .match({ user: soldierId, repo_id: repoId });
  };

  return { permissions, loading, grantPermission, revokePermission };
}