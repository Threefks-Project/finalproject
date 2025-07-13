
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  CreditCard,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Check if user is admin or engineer
  if (!user || (user.role !== 'admin' && user.role !== 'engineer')) {
    return <Navigate to="/" replace />;
  }

  const stats = [
    {
      title: 'Total Citizens',
      value: '45,234',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12% from last month'
    },
    {
      title: 'Active Applications',
      value: '1,567',
      icon: FileText,
      color: 'bg-green-500',
      change: '+8% from last week'
    },
    {
      title: 'Open Complaints',
      value: '234',
      icon: MessageSquare,
      color: 'bg-yellow-500',
      change: '-5% from last week'
    },
    {
      title: 'Tax Collection',
      value: 'NPR 2.5M',
      icon: CreditCard,
      color: 'bg-purple-500',
      change: '+15% from last month'
    }
  ];

  const issueData = [
    { name: 'Road Damage', count: 45 },
    { name: 'Water Supply', count: 32 },
    { name: 'Waste Management', count: 28 },
    { name: 'Public Lighting', count: 22 },
    { name: 'Drainage', count: 18 },
    { name: 'Traffic', count: 15 }
  ];

  const taxData = [
    { name: 'Property Tax', value: 45, color: '#8884d8' },
    { name: 'Business License', value: 30, color: '#82ca9d' },
    { name: 'Building Permit', value: 15, color: '#ffc658' },
    { name: 'Other', value: 10, color: '#ff7300' }
  ];

  const recentIssues = [
    {
      id: 'BMC-2024-001',
      category: 'Road Damage',
      location: 'Main Road, Ward 5',
      urgency: 'high',
      status: 'assigned',
      reportedBy: 'John Doe'
    },
    {
      id: 'BMC-2024-002',
      category: 'Water Supply',
      location: 'Colony Area, Ward 3',
      urgency: 'medium',
      status: 'pending',
      reportedBy: 'Jane Smith'
    },
    {
      id: 'BMC-2024-003',
      category: 'Public Lighting',
      location: 'School Street, Ward 7',
      urgency: 'low',
      status: 'resolved',
      reportedBy: 'Ram Prasad'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-municipal-blue">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user.name}. Here's what's happening in your city.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="municipal-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-municipal-blue">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Issue Categories Chart */}
        <div className="municipal-card p-6">
          <h3 className="text-lg font-semibold mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1e40af" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tax Collection Breakdown */}
        <div className="municipal-card p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Collection Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taxData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {taxData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="municipal-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Issues</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Issue ID</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Urgency</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Reported By</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.map((issue) => (
                <tr key={issue.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{issue.id}</td>
                  <td className="py-3 px-4">{issue.category}</td>
                  <td className="py-3 px-4">{issue.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(issue.urgency)}`}>
                      {issue.urgency.charAt(0).toUpperCase() + issue.urgency.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{issue.reportedBy}</td>
                  <td className="py-3 px-4">
                    <button className="text-municipal-blue hover:underline text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
