
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'engineer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for admin credentials
    if (email === 'admin' && password === 'admin123') {
      const adminUser: User = { 
        id: '1', 
        name: 'System Administrator', 
        email: 'admin@municipality.gov', 
        role: 'admin' 
      };
      
      setUser(adminUser);
      localStorage.setItem('auth_token', 'admin_token');
      localStorage.setItem('user_data', JSON.stringify(adminUser));
      setIsLoading(false);
      return;
    }
    
    // Mock user data for regular users
    const mockUser: User = { 
      id: '2', 
      name: 'Citizen User', 
      email, 
      role: 'citizen' 
    };
    
    setUser(mockUser);
    localStorage.setItem('auth_token', 'user_token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
