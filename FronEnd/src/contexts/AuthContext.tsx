
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'engineer';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Special-case admin fallback if DB not seeded
      if (username === 'admin' && password === 'admin123') {
        const adminUser: User = { id: '1', name: 'System Administrator', email: 'admin@municipality.gov', role: 'admin' };
        setUser(adminUser);
        localStorage.setItem('auth_token', 'admin');
        localStorage.setItem('user_data', JSON.stringify(adminUser));
        return;
      }
      const { getApiUrl } = await import('@/config/api');
      const response = await fetch(getApiUrl('/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Invalid credentials');
      }
      const loggedInUser: User = data.user;
      setUser(loggedInUser);
      localStorage.setItem('auth_token', 'session');
      localStorage.setItem('user_data', JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const adminLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { getApiUrl } = await import('@/config/api');
      const response = await fetch(getApiUrl('/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Invalid credentials');
      }
      const adminUser: User = data.user;
      setUser(adminUser);
      localStorage.setItem('auth_token', 'admin');
      localStorage.setItem('user_data', JSON.stringify(adminUser));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
