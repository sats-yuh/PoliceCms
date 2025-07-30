import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Department } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchDepartment: (department: Department) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.police@demo.com',
    role: 'admin',
    department: 'police',
    isActive: true,
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    name: 'SI Ram Kumar',
    email: 'ram.police@demo.com',
    role: 'investigator',
    department: 'police',
    isActive: true,
    createdAt: '2025-01-01'
  },
  {
    id: '3',
    name: 'Dr. A. Sharma',
    email: 'sharma.lab@demo.com',
    role: 'lab-analyst',
    department: 'nfsl',
    isActive: true,
    createdAt: '2025-01-01'
  },
  {
    id: '4',
    name: 'Judge Patel',
    email: 'patel.judge@demo.com',
    role: 'judge',
    department: 'judiciary',
    isActive: true,
    createdAt: '2025-01-01'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    department: null
  });

  useEffect(() => {
    // Check for stored auth
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setAuthState(parsed);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app this would be API call
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      const newAuthState = {
        user,
        isAuthenticated: true,
        department: user.department
      };
      setAuthState(newAuthState);
      localStorage.setItem('auth', JSON.stringify(newAuthState));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      department: null
    });
    localStorage.removeItem('auth');
  };

  const switchDepartment = (department: Department) => {
    if (authState.user) {
      const newAuthState = {
        ...authState,
        department
      };
      setAuthState(newAuthState);
      localStorage.setItem('auth', JSON.stringify(newAuthState));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      switchDepartment
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};