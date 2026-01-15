// components/admin/JurisdictionUsersTable.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserService, type Profile } from '@/lib/services/userService';import { 
  Users, 
  Shield, 
  MapPin, 
  UserCog, 
  Search, 
  RefreshCcw, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import EditRoleModal from '@/components/admin/EditRoleModal';

export default function JurisdictionUsersTable() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  // Memoized fetch to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserService.getJurisdictionUsers();
      setUsers(data);
    } catch (err) {
      console.error("Critical error loading personnel data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
      
      {/* 1. TABLE HEADER & CONTROLS */}
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Personnel Roster</h2>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-xs font-bold uppercase tracking-widest">Active Jurisdiction</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs font-semibold">{users.length} Total Units</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text"
              placeholder="Filter by name, unit, or rank..."
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full md:w-80 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={loadData}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
            title="Refresh Personnel"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. THE DATA GRID */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Identity</th>
              <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Designation</th>
              <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Operational Unit</th>
              <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6">
                    <div className="h-10 bg-slate-100 rounded-xl w-full" />
                  </td>
                </tr>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-bold shadow-sm">
                          {user.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{user.displayName}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {user.userId.substring(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 w-fit shadow-sm">
                      <Shield className={`w-3.5 h-3.5 ${
                        user.role === 'admin' || user.role === 'commander' ? 'text-indigo-600' : 'text-slate-400'
                      }`} />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <div className="p-1.5 bg-amber-50 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium">{user.unitName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md hover:shadow-indigo-100 transition-all group/btn"
                    >
                      <UserCog className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                      Modify Rank
                      <ChevronRight className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <UserCheck className="w-12 h-12 text-slate-200" />
                    <p className="text-slate-400 font-medium">No personnel found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. MODAL OVERLAYS */}
      {editingUser && (
        <EditRoleModal 
          user={editingUser} 
          isOpen={!!editingUser} 
          onClose={() => setEditingUser(null)} 
          onSuccess={loadData}
        />
      )}
    </div>
  );
}