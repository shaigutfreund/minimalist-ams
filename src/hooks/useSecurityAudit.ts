// src/hooks/useSecurityAudit.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { SecurityService, AuditLog } from '@/lib/services/securityService';

export function useSecurityAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState('');

  // 1. Centralized Refresh Logic
  const refreshLogs = useCallback(async () => {
    try {
      // Changed from fetchRecentLogs to getScopedLogs to ensure 
      // users only see what their JWT allows.
      const data = await SecurityService.getScopedLogs();
      setLogs(data);
    } catch (err: any) {
      // The Service now throws clean Error messages, so we log .message
      console.error("🚨 Audit Sync Error:", err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Realtime Lifecycle
  useEffect(() => {
    refreshLogs();
    
    // Abstracted: The hook no longer needs to know table names or event types
    const channel = SecurityService.subscribeToLogs(refreshLogs);

    return () => {
      channel.unsubscribe();
    };
  }, [refreshLogs]);

  // 3. Action Handlers
  const handleDownloadCSV = async () => {
    setExporting(true);
    try {
      const csv = await SecurityService.exportAuditToCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err: any) {
      console.error("Download Error:", err.message);
    } finally {
      setExporting(false);
    }
  };

  // 4. Memoized Filtering (Performance Optimization)
  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.target_user_name.toLowerCase().includes(filter.toLowerCase()) ||
      log.performed_by_name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [logs, filter]);

  return { 
    filteredLogs, 
    loading, 
    exporting, 
    setFilter, 
    handleDownloadCSV,
    refreshLogs // Exposed in case you want a manual refresh button
  };
}