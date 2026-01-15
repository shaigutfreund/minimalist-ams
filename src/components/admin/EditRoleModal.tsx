// components/admin/EditRoleModal.tsx
'use client';

import { useState } from 'react';
import { UserService, Profile } from '@/lib/services/userService';
import { X, ShieldCheck, Loader2 } from 'lucide-react';

interface Props {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = ['member', 'officer', 'commander', 'admin'];

export default function EditRoleModal({ user, isOpen, onClose, onSuccess }: Props) {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await UserService.updateUserRole(user.userId, selectedRole);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to update user. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Modify Personnel Role</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user.displayName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{user.displayName}</p>
              <p className="text-xs text-indigo-600 font-semibold uppercase">{user.unitName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select New Rank</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                    selectedRole === role 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500">Cancel</button>
          <button 
            onClick={handleUpdate}
            disabled={isSubmitting || selectedRole === user.role}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
}