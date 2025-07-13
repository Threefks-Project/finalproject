
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Complaint {
  id: string;
  category: string;
  description: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'submitted' | 'in_progress' | 'resolved' | 'closed';
  submittedDate: string;
  lastUpdate: string;
}

const MyComplaints: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const complaints: Complaint[] = [
    {
      id: 'BMC-2024-001',
      category: 'Road Damage',
      description: 'Large pothole on main road causing traffic issues',
      location: 'Main Road, Ward 5',
      urgency: 'high',
      status: 'in_progress',
      submittedDate: '2024-06-20',
      lastUpdate: '2024-06-22'
    },
    {
      id: 'BMC-2024-002',
      category: 'Waste Management',
      description: 'Garbage collection not done for 3 days',
      location: 'Colony Area, Ward 3',
      urgency: 'medium',
      status: 'resolved',
      submittedDate: '2024-06-18',
      lastUpdate: '2024-06-21'
    },
    {
      id: 'BMC-2024-003',
      category: 'Public Lighting',
      description: 'Street lights not working at night',
      location: 'School Street, Ward 7',
      urgency: 'medium',
      status: 'submitted',
      submittedDate: '2024-06-15',
      lastUpdate: '2024-06-15'
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
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'submitted': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="municipal-card p-8">
            <MessageSquare className="h-16 w-16 text-municipal-blue mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-municipal-blue mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to view your complaints and their status.
            </p>
            <button className="municipal-button w-full">
              {t('login')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-municipal-blue mb-8">
        {t('my_complaints')}
      </h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Statistics */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="municipal-card p-4 text-center">
              <div className="text-2xl font-bold text-municipal-blue">3</div>
              <div className="text-sm text-gray-600">Total Complaints</div>
            </div>
            <div className="municipal-card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="municipal-card p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="municipal-card p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="lg:col-span-3">
          <div className="municipal-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Reports</h2>
              <button className="municipal-button">
                {t('report_issue')}
              </button>
            </div>
            
            {complaints.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No complaints found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{complaint.category}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(complaint.urgency)}`}>
                            {complaint.urgency.charAt(0).toUpperCase() + complaint.urgency.slice(1)} Priority
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ').charAt(0).toUpperCase() + complaint.status.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{complaint.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{complaint.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted: {new Date(complaint.submittedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>ID: {complaint.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Updated: {new Date(complaint.lastUpdate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                        {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                          <button className="px-4 py-2 text-sm text-municipal-blue border border-municipal-blue rounded hover:bg-blue-50 transition-colors">
                            Add Update
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;
