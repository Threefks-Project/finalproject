
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import IssueManagement from '@/components/admin/IssueManagement';
import DocumentManagement from '@/components/admin/DocumentManagement';
import NewsManagement from '@/components/admin/NewsManagement';
import ApplicationManagement from '@/components/admin/ApplicationManagement';
import TaxManagement from '@/components/admin/TaxManagement';
import UserManagement from '@/components/admin/UserManagement';
import ComplaintManagement from '@/components/admin/ComplaintManagement';

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
        <Route path="documents" element={<DocumentManagement />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="applications" element={<ApplicationManagement />} />
        <Route path="taxes" element={<TaxManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="complaints" element={<ComplaintManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
