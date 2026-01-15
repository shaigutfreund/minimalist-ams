'use client';

import { useEffect, useState } from 'react';
import { SecurityService, SecurityLog } from '@/services/securityService';
import { LogItem } from './LogItem';

export function SecurityLogTimeline() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecurityService.getScopedLogs()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-slate-50 rounded-xl" />;

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <header className="mb-8">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">SECURITY AUDIT</h3>
        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Jurisdiction Timeline</p>
      </header>
      
      <div className="flex flex-col">
        {logs.length > 0 ? (
          logs.map(log => <LogItem key={log.id} log={log} />)
        ) : (
          <p className="text-sm text-slate-400 text-center py-10">No recent security changes.</p>
        )}
      </div>
    </div>
  );
}