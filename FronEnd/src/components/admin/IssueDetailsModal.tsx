
import React from 'react';
import { X, MapPin, User, Calendar, Camera } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'verified' | 'resolved' | 'rejected';
  reportedBy: string;
  reportedAt: string;
  category: 'garbage' | 'pothole' | 'others';
  hasImages: boolean;
  images?: string[];
}

interface IssueDetailsModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (issueId: string, newStatus: string) => void;
  onDelete: (issueId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved': return 'text-green-600 bg-green-100';
    case 'verified': return 'text-municipal-blue bg-blue-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'garbage': return 'text-orange-600 bg-orange-100';
    case 'pothole': return 'text-purple-600 bg-purple-100';
    case 'others': return 'text-municipal-blue bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({
  issue,
  isOpen,
  onClose,
  onStatusChange,
  onDelete
}) => {
  if (!isOpen) return null;

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(issue.id, newStatus);
    // Update the local issue state for immediate UI feedback
  };

  const handleDelete = () => {
    onDelete(issue.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-8 py-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold gradient-text">Issue Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Issue Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="municipal-card p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue ID</label>
              <p className="text-municipal-blue font-bold text-xl">{issue.id}</p>
            </div>
            <div className="municipal-card p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(issue.category)}`}>
                {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
              </span>
            </div>
            <div className="municipal-card p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getUrgencyColor(issue.urgency)}`}>
                {issue.urgency.charAt(0).toUpperCase() + issue.urgency.slice(1)} Priority
              </span>
            </div>
          </div>
          
          <div className="municipal-card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Issue Title</label>
            <p className="font-semibold text-xl text-gray-900">{issue.title}</p>
          </div>
          
          <div className="municipal-card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
            <p className="text-gray-600 leading-relaxed text-lg">{issue.description}</p>
          </div>
          
          <div className="municipal-card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-municipal-blue" />
              <p className="text-gray-600 text-lg">{issue.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="municipal-card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Reported By</label>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-municipal-blue" />
                <p className="text-gray-600 text-lg">{issue.reportedBy}</p>
              </div>
            </div>
            <div className="municipal-card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Reported At</label>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-municipal-blue" />
                <p className="text-gray-600 text-lg">{issue.reportedAt}</p>
              </div>
            </div>
          </div>
          
          <div className="municipal-card p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Current Status</label>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
              {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
            </span>
          </div>
          
          {issue.hasImages && issue.images && issue.images.length > 0 && (
            <div className="municipal-card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Attached Images</label>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {issue.images.map((image, index) => {
                  const isAbsolute = image.startsWith('http://') || image.startsWith('https://');
                  const imageUrl = isAbsolute ? image : `http://localhost:3000/${image.replace(/^\/+/, '')}`;
                  return (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Issue evidence ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg border shadow-md hover:shadow-xl transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <Camera className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        Image {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Update Status:</label>
              <select
                value={issue.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-municipal-blue cursor-pointer ${getStatusColor(issue.status)}`}
              >
                <option value="pending">Mark as Pending</option>
                <option value="verified">Mark as Verified</option>
                <option value="resolved">Mark as Resolved</option>
                <option value="rejected">Mark as Rejected</option>
              </select>
            </div>
            
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              <X className="h-4 w-4" />
              Delete Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsModal;
