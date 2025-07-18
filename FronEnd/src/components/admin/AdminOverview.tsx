import React from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Users, 
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Newspaper
} from 'lucide-react';

const AdminOverview: React.FC = () => {
  const stats = [
    {
      title: 'Active Issues',
      value: '45',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Pending Applications',
      value: '23',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Users',
      value: '1,247',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Tax Collections',
      value: 'NPR 2.5M',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentActivity = [
    {
      type: 'issue',
      title: 'New road damage report',
      location: 'Ward 5, Main Street',
      time: '2 hours ago',
      status: 'pending',
      icon: AlertTriangle
    },
    {
      type: 'application',
      title: 'Citizenship application submitted',
      location: 'John Doe',
      time: '4 hours ago',
      status: 'processing',
      icon: FileText
    },
    {
      type: 'tax',
      title: 'Property tax payment received',
      location: 'NPR 15,000',
      time: '6 hours ago',
      status: 'completed',
      icon: CreditCard
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-municipal-blue mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-600">Manage your municipality's digital services and citizen requests efficiently.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <activity.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h4 className="font-semibold">Urgent Issues</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">Review and respond to high-priority civic issues</p>
          <button className="text-municipal-blue hover:underline text-sm font-medium">View Issues →</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="font-semibold">New Applications</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">Process pending service applications</p>
          <button className="text-municipal-blue hover:underline text-sm font-medium">View Applications →</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Newspaper className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="font-semibold">Publish News</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">Create and manage public announcements</p>
          <button className="text-municipal-blue hover:underline text-sm font-medium">Manage News →</button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
