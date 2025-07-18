
import React from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Users, 
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Active Issues',
      value: '23',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '+3 this week'
    },
    {
      title: 'Pending Applications',
      value: '12',
      icon: ClipboardList,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+2 today'
    },
    {
      title: 'Total Citizens',
      value: '1,247',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+15 this month'
    },
    {
      title: 'Documents',
      value: '89',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+5 this week'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New civic issue reported', time: '2 minutes ago', type: 'issue' },
    { id: 2, action: 'Application processed', time: '15 minutes ago', type: 'application' },
    { id: 3, action: 'Document uploaded', time: '1 hour ago', type: 'document' },
    { id: 4, action: 'User complaint resolved', time: '2 hours ago', type: 'complaint' },
    { id: 5, action: 'Tax payment verified', time: '3 hours ago', type: 'tax' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome to the Municipality Administration Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-municipal-blue hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors">
              <div className="flex-shrink-0">
                {activity.type === 'issue' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {activity.type === 'application' && <ClipboardList className="h-4 w-4 text-blue-500" />}
                {activity.type === 'document' && <FileText className="h-4 w-4 text-green-500" />}
                {activity.type === 'complaint' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                {activity.type === 'tax' && <CheckCircle className="h-4 w-4 text-indigo-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <h4 className="font-medium text-gray-900">Review Issues</h4>
          <p className="text-xs text-gray-500">Check pending civic issues</p>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
          <ClipboardList className="h-8 w-8 text-blue-500 mb-2" />
          <h4 className="font-medium text-gray-900">Process Applications</h4>
          <p className="text-xs text-gray-500">Handle service requests</p>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
          <FileText className="h-8 w-8 text-green-500 mb-2" />
          <h4 className="font-medium text-gray-900">Manage Documents</h4>
          <p className="text-xs text-gray-500">Upload or update forms</p>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left">
          <Users className="h-8 w-8 text-purple-500 mb-2" />
          <h4 className="font-medium text-gray-900">User Management</h4>
          <p className="text-xs text-gray-500">Manage citizen accounts</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
