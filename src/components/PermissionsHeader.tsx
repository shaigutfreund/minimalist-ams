import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const PermissionsHeader = () => (
  <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <Link href="/dashboard" className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-slate-900" />
        <span className="font-bold text-slate-900 tracking-tight text-sm md:text-base">Access Control</span>
      </div>
      <div className="w-9" /> 
    </div>
  </nav>
);