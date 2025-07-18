
import React, { useState } from 'react';
import { Search, Filter, CreditCard, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

interface TaxRecord {
  id: string;
  citizenName: string;
  taxType: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
}

const TaxManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taxTypeFilter, setTaxTypeFilter] = useState('all');

  const mockTaxRecords: TaxRecord[] = [
    {
      id: 'TAX-2024-001',
      citizenName: 'John Doe',
      taxType: 'Property Tax',
      amount: 15000,
      dueDate: '2024-02-15',
      paidDate: '2024-01-20',
      status: 'paid',
      paymentMethod: 'Online Banking'
    },
    {
      id: 'TAX-2024-002',
      citizenName: 'Jane Smith',
      taxType: 'Business License Fee',
      amount: 8000,
      dueDate: '2024-01-30',
      paidDate: null,
      status: 'pending',
      paymentMethod: ''
    },
    {
      id: 'TAX-2024-003',
      citizenName: 'Ram Prasad',
      taxType: 'Property Tax',
      amount: 12000,
      dueDate: '2024-01-10',
      paidDate: null,
      status: 'overdue',
      paymentMethod: ''
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRecords = mockTaxRecords.filter(record => {
    const matchesSearch = record.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = taxTypeFilter === 'all' || record.taxType === taxTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCollected = mockTaxRecords
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalPending = mockTaxRecords
    .filter(record => record.status !== 'paid')
    .reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tax Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">NPR {totalCollected.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Collection</p>
                <p className="text-2xl font-bold text-yellow-600">NPR {totalPending.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Payments</p>
                <p className="text-2xl font-bold text-red-600">{mockTaxRecords.filter(r => r.status === 'overdue').length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tax records..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={taxTypeFilter}
            onChange={(e) => setTaxTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
          >
            <option value="all">All Tax Types</option>
            <option value="Property Tax">Property Tax</option>
            <option value="Business License Fee">Business License Fee</option>
            <option value="Building Permit Fee">Building Permit Fee</option>
          </select>
        </div>
      </div>

      {/* Tax Records Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tax ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Citizen</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tax Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-municipal-blue">{record.id}</td>
                  <td className="py-3 px-4 font-medium">{record.citizenName}</td>
                  <td className="py-3 px-4">{record.taxType}</td>
                  <td className="py-3 px-4 font-semibold">NPR {record.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{record.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {record.paymentMethod || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-100 rounded-md transition-colors" title="View Details">
                      <Eye className="h-4 w-4 text-gray-600" />
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

export default TaxManagement;
