
import React, { useState } from 'react';
import { Search, Filter, Clock, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import IssueCard from './IssueCard';
import IssueDetailsModal from './IssueDetailsModal';

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

const IssueManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState<'all' | 'garbage' | 'pothole' | 'others'>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 'ISS-001',
      title: 'Broken Street Light',
      description: 'Street light on Main Street is not working for the past 3 days. This creates safety concerns for pedestrians and vehicles during night time.',
      location: 'Main Street, Ward 5',
      urgency: 'high',
      status: 'pending',
      reportedBy: 'John Doe',
      reportedAt: '2024-01-20 10:30 AM',
      category: 'others',
      hasImages: true,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400']
    },
    {
      id: 'ISS-002',
      title: 'Large Pothole on Central Road',
      description: 'Large pothole on Central Road causing traffic issues and vehicle damage. Multiple citizens have complained about this.',
      location: 'Central Road, Ward 3',
      urgency: 'high',
      status: 'verified',
      reportedBy: 'Jane Smith',
      reportedAt: '2024-01-19 02:15 PM',
      category: 'pothole',
      hasImages: true,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400']
    },
    {
      id: 'ISS-003',
      title: 'Garbage Collection Missed',
      description: 'Garbage not collected for 3 consecutive days in residential area. Causing health and hygiene issues.',
      location: 'Residential Area, Ward 7',
      urgency: 'medium',
      status: 'resolved',
      reportedBy: 'Ram Prasad',
      reportedAt: '2024-01-18 08:45 AM',
      category: 'garbage',
      hasImages: true,
      images: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400']
    },
    {
      id: 'ISS-004',
      title: 'Overflowing Dustbin in Market',
      description: 'Public dustbin is overflowing with waste and creating unhygienic conditions in the market area.',
      location: 'Market Area, Ward 2',
      urgency: 'medium',
      status: 'pending',
      reportedBy: 'Sita Devi',
      reportedAt: '2024-01-21 09:15 AM',
      category: 'garbage',
      hasImages: true,
      images: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400', 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400']
    },
    {
      id: 'ISS-005',
      title: 'Road Crack Development',
      description: 'Small crack in the road surface that might develop into a larger pothole if not addressed soon.',
      location: 'School Road, Ward 4',
      urgency: 'low',
      status: 'pending',
      reportedBy: 'Hari Kumar',
      reportedAt: '2024-01-20 03:45 PM',
      category: 'pothole',
      hasImages: false
    },
    {
      id: 'ISS-006',
      title: 'Illegal Garbage Dumping',
      description: 'Someone has been dumping construction waste in the public park area, causing environmental concerns.',
      location: 'City Park, Ward 1',
      urgency: 'high',
      status: 'verified',
      reportedBy: 'Maya Sharma',
      reportedAt: '2024-01-22 11:20 AM',
      category: 'garbage',
      hasImages: true,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400', 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400']
    }
  ]);

  const handleStatusChange = (issueId: string, newStatus: string) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus as Issue['status'] } : issue
      )
    );
    
    // Update selected issue if it's currently shown
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus as Issue['status'] });
    }
    
    toast({
      title: 'Status Updated',
      description: `Issue ${issueId} status changed to ${newStatus}`
    });
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowDetails(true);
  };

  const handleDeleteIssue = (issueId: string) => {
    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
    toast({
      title: 'Issue Deleted',
      description: `Issue ${issueId} has been deleted`
    });
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedIssue(null);
  };

  // Sort issues by urgency (high -> medium -> low)
  const urgencyOrder = { high: 3, medium: 2, low: 1 };
  
  const filteredIssues = issues
    .filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      const matchesUrgency = urgencyFilter === 'all' || issue.urgency === urgencyFilter;
      const matchesCategory = activeCategory === 'all' || issue.category === activeCategory;
      
      return matchesSearch && matchesStatus && matchesUrgency && matchesCategory;
    })
    .sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]);

  const getCategoryStats = (category: string) => {
    if (category === 'all') return issues.length;
    return issues.filter(i => i.category === category).length;
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen p-6">
      {/* Header */}
      <div className="municipal-card p-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">Civic Issues Management</h2>
        <p className="text-gray-600 text-lg">Monitor and manage reported civic issues by priority and category</p>
      </div>

      {/* Category Tabs */}
      <div className="municipal-card shadow-lg">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-8 py-6 text-base font-medium whitespace-nowrap border-b-3 transition-all duration-300 ${
              activeCategory === 'all'
                ? 'border-municipal-blue text-municipal-blue bg-gradient-to-r from-blue-50 to-municipal-blue/10'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              All Issues ({getCategoryStats('all')})
            </div>
          </button>
          <button
            onClick={() => setActiveCategory('garbage')}
            className={`px-8 py-6 text-base font-medium whitespace-nowrap border-b-3 transition-all duration-300 ${
              activeCategory === 'garbage'
                ? 'border-orange-500 text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            🗑️ Garbage Issues ({getCategoryStats('garbage')})
          </button>
          <button
            onClick={() => setActiveCategory('pothole')}
            className={`px-8 py-6 text-base font-medium whitespace-nowrap border-b-3 transition-all duration-300 ${
              activeCategory === 'pothole'
                ? 'border-purple-500 text-purple-600 bg-gradient-to-r from-purple-50 to-purple-100/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            🕳️ Pothole Issues ({getCategoryStats('pothole')})
          </button>
          <button
            onClick={() => setActiveCategory('others')}
            className={`px-8 py-6 text-base font-medium whitespace-nowrap border-b-3 transition-all duration-300 ${
              activeCategory === 'others'
                ? 'border-municipal-blue text-municipal-blue bg-gradient-to-r from-blue-50 to-blue-100/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚙️ Other Issues ({getCategoryStats('others')})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="municipal-card p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-municipal-blue" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="municipal-input pl-12 w-full text-base"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="municipal-input text-base"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="municipal-input text-base"
          >
            <option value="all">All Priority Levels</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteIssue}
          />
        ))}
        
        {filteredIssues.length === 0 && (
          <div className="municipal-card text-center py-16">
            <div className="text-gray-400 mb-6">
              <Clock className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-xl mb-2">No issues found</p>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          isOpen={showDetails}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteIssue}
        />
      )}
    </div>
  );
};

export default IssueManagement;
