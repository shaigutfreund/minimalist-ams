
// import { Database } from '@/types/supabase'; // Assuming standard Supabase types

export interface TempPermission {
  soldier_id: string;
  soldier_name: string;
  soldier_hebrew_name: string;
  repo_id: string;
  repo_name: string;
  repo_unit: string;
  repo_tier: string;
  authorized_by: string;
  authorized_by_name: string;
  expires_at: string;
  time_remaining_interval: string;
}

export interface GrantPermissionInput {
  userId: string;
  repoId: string;
  hours: number;
}

export interface PermissionUser {
  user_id: string;
  display_name: string;
  role: 'member' | 'commander' | 'officer' | 'admin' | 'super_admin'
  unit_name: string;
}

export interface PermissionRepo {
  id: string;
  name: string;
  scope_name: string;
}

export interface PermissionsPageProps {
  initialRepos: PermissionRepo[];
  initialUsers: PermissionUser[];
}