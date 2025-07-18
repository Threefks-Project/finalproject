
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  Newspaper, 
  ClipboardList, 
  CreditCard, 
  Users, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/issues', icon: AlertTriangle, label: 'Civic Issues' },
    { path: '/admin/documents', icon: FileText, label: 'Documents' },
    { path: '/admin/news', icon: Newspaper, label: 'News & Notices' },
    { path: '/admin/applications', icon: ClipboardList, label: 'Applications' },
    { path: '/admin/taxes', icon: CreditCard, label: 'Tax Records' },
    { path: '/admin/users', icon: Users, label: 'Citizens' },
    { path: '/admin/complaints', icon: MessageSquare, label: 'Complaints' },
  ];

  return (
    <div className="min-h-screen bg-municipal-gray-light flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-56 sm:w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b municipal-gradient">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <h2 className="text-base sm:text-lg font-bold text-white">Admin Panel</h2>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-municipal-blue-dark rounded text-white"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>

          {/* User info */}
          <div className="p-3 sm:p-4 border-b bg-municipal-blue-light/10">
            <p className="text-xs sm:text-sm text-gray-600">Welcome,</p>
            <p className="font-medium text-municipal-blue text-sm sm:text-base truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 sm:p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-municipal-blue text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-municipal-blue-light/20 hover:text-municipal-blue'
                  }
                `}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-2 sm:p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1 sm:p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">Municipality Administration</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
