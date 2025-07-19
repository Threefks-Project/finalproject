
import React, { useState, useEffect } from 'react';
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
  serialNumber?: number; // Add serial number for display
}

const IssueManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState<'all' | 'garbage' | 'pothole' | 'others'>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = '/api/reports';
    if (activeCategory !== 'all') {
      url += `?category=${activeCategory}`;
    }
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch issues');
        return res.json();
      })
      .then(data => {
        setIssues(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [activeCategory]);

  const handleStatusChange = (issueId: string, newStatus: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;
    fetch(`/api/reports/${issue.category}/${issueId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update status');
        setIssues(prevIssues =>
          prevIssues.map(i =>
            i.id === issueId ? { ...i, status: newStatus as Issue['status'] } : i
          )
        );
        if (selectedIssue && selectedIssue.id === issueId) {
          setSelectedIssue({ ...selectedIssue, status: newStatus as Issue['status'] });
        }
        toast({
          title: 'Status Updated',
          description: `Issue ${issueId} status changed to ${newStatus}`
        });
      })
      .catch(err => {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive'
        });
      });
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowDetails(true);
  };

  const handleDeleteIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;
    fetch(`/api/reports/${issue.category}/${issueId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete issue');
        setIssues(prevIssues => prevIssues.filter(i => i.id !== issueId));
        toast({
          title: 'Issue Deleted',
          description: `Issue ${issueId} has been deleted`
        });
        if (selectedIssue && selectedIssue.id === issueId) {
          setShowDetails(false);
          setSelectedIssue(null);
        }
      })
      .catch(err => {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive'
        });
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
    .sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency])
    .map((issue, index) => ({
      ...issue,
      serialNumber: index + 1 // Add serial number (1, 2, 3...)
    }));

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
                ? 'border-gray-500 text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚙️ Others ({getCategoryStats('others')})
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
        {loading && (
          <div className="municipal-card text-center py-16">
            <p className="text-gray-500 text-xl mb-2">Loading issues...</p>
          </div>
        )}
        {error && (
          <div className="municipal-card text-center py-16">
            <p className="text-red-500 text-xl mb-2">{error}</p>
          </div>
        )}
        {!loading && !error && filteredIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteIssue}
          />
        ))}
        {!loading && !error && filteredIssues.length === 0 && (
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
