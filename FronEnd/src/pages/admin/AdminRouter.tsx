
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import IssueManagement from '@/components/admin/IssueManagement';
import TaxManagement from '@/components/admin/TaxManagement';
import UserManagement from '@/components/admin/UserManagement';
import ComplaintManagement from '@/components/admin/ComplaintManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';

const AdminRouter: React.FC = () => {
  const { user } = useAuth();

  // Check if user has admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="issues" element={<IssueManagement />} />
        
        <Route path="taxes" element={<TaxManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="complaints" element={<ComplaintManagement />} />
        <Route path="gallery" element={<GalleryManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
