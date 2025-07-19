
import React from 'react';
import { Eye, Trash2, MapPin, Camera, User, Calendar } from 'lucide-react';

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
  serialNumber?: number; // Add serial number for display
}

interface IssueCardProps {
  issue: Issue;
  onStatusChange: (issueId: string, newStatus: string) => void;
  onViewDetails: (issue: Issue) => void;
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
    case 'high': return 'text-red-600 bg-red-100 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-100 border-green-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
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

const IssueCard: React.FC<IssueCardProps> = ({ issue, onStatusChange, onViewDetails, onDelete }) => {
  return (
    <div className="municipal-card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-municipal-blue text-lg">{issue.serialNumber || issue.id}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(issue.category)}`}>
            {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(issue.urgency)}`}>
          {issue.urgency.charAt(0).toUpperCase() + issue.urgency.slice(1)} Priority
        </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{issue.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{issue.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-municipal-blue" />
          <span className="text-sm text-gray-600">{issue.location}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-municipal-blue" />
          <span className="text-sm text-gray-600">Reported by: {issue.reportedBy}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-municipal-blue" />
          <span className="text-sm text-gray-600">{issue.reportedAt}</span>
        </div>
        
        {issue.hasImages && (
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-municipal-blue" />
            <span className="text-sm text-municipal-blue font-medium">
              {issue.images?.length || 0} image(s) attached
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
        <select
          value={issue.status}
          onChange={(e) => onStatusChange(issue.id, e.target.value)}
          className={`px-3 py-2 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-municipal-blue cursor-pointer ${getStatusColor(issue.status)}`}
        >
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onViewDetails(issue)}
          className="flex items-center gap-2 px-4 py-2 text-sm municipal-button-secondary flex-1 justify-center"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
        <button 
          onClick={() => onDelete(issue.id)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default IssueCard;
