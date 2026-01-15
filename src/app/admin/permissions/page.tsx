import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PermissionsHeader } from '@/components/PermissionsHeader';
import PermissionsView from '@/components/PermissionsView';

export default async function PermissionsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

//   // Data Fetching Logic (Backend Dependent)
//   const [reposResponse, usersResponse] = await Promise.all([
//     supabase.rpc('get_scoped_repositories'),
//     supabase.from('profiles').select('user_id, display_name')
//   ]);
  // Replace the standard .from('profiles') call with:
const [reposResponse, usersResponse] = await Promise.all([
  supabase.rpc('get_scoped_repositories'),
  supabase.rpc('get_jurisdiction_users') // Using the new specialized RPC
]);

  console.log('Repos Response:', reposResponse);
  console.log('Users Response:', usersResponse);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <PermissionsHeader />
      <PermissionsView 
        repos={reposResponse.data || []} 
        users={usersResponse.data || []} 
      />
    </div>
  );
}