'use client';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { UserPlus, X, Clock, ShieldCheck } from 'lucide-react';
import { PermissionRepo, PermissionUser, GrantPermissionInput } from '@/types/permissions';

interface GrantAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repos: PermissionRepo[];
  users: PermissionUser[];
  onConfirm: (input: GrantPermissionInput) => Promise<{ success: boolean; error?: unknown }>;
}

export default function GrantAccessModal({ open, onOpenChange, repos, users, onConfirm }: GrantAccessModalProps) {
  const [formData, setFormData] = useState<GrantPermissionInput>({ userId: '', repoId: '', hours: 24 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(formData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <UserPlus className="h-4 w-4" /> Grant Access
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-2xl p-6 z-50">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold">New Grant</Dialog.Title>
            <Dialog.Close className="text-slate-400"><X className="h-5 w-5" /></Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <div className="space-y-2">
              <label className="text-sm font-semibold">Soldier</label>
              <select className="w-full p-2 bg-slate-50 border rounded-xl"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})} required>
                <option value="">Choose...</option>
                {users.map(u => <option key={u.user_id} value={u.user_id}>{u.display_name}</option>)}
              </select>
            </div> */}
            <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Soldier</label>
            <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                required
            >
                <option value="">Choose a user...</option>
                {/* Grouping by Unit Name for better UX */}
                {Array.from(new Set(users.map(u => u.unit_name))).map(unit => (
                <optgroup key={unit} label={unit}>
                    {users
                    .filter(u => u.unit_name === unit)
                    .map(u => (
                        <option key={u.user_id} value={u.user_id}>
                        {u.display_name} ({u.role})
                        </option>
                    ))}
                </optgroup>
                ))}
            </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Repository</label>
              <select className="w-full p-2 bg-slate-50 border rounded-xl"
                value={formData.repoId}
                onChange={(e) => setFormData({...formData, repoId: e.target.value})} required>
                <option value="">Select...</option>
                {repos.map(r => <option key={r.id} value={r.id}>{r.name} ({r.scope_name})</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold flex items-center gap-1">
                  <Clock className="h-4 w-4 text-slate-500" /> Duration
                </label>
                <span className="font-mono text-blue-600">{formData.hours}h</span>
              </div>
              <input type="range" min="1" max="48" value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: parseInt(e.target.value)})}
                className="w-full accent-slate-900" />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Authorize
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}