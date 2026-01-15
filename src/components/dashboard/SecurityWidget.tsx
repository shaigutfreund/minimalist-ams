'use client';

import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { 
  ShieldAlert, 
  Activity, 
  History, 
  ShieldCheck, 
  Search, 
  Download, 
  Loader2 
} from 'lucide-react';

export default function SecurityWidget() {
  // Consuming the logic hook we just refactored
  const { 
    filteredLogs, 
    loading, 
    exporting, 
    setFilter, 
    handleDownloadCSV 
  } = useSecurityAudit();

  return (
    <div className="w-full bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm mb-8">
      
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Security Audit Trail</h3>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Filter by name or rank..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium outline-none ring-0 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button 
            onClick={handleDownloadCSV}
            disabled={exporting || loading}
            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm active:scale-95"
            title="Download Last 100 Events"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          // Skeleton Loading State
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
          ))
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="group flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">
                    {log.performed_by_name} 
                    <span className="font-medium text-slate-400 mx-1">modified</span> 
                    {log.target_user_name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <ShieldAlert className="w-4 h-4 text-slate-200 group-hover:text-red-400 transition-colors" />
            </div>
          ))
        ) : (
          // Empty State
          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem]">
             <History className="w-8 h-8 text-slate-200 mb-2" />
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No matching security logs</p>
          </div>
        )}
      </div>
    </div>
  );
}