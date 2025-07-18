
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLoginModal from '../auth/AdminLoginModal';

const AdminGlobalAccess: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Shift + Alt + A for admin access
      if (e.shiftKey && e.altKey && e.key === 'A') {
        e.preventDefault();
        // Only show login modal if user is not already an admin
        if (!user || user.role !== 'admin') {
          setShowAdminLogin(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [user]);

  // Don't show login modal if user is already an admin
  if (user && user.role === 'admin') {
    return null;
  }

  return (
    <AdminLoginModal 
      isOpen={showAdminLogin} 
      onClose={() => setShowAdminLogin(false)} 
    />
  );
};

export default AdminGlobalAccess;
