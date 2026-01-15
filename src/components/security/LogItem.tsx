// components/security/LogItem.tsx
import { format } from 'date-fns';
import { SecurityLog } from '@/lib/services/securityService';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface LogItemProps {
  log: SecurityLog;
  darkVariant?: boolean;
}

export const LogItem = ({ log, darkVariant = false }: LogItemProps) => (
  <div className="flex gap-4 relative pb-8 last:pb-0">
    {/* Timeline Connector */}
    <div className={`absolute left-[19px] top-10 bottom-0 w-px last:hidden ${
      darkVariant ? 'bg-slate-800' : 'bg-slate-200'
    }`} />
    
    <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 ${
      darkVariant ? 'border-slate-900' : 'border-white'
    } ${
      log.action === 'GRANT' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
    }`}>
      {log.action === 'GRANT' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
    </div>

    <div className="flex-1 pt-1">
      <div className="flex justify-between items-start">
        <h4 className={`text-sm font-bold ${darkVariant ? 'text-slate-200' : 'text-slate-900'}`}>
          {log.action === 'GRANT' ? 'Access Granted' : 'Access Revoked'}
        </h4>
        <time className="text-xs text-slate-500 font-mono">
          {format(new Date(log.timestamp), 'HH:mm')}
        </time>
      </div>
      <p className={`text-sm mt-1 ${darkVariant ? 'text-slate-400' : 'text-slate-600'}`}>
        <span className={darkVariant ? 'text-white' : 'text-slate-900'}>{log.actorName}</span>
        {log.action === 'GRANT' ? ' authorized ' : ' removed '}
        <span className={darkVariant ? 'text-white' : 'text-slate-900'}>{log.targetName}</span>
      </p>
    </div>
  </div>
);