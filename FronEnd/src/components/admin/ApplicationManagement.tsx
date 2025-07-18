
import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface Application {
  id: string;
  type: string;
  applicantName: string;
  submittedAt: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  documents: number;
  priority: 'normal' | 'urgent';
}

const ApplicationManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const mockApplications: Application[] = [
    {
      id: 'APP-2024-001',
      type: 'Citizenship Certificate',
      applicantName: 'John Doe',
      submittedAt: '2024-01-15 10:30 AM',
      status: 'pending',
      documents: 3,
      priority: 'normal'
    },
    {
      id: 'APP-2024-002',
      type: 'Business License',
      applicantName: 'Jane Smith',
      submittedAt: '2024-01-14 02:15 PM',
      status: 'processing',
      documents: 5,
      priority: 'urgent'
    },
    {
      id: 'APP-2024-003',
      type: 'Building Permit',
      applicantName: 'Ram Prasad',
      submittedAt: '2024-01-13 08:45 AM',
      status: 'approved',
      documents: 7,
      priority: 'normal'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Management</h2>
          <p className="text-gray-600">Process citizen service applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
          >
            <option value="all">All Types</option>
            <option value="Citizenship Certificate">Citizenship Certificate</option>
            <option value="Business License">Business License</option>
            <option value="Building Permit">Building Permit</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Application ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Applicant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Submitted</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Documents</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-municipal-blue">{app.id}</span>
                      {app.priority === 'urgent' && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">Urgent</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">{app.type}</td>
                  <td className="py-3 px-4 font-medium">{app.applicantName}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{app.submittedAt}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {app.documents}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded-md transition-colors" title="View Details">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-green-100 rounded-md transition-colors" title="Approve">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded-md transition-colors" title="Reject">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
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

export default ApplicationManagement;
