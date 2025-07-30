export type UserRole = 'investigator' | 'officer-in-charge' | 'admin' | 'lab-analyst' | 'lab-supervisor' | 'lab-admin' | 'judge';

export type Department = 'police' | 'nfsl' | 'judiciary';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  department: Department | null;
}