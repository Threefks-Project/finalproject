
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Application {
  id: string;
  type: string;
  submittedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  lastUpdate: string;
}

const MyApplications: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const applications: Application[] = [
    {
      id: 'APP-2024-001',
      type: 'Building Permit',
      submittedDate: '2024-06-15',
      status: 'under_review',
      lastUpdate: '2024-06-20'
    },
    {
      id: 'APP-2024-002',
      type: 'Business License',
      submittedDate: '2024-06-10',
      status: 'approved',
      lastUpdate: '2024-06-18'
    },
    {
      id: 'APP-2024-003',
      type: 'Citizenship Certificate',
      submittedDate: '2024-06-05',
      status: 'pending',
      lastUpdate: '2024-06-05'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'under_review': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const applicationTypes = [
    'Building Permit',
    'Business License',
    'Citizenship Certificate',
    'Marriage Certificate',
    'Death Certificate',
    'Birth Certificate',
    'Property Registration',
    'Tax Clearance'
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="municipal-card p-8">
            <FileText className="h-16 w-16 text-municipal-blue mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-municipal-blue mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to view and manage your applications.
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
        {t('applications')}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="municipal-card p-6">
            <h2 className="text-xl font-semibold mb-4">My Applications</h2>
            
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{app.type}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status.replace('_', ' ').charAt(0).toUpperCase() + app.status.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Application ID: {app.id}</div>
                          <div>Submitted: {new Date(app.submittedDate).toLocaleDateString()}</div>
                          <div>Last Update: {new Date(app.lastUpdate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          <Eye className="h-3 w-3" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Application */}
        <div className="space-y-6">
          <div className="municipal-card p-6">
            <h3 className="font-semibold mb-4">Start New Application</h3>
            <div className="space-y-3">
              {applicationTypes.map((type) => (
                <button
                  key={type}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-municipal-blue hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-municipal-blue" />
                    <span className="text-sm">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="municipal-card p-6">
            <h3 className="font-semibold mb-4">Application Status Guide</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span>Pending: Application received</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span>Under Review: Being processed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Approved: Ready for collection</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Rejected: Additional info needed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
