'use client';

import { useState, useEffect } from 'react';
import { Trash2, Clock, ShieldAlert, UserCheck } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { cn } from '@/lib/utils';
import { TempPermission } from '@/types/permissions';

// Dedicated interface to satisfy PermissionsView.tsx
interface TempAccessManagerProps {
  permissions: TempPermission[];
  isLoading: boolean;
  onRevoke: (soldierId: string, repoId: string) => Promise<unknown>;
}

// Isolated Timer Component for performance
function LiveCountdown({ expiry }: { expiry: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiry).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft('Expired');
      
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    const timer = setInterval(calc, 1000);
    calc();
    return () => clearInterval(timer);
  }, [expiry]);

  return <span>{timeLeft}</span>;
}

export default function TempAccessManager({ 
  permissions, 
  isLoading, 
  onRevoke 
}: TempAccessManagerProps) {
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
        <p className="text-sm text-slate-500 animate-pulse">Syncing permissions...</p>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
        <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No active temporary permissions</p>
        <p className="text-xs text-slate-400 mt-1">Authorized grants will appear here in real-time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {permissions.map((perm) => (
        <div 
          key={`${perm.soldier_id}-${perm.repo_id}`}
          className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:border-slate-300"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <Label className="font-bold text-slate-900 leading-none">
                  {perm.soldier_name}
                </Label>
              </div>
              <p className="text-sm font-medium text-slate-500 pl-6">
                Access to: <span className="text-slate-900">{perm.repo_name}</span>
              </p>
            </div>

            <button 
              onClick={() => onRevoke(perm.soldier_id, perm.repo_id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-100"
              aria-label="Revoke Permission"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-medium border-t border-slate-50 pt-4">
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md border",
              "text-orange-600 bg-orange-50 border-orange-100"
            )}>
              <Clock className="h-3.5 w-3.5" />
              <LiveCountdown expiry={perm.expires_at} />
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldAlert className="h-3.5 w-3.5" />
              Auth: {perm.authorized_by_name}
            </div>
            
            <div className="ml-auto text-slate-400 uppercase tracking-widest text-[9px] font-bold">
              {perm.repo_unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}